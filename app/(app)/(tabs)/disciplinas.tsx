import { useAuth } from "@/src/hooks/useAuth";
import { subjectService } from "@/src/services/subject.service";
import { teacherService } from "@/src/services/teacher.service";
import { CreateSubjectData, Subject } from "@/src/types/subject.types";
import type { Teacher } from "@/src/types/teacher.types";
import { Search, X } from "@tamagui/lucide-icons";
import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import {
    Button,
    Input,
    ScrollView,
    Sheet,
    Text,
    View,
    XStack,
    YStack,
} from "tamagui";

export default function DisciplinasScreen() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const isAdmin = user?.user_type === "admin";
  const isTeacher = user?.user_type === "teacher";

  // Campos do formulário
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [numberOfGrades, setNumberOfGrades] = useState("");
  const [passingAverage, setPassingAverage] = useState("");
  const [recoveryAverage, setRecoveryAverage] = useState("");
  const [teacherId, setTeacherId] = useState("");

  // Lista de professores (para admin)
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [teachersMessage, setTeachersMessage] = useState<string | null>(null);
  const [isTeacherListOpen, setIsTeacherListOpen] = useState(false);

  // editar
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setEditingSubjectId(null);
    setName("");
    setCode("");
    setNumberOfGrades("");
    setPassingAverage("");
    setRecoveryAverage("");
    setTeacherId("");
    setIsTeacherListOpen(false);
    setErrors({});
  };

  const handleEdit = (subj: Subject) => {
    setEditingSubjectId(subj.id);
    setName(subj.name);
    setCode(subj.code);
    setNumberOfGrades(String(subj.number_of_grades));
    setPassingAverage(String(subj.passing_average));
    setRecoveryAverage(String(subj.recovery_average));
    setTeacherId(subj.teacher_id);
    setErrors({});
    setOpen(true);
  };

  // Estados para Alert customizado
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertButtons, setAlertButtons] = useState<
    { text: string; onPress?: () => void; style?: string }[]
  >([]);

  const showAlert = (
    title: string,
    message: string,
    buttons?: { text: string; onPress?: () => void; style?: string }[]
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertButtons(
      buttons || [{ text: "OK", onPress: () => setAlertVisible(false) }]
    );
    setAlertVisible(true);
  };

  const filterSubjects = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredSubjects(subjects);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = subjects.filter(
      (subject) =>
        subject.name.toLowerCase().includes(query) ||
        subject.code.toLowerCase().includes(query)
    );
    setFilteredSubjects(filtered);
  }, [searchQuery, subjects]);

  const loadSubjects = async () => {
    try {
      const data = await subjectService.getAll();
      setSubjects(data);
    } catch (error) {
      console.error("Erro ao buscar disciplinas:", error);
    }
  };

  const openAddModal = () => {
    setEditingSubjectId(null);
    setName("");
    setCode("");
    setNumberOfGrades("");
    setPassingAverage("");
    setRecoveryAverage("");
    setTeacherId("");
    resetForm();
    setOpen(true);
  };

  // Carregar disciplinas ao abrir tela
  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    filterSubjects();
  }, [filterSubjects]);

  // Carregar professores quando admin abrir o modal
  useEffect(() => {
    const loadTeachers = async () => {
      try {
        setLoadingTeachers(true);
        setTeachersMessage(null);
        const data = await teacherService.getAll();
        setTeachers(data);
        setTeachersMessage(
          data.length === 0 ? "Nenhum professor encontrado." : null
        );
      } catch (e) {
        console.error("Erro ao carregar professores:", e);
        setTeachersMessage("Não foi possível carregar professores.");
      } finally {
        setLoadingTeachers(false);
      }
    };
    if (open && isAdmin) {
      loadTeachers();
    }
  }, [open, isAdmin]);

  const saveSubject = async () => {
    // validação
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Nome é obrigatório";
    if (!code.trim()) newErrors.code = "Código é obrigatório";
    if (!numberOfGrades.trim())
      newErrors.numberOfGrades = "Quantidade de notas é obrigatória";
    if (!passingAverage.trim())
      newErrors.passingAverage = "Média para passar é obrigatória";
    if (!recoveryAverage.trim())
      newErrors.recoveryAverage = "Média de recuperação é obrigatória";
    // Se for admin, precisa selecionar um professor
    if (isAdmin && !teacherId.trim())
      newErrors.teacherId = "Professor é obrigatório";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // teacher_id: se for professor logado, usa o próprio id; se admin, usa o selecionado
    const teacherIdForPayload = isTeacher ? user?.id || "" : teacherId;

    const payload: CreateSubjectData = {
      name,
      code,
      number_of_grades: Number(numberOfGrades),
      passing_average: Number(passingAverage),
      recovery_average: Number(recoveryAverage),
      teacher_id: teacherIdForPayload,
    };

    try {
      setLoading(true);

      if (editingSubjectId) {
        await subjectService.update(editingSubjectId, payload);
        showAlert("Sucesso", "Disciplina atualizada com sucesso!");
      } else {
        showAlert("Sucesso", "Disciplina criada com sucesso!");
        await subjectService.create(payload);
      }

      setOpen(false);
      resetForm();

      await loadSubjects();
    } catch (error: any) {
      console.error("Erro em disciplinas:", error);

      const errorMessage = error.response?.data?.errors
        ? error.response.data.errors.join("\n")
        : error.response?.data?.error || "Erro ao criar/atualizar disciplina";

      if (error.response?.data?.errors) {
        showAlert("Erro em Disciplina", errorMessage);
      } else {
        showAlert("Erro em Disciplina", errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    showAlert(
      "Confirmação",
      "Tem certeza que deseja deletar esta disciplina?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          onPress: async () => {
            try {
              await subjectService.delete(id);
              await loadSubjects();
            } catch (error) {
              console.error("Erro ao deletar disciplina:", error);
              showAlert("Erro", "Não foi possível deletar a disciplina.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View flex={1} background="white" p="$4">
      <YStack p="$4" bg="#003866" rounded={15}>
        <XStack justify="space-between" items="center" mb="$6">
          <YStack>
            <Text
              fontSize={28}
              style={{ fontFamily: "Montserrat-Regular" }}
              fontWeight="bold"
              color="white"
            >
              Disciplinas
            </Text>
            <Text
              fontSize={14}
              style={{ fontFamily: "Montserrat-Regular" }}
              color="rgba(255,255,255,0.8)"
            >
              {`${subjects.length} ${subjects.length === 1 ? "disciplina cadastrada" : "disciplinas cadastradas"}`}
            </Text>
          </YStack>
          <Button
            onPress={openAddModal}
            bg="white"
            color="#003866"
            rounded={15}
            px="$5"
            height={44}
          >
            <Text
              color="#003866"
              fontWeight={"600"}
              style={{ fontFamily: "Montserrat-Regular" }}
            >
              + Criar
            </Text>
          </Button>
        </XStack>

        <XStack
          bg="rgba(255,255,255,0.2)"
          rounded={15}
          px="$4"
          py="$2"
          items="center"
          gap="$2"
        >
          <Search size={20} color="rgba(255,255,255,0.7)" />
          <Input
            flex={1}
            placeholder="Buscar disciplinas..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            bg="transparent"
            borderWidth={0}
            color="white"
            fontSize={16}
            style={{ fontFamily: "Montserrat-Regular" }}
          />
        </XStack>
      </YStack>

      {/* Lista */}
      <ScrollView flex={1} bg="white" pt="$4">
        <YStack gap="$3" px="$4" pb="$6">
          {filteredSubjects.map((subj) => (
            <YStack
              key={subj.id}
              background="#fff"
              p="$4"
              rounded={16}
              shadowColor="#000"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.05}
              shadowRadius={8}
              borderWidth={1}
              borderColor="#F3F4F6"
            >
              <Text
                fontSize="$6"
                fontWeight="700"
                color="#111827"
                style={{ fontFamily: "Montserrat-Regular" }}
              >
                {subj.name}
              </Text>
              <Text
                color="#6B7280"
                mt="$2"
                style={{ fontFamily: "Montserrat-Regular" }}
              >
                {`Código: ${subj.code}`}
              </Text>
              <Text
                color="#6B7280"
                mt="$1"
                style={{ fontFamily: "Montserrat-Regular" }}
              >
                {`Notas: ${subj.number_of_grades} · Média: ${subj.passing_average}`}
              </Text>

              <XStack mt="$3" gap="$2">
                <Button
                  width={"50%"}
                  theme="accent"
                  onPress={() => handleEdit(subj)}
                >
                  <Text style={{ fontFamily: "Montserrat-Regular" }} color="#374151">
                    Editar
                  </Text>
                </Button>
                <Button
                  width={"50%"}
                  theme="red"
                  onPress={() => handleDelete(subj.id)}
                >
                  <Text style={{ fontFamily: "Montserrat-Regular" }}>
                    Deletar
                  </Text>
                </Button>
              </XStack>
            </YStack>
          ))}
          {filteredSubjects.length === 0 && (
            <YStack items="center" py="$8">
              <Text
                color="#6B7280"
                fontSize={16}
                style={{ fontFamily: "Montserrat-Regular" }}
              >
                {searchQuery
                  ? "Nenhuma disciplina encontrada"
                  : "A disciplina digitada não foi encontrada "}
              </Text>
            </YStack>
          )}
        </YStack>
      </ScrollView>

      {/* Modal */}
      {open && (
        <Sheet
          open={true}
          onOpenChange={(val) => {
            if (!val) {
              setOpen(false);
              resetForm();
            }
          }}
          snapPoints={[90]}
          dismissOnSnapToBottom
          modal
          zIndex={100000}
        >
        <Sheet.Overlay
          bg="rgba(0,0,0,0.5)"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame
          p="$4"
          bg="white"
          borderTopLeftRadius={20}
          borderTopRightRadius={20}
        >
          <YStack gap="$4">
            <XStack justify="space-between" items="center">
              <Text
                fontSize={24}
                fontWeight="bold"
                style={{ fontFamily: "Montserrat-Regular" }}
                color="#111827"
              >
                {editingSubjectId
                  ? "Editar Disciplina"
                  : "Cadastro de Disciplina"}
              </Text>
              <Button
                onPress={() => setOpen(false)}
                bg="transparent"
                p={0}
                width={32}
                height={32}
                circular
              >
                <X size={24} color="#6B7280" />
              </Button>
            </XStack>

            <YStack gap="$2">
              <Text
                fontSize={14}
                fontWeight="600"
                style={{ fontFamily: "Montserrat-Regular" }}
                color="#374151"
              >
                Nome *
              </Text>
              <Input
                placeholder="Digite o nome da disciplina"
                value={name}
                onChangeText={(v) => {
                  setName(v);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
                autoCapitalize="none"
                bg="#F3F4F6"
                borderWidth={1}
                borderColor={errors.name ? "#dc2626" : "#E5E7EB"}
                rounded={12}
                px="$3"
                height={52}
                fontSize={16}
                color="#111827"
                style={{ fontFamily: "Montserrat-Regular" }}
              />
              {errors.name ? (
                <Text
                  color="#b91c1c"
                  fontSize="$3"
                  style={{ fontFamily: "Montserrat-Regular" }}
                >
                  {errors.name}
                </Text>
              ) : null}
            </YStack>

            <YStack gap="$2">
              <Text
                fontSize={14}
                fontWeight="600"
                style={{ fontFamily: "Montserrat-Regular" }}
                color="#374151"
              >
                Código *
              </Text>
              <Input
                placeholder="Digite o código da disciplina"
                value={code}
                onChangeText={(v) => {
                  setCode(v);
                  if (errors.code) setErrors((prev) => ({ ...prev, code: "" }));
                }}
                autoCapitalize="none"
                bg="#F3F4F6"
                borderWidth={1}
                borderColor={errors.code ? "#dc2626" : "#E5E7EB"}
                rounded={12}
                px="$3"
                height={52}
                fontSize={16}
                color="#111827"
                style={{ fontFamily: "Montserrat-Regular" }}
              />
              {errors.code ? (
                <Text
                  color="#b91c1c"
                  fontSize="$3"
                  style={{ fontFamily: "Montserrat-Regular" }}
                >
                  {errors.code}
                </Text>
              ) : null}
            </YStack>

            <YStack gap="$2">
              <Text
                fontSize={14}
                fontWeight="600"
                style={{ fontFamily: "Montserrat-Regular" }}
                color="#374151"
              >
                Quantidade de notas *
              </Text>
              <Input
                placeholder="Digite a quantidade de notas"
                keyboardType="numeric"
                value={numberOfGrades}
                onChangeText={(v) => {
                  setNumberOfGrades(v);
                  if (errors.numberOfGrades)
                    setErrors((prev) => ({ ...prev, numberOfGrades: "" }));
                }}
                bg="#F3F4F6"
                borderWidth={1}
                borderColor={errors.numberOfGrades ? "#dc2626" : "#E5E7EB"}
                rounded={12}
                px="$3"
                height={52}
                fontSize={16}
                color="#111827"
                style={{ fontFamily: "Montserrat-Regular" }}
              />
              {errors.numberOfGrades ? (
                <Text
                  color="#b91c1c"
                  fontSize="$3"
                  style={{ fontFamily: "Montserrat-Regular" }}
                >
                  {errors.numberOfGrades}
                </Text>
              ) : null}
            </YStack>

            <YStack gap="$2">
              <Text
                fontSize={14}
                fontWeight="600"
                style={{ fontFamily: "Montserrat-Regular" }}
                color="#374151"
              >
                Média para passar *
              </Text>
              <Input
                placeholder="Digite a média para passar"
                keyboardType="numeric"
                value={passingAverage}
                onChangeText={(v) => {
                  setPassingAverage(v);
                  if (errors.passingAverage)
                    setErrors((prev) => ({ ...prev, passingAverage: "" }));
                }}
                bg="#F3F4F6"
                borderWidth={1}
                borderColor={errors.passingAverage ? "#dc2626" : "#E5E7EB"}
                rounded={12}
                px="$3"
                height={52}
                fontSize={16}
                color="#111827"
                style={{ fontFamily: "Montserrat-Regular" }}
              />
              {errors.passingAverage ? (
                <Text
                  color="#b91c1c"
                  fontSize="$3"
                  style={{ fontFamily: "Montserrat-Regular" }}
                >
                  {errors.passingAverage}
                </Text>
              ) : null}
            </YStack>

            <YStack gap="$2">
              <Text
                fontSize={14}
                fontWeight="600"
                style={{ fontFamily: "Montserrat-Regular" }}
                color="#374151"
              >
                Média de recuperação *
              </Text>
              <Input
                placeholder="Digite a média de recuperação"
                keyboardType="numeric"
                value={recoveryAverage}
                onChangeText={(v) => {
                  setRecoveryAverage(v);
                  if (errors.recoveryAverage)
                    setErrors((prev) => ({ ...prev, recoveryAverage: "" }));
                }}
                bg="#F3F4F6"
                borderWidth={1}
                borderColor={errors.recoveryAverage ? "#dc2626" : "#E5E7EB"}
                rounded={12}
                px="$3"
                height={52}
                fontSize={16}
                color="#111827"
                style={{ fontFamily: "Montserrat-Regular" }}
              />
              {errors.recoveryAverage ? (
                <Text
                  color="#b91c1c"
                  fontSize="$3"
                  style={{ fontFamily: "Montserrat-Regular" }}
                >
                  {errors.recoveryAverage}
                </Text>
              ) : null}
            </YStack>

            {/* Seleção de professor apenas para ADMIN (Dropdown) */}
            {isAdmin && (
              <YStack gap="$2" mt="$3">
                <Text
                  fontWeight="700"
                  style={{ fontFamily: "Montserrat-Regular" }}
                >
                  Professor:
                </Text>
                <YStack>
                  <TouchableOpacity
                    onPress={() => {
                      if (
                        !loadingTeachers &&
                        !teachersMessage &&
                        teachers.length > 0
                      ) {
                        setIsTeacherListOpen((o) => !o);
                      }
                    }}
                    style={{
                      padding: 12,
                      backgroundColor: "#F3F4F6",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: errors.teacherId ? "#dc2626" : "#E5E7EB",
                      height: 52,
                    }}
                  >
                    <Text
                      color="#6b7280"
                      style={{ fontFamily: "Montserrat-Regular" }}
                    >
                      {loadingTeachers
                        ? "Carregando professores..."
                        : teacherId
                        ? teachers.find((t) => t.id === teacherId)?.name ||
                          "Selecione um professor"
                        : teachersMessage ?? "Selecione um professor"}
                    </Text>
                    <Text color="#9ca3af" style={{ fontFamily: "Montserrat-Regular" }}>
                      {isTeacherListOpen ? "▲" : "▼"}
                    </Text>
                  </TouchableOpacity>
                  {!loadingTeachers &&
                  !teachersMessage &&
                  teachers.length > 0 &&
                  isTeacherListOpen ? (
                    <ScrollView style={{ maxHeight: 200 }}>
                      {teachers.map((t) => (
                        <TouchableOpacity
                          key={t.id}
                          onPress={() => {
                            setTeacherId(t.id);
                            if (errors.teacherId)
                              setErrors((prev) => ({ ...prev, teacherId: "" }));
                            setIsTeacherListOpen(false);
                          }}
                          style={{
                            padding: 12,
                            backgroundColor:
                              teacherId === t.id ? "#eef2ff" : "white",
                            borderBottomWidth: 1,
                            borderBottomColor: "#F3F4F6",
                          }}
                        >
                          <Text style={{ fontFamily: "Montserrat-Regular" }}>
                            {t.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  ) : null}
                </YStack>
                {errors.teacherId ? (
                  <Text color="#b91c1c" fontSize="$3">
                    {errors.teacherId}
                  </Text>
                ) : null}
              </YStack>
            )}

            <YStack gap="$3" mt="$2">
              <Button
                onPress={saveSubject}
                bg="#3B82F6"
                rounded={12}
                height={52}
                fontSize={16}
                fontWeight="600"
                disabled={loading}
                pressStyle={{ opacity: 0.8 }}
              >
                <Text color="#fff" style={{ fontFamily: "Montserrat-Regular", fontWeight: "700" }}>
                  {loading ? "Salvando..." : editingSubjectId ? "Atualizar Disciplina" : "Cadastrar Disciplina"}
                </Text>
              </Button>

              <Button
                onPress={() => setOpen(false)}
                bg="#F3F4F6"
                borderWidth={0}
                rounded={12}
                height={52}
                fontSize={16}
                fontWeight="600"
                disabled={loading}
              >
                <Text
                  color="#4B5563"
                  style={{ fontFamily: "Montserrat-Regular", fontWeight: "600" }}
                >
                  Cancelar
                </Text>
              </Button>
            </YStack>
          </YStack>
        </Sheet.Frame>
        </Sheet>
      )}

      {/* ALERT CUSTOMIZADO */}
      {alertVisible && (
        <View
          position="absolute"
          p="$4"
          background={alertTitle === "Sucesso" ? "#d1fae5" : "#fee2e2"}
          borderWidth={1}
          borderColor={alertTitle === "Sucesso" ? "#10b981" : "#fca5a5"}
          pointerEvents="auto"
          style={{
            top: 10,
            left: 10,
            right: 10,
            borderRadius: 12,
            zIndex: 999999,
            elevation: 30,
          }}
        >
          <Text
            fontSize="$6"
            fontWeight="bold"
            color={alertTitle === "Sucesso" ? "#047857" : "#b91c1c"}
            style={{ fontFamily: "Montserrat-Regular" }}
          >
            {alertTitle}
          </Text>

          <Text
            mt="$2"
            color={alertTitle === "Sucesso" ? "#047857" : "#7f1d1d"}
            style={{ fontFamily: "Montserrat-Regular" }}
          >
            {alertMessage}
          </Text>

          <XStack justify="flex-end" mt="$4">
            {alertButtons.map((btn, index) => (
              <Button
                key={index}
                onPress={() => {
                  btn.onPress?.();
                  setAlertVisible(false);
                }}
                ml="$2"
                bg={index === 0 ? "black" : "#e11d1d"}
                hoverStyle={{ bg: index === 0 ? "#333" : "#b91c1c" }}
              >
                <Text
                  color={"#fff"}
                  style={{ fontFamily: "Montserrat-Regular" }}
                >
                  {btn.text}
                </Text>
              </Button>
            ))}
          </XStack>
        </View>
      )}
    </View>
  );
}
