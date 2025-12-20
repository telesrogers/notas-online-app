import { gradeService } from "@/src/services/grade.service";
import { studentService } from "@/src/services/student.service";
import { subjectService } from "@/src/services/subject.service";
import { CreateGradeData, Grade } from "@/src/types/grade.types";
import { Student } from "@/src/types/student.types";
import { Subject } from "@/src/types/subject.types";
import {
    BookOpen,
    GraduationCap,
    Plus,
    Search,
    X,
} from "@tamagui/lucide-icons";
import { useCallback, useEffect, useState } from "react";
import {
    Button,
    Input,
    ScrollView,
    Sheet,
    Spinner,
    Text,
    View,
    XStack,
    YStack,
} from "tamagui";

type FilterType = "all" | "student" | "subject";

export default function NotasScreen() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredGrades, setFilteredGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [filterType, setFilterType] = useState<FilterType>("all");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentGrade, setCurrentGrade] = useState<Grade | null>(null);
  const [editAllScoresData, setEditAllScoresData] = useState<number[]>([]);

  const [formData, setFormData] = useState<CreateGradeData>({
    student_id: "",
    subject_id: "",
    scores: [],
  });
  const [scoreInput, setScoreInput] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const filterGrades = useCallback(() => {
    let filtered = [...grades];

    // Filtrar por tipo (student/subject/all)
    if (filterType === "student" && selectedStudentId) {
      filtered = filtered.filter((g) => g.student_id === selectedStudentId);
    } else if (filterType === "subject" && selectedSubjectId) {
      filtered = filtered.filter((g) => g.subject_id === selectedSubjectId);
    }

    // Filtrar por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((grade) => {
        const studentName = getStudentName(grade.student_id).toLowerCase();
        const subjectName = getSubjectName(grade.subject_id).toLowerCase();
        return studentName.includes(query) || subjectName.includes(query);
      });
    }

    setFilteredGrades(filtered);
  }, [grades, filterType, selectedStudentId, selectedSubjectId, searchQuery]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    filterGrades();
  }, [filterGrades]);

  // Verificar se já existe nota quando selecionar aluno e disciplina
  useEffect(() => {
    if (open && formData.student_id && formData.subject_id) {
      const existingGrade = grades.find(
        (g) =>
          g.student_id === formData.student_id &&
          g.subject_id === formData.subject_id
      );

      if (existingGrade) {
        // Fechar modal de criação e abrir modal de edição
        setOpen(false);
        setAlertMessage(
          "Já existe uma nota cadastrada para este aluno nesta disciplina."
        );
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          openEditModal(existingGrade);
        }, 2000);
      }
    }
  }, [formData.student_id, formData.subject_id, open, grades]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [gradesData, studentsData, subjectsData] = await Promise.all([
        gradeService.getAll(),
        studentService.getAll(),
        subjectService.getAll(),
      ]);
      setGrades(gradesData);
      setStudents(studentsData);
      setSubjects(subjectsData);
    } catch (error: any) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadGrades = async () => {
    try {
      const gradesData = await gradeService.getAll();
      setGrades(gradesData);
    } catch (error: any) {
      console.error("Erro ao carregar notas:", error);
    }
  };

  const openAddModal = () => {
    setCurrentGrade(null);
    resetForm();
    setOpen(true);
  };

  const openEditModal = (grade: Grade) => {
    setCurrentGrade(grade);
    setEditAllScoresData([...grade.scores]);
    setEditOpen(true);
  };

  const handleCreateGrade = async () => {
    if (!formData.student_id || !formData.subject_id) {
      console.warn("Selecione um aluno e uma disciplina");
      return;
    }
    if (formData.scores.length === 0) {
      console.warn("Adicione pelo menos uma nota");
      return;
    }

    // Verificar se já existe nota para esta combinação
    const existingGrade = grades.find(
      (g) =>
        g.student_id === formData.student_id &&
        g.subject_id === formData.subject_id
    );

    if (existingGrade) {
      alert(
        "Já existe uma nota cadastrada para este aluno nesta disciplina. Use o botão Editar para modificá-la."
      );
      return;
    }

    try {
      setLoading(true);
      await gradeService.create(formData);
      setOpen(false);
      resetForm();
      await loadGrades();
    } catch (error: any) {
      console.error("Erro ao criar nota:", error);
      const errorMessage =
        error.response?.data?.errors?.join("\n") ||
        error.response?.data?.error ||
        "Erro ao criar nota";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddScore = () => {
    const score = parseFloat(scoreInput);
    if (isNaN(score) || score < 0 || score > 10) {
      console.warn("Digite uma nota válida entre 0 e 10");
      return;
    }
    setFormData({
      ...formData,
      scores: [...formData.scores, score],
    });
    setScoreInput("");
  };

  const handleRemoveScore = (index: number) => {
    setFormData({
      ...formData,
      scores: formData.scores.filter((_, i) => i !== index),
    });
  };

  const handleUpdateScoreInList = (index: number, value: string) => {
    const newScores = [...editAllScoresData];
    const score = parseFloat(value);
    if (!isNaN(score) && score >= 0 && score <= 10) {
      newScores[index] = score;
      setEditAllScoresData(newScores);
    }
  };

  const handleAddScoreToList = () => {
    setEditAllScoresData([...editAllScoresData, 0]);
  };

  const handleRemoveScoreFromList = (index: number) => {
    setEditAllScoresData(editAllScoresData.filter((_, i) => i !== index));
  };

  const handleSaveAllScores = async () => {
    if (!currentGrade) return;

    if (editAllScoresData.length === 0) {
      console.warn("Adicione pelo menos uma nota");
      return;
    }

    const hasInvalidScore = editAllScoresData.some(
      (score) => isNaN(score) || score < 0 || score > 10
    );
    if (hasInvalidScore) {
      console.warn("Todas as notas devem estar entre 0 e 10");
      return;
    }

    try {
      setLoading(true);
      await gradeService.updateAllScores(currentGrade.id, {
        scores: editAllScoresData,
      });
      setEditOpen(false);
      setEditAllScoresData([]);
      setCurrentGrade(null);
      await loadGrades();
    } catch (error: any) {
      console.error("Erro ao atualizar notas:", error);
      const errorMessage =
        error.response?.data?.errors?.join("\n") ||
        error.response?.data?.error ||
        "Erro ao atualizar notas";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      student_id: "",
      subject_id: "",
      scores: [],
    });
    setScoreInput("");
  };

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    return student?.name || "Desconhecido";
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId);
    return subject?.name || "Desconhecida";
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "approved":
        return { color: "#10B981", bg: "#D1FAE5", text: "Aprovado" };
      case "recovery":
        return { color: "#F59E0B", bg: "#FEF3C7", text: "Recuperação" };
      case "failed":
        return { color: "#EF4444", bg: "#FEE2E2", text: "Reprovado" };
      default:
        return { color: "#6B7280", bg: "#F3F4F6", text: "Incompleto" };
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const groupGradesByStudent = () => {
    const grouped: { [key: string]: Grade[] } = {};
    filteredGrades.forEach((grade) => {
      if (!grouped[grade.student_id]) {
        grouped[grade.student_id] = [];
      }
      grouped[grade.student_id].push(grade);
    });
    return Object.entries(grouped).map(([studentId, studentGrades]) => ({
      studentId,
      studentName: getStudentName(studentId),
      grades: studentGrades,
    }));
  };

  const groupedGrades = groupGradesByStudent();

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
              Notas
            </Text>
            <Text
              fontSize={14}
              style={{ fontFamily: "Montserrat-Regular" }}
              color="rgba(255,255,255,0.8)"
            >
              {filteredGrades.length} registro(s) de notas
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
          mb="$3"
        >
          <Search size={20} color="rgba(255,255,255,0.7)" />
          <Input
            flex={1}
            placeholder="Buscar por aluno ou disciplina..."
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

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack gap="$2">
            <Button
              size="$3"
              bg={filterType === "all" ? "white" : "rgba(255,255,255,0.2)"}
              onPress={() => {
                setFilterType("all");
                setSelectedStudentId("");
                setSelectedSubjectId("");
              }}
              rounded={10}
            >
              <Text
                color={filterType === "all" ? "#003866" : "white"}
                fontWeight={"600"}
                fontSize={14}
                style={{ fontFamily: "Montserrat-Regular" }}
              >
                Todas
              </Text>
            </Button>
            <Button
              size="$3"
              bg={filterType === "student" ? "white" : "rgba(255,255,255,0.2)"}
              onPress={() => setFilterType("student")}
              rounded={10}
            >
              <Text
                color={filterType === "student" ? "#003866" : "white"}
                fontWeight={"600"}
                fontSize={14}
                style={{ fontFamily: "Montserrat-Regular" }}
              >
                Por Aluno
              </Text>
            </Button>
            <Button
              size="$3"
              bg={filterType === "subject" ? "white" : "rgba(255,255,255,0.2)"}
              onPress={() => setFilterType("subject")}
              rounded={10}
            >
              <Text
                color={filterType === "subject" ? "#003866" : "white"}
                fontWeight={"600"}
                fontSize={14}
                style={{ fontFamily: "Montserrat-Regular" }}
              >
                Por Disciplina
              </Text>
            </Button>
          </XStack>
        </ScrollView>

        {filterType === "student" && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} mt="$3">
            <XStack gap="$2">
              {students.map((student) => (
                <Button
                  key={student.id}
                  size="$3"
                  bg={
                    selectedStudentId === student.id
                      ? "#10B981"
                      : "rgba(255,255,255,0.15)"
                  }
                  onPress={() => setSelectedStudentId(student.id)}
                  rounded={10}
                >
                  <Text
                    color="white"
                    fontSize={13}
                    fontWeight={"600"}
                    style={{ fontFamily: "Montserrat-Regular" }}
                  >
                    {student.name}
                  </Text>
                </Button>
              ))}
            </XStack>
          </ScrollView>
        )}

        {filterType === "subject" && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} mt="$3">
            <XStack gap="$2">
              {subjects.map((subject) => (
                <Button
                  key={subject.id}
                  size="$3"
                  bg={
                    selectedSubjectId === subject.id
                      ? "#10B981"
                      : "rgba(255,255,255,0.15)"
                  }
                  onPress={() => setSelectedSubjectId(subject.id)}
                  rounded={10}
                >
                  <Text
                    color="white"
                    fontSize={13}
                    fontWeight={"600"}
                    style={{ fontFamily: "Montserrat-Regular" }}
                  >
                    {subject.name}
                  </Text>
                </Button>
              ))}
            </XStack>
          </ScrollView>
        )}
      </YStack>

      <ScrollView flex={1} bg="white" pt="$4">
        <YStack gap="$3" px="$4" pb="$6">
          {loading ? (
            <YStack items="center" py="$8">
              <Spinner size="large" color="#003866" />
              <Text
                mt="$3"
                color="#6B7280"
                style={{ fontFamily: "Montserrat-Regular" }}
              >
                Carregando notas...
              </Text>
            </YStack>
          ) : groupedGrades.length === 0 ? (
            <YStack items="center" py="$8">
              <Text
                color="#6B7280"
                fontSize={16}
                style={{ fontFamily: "Montserrat-Regular" }}
              >
                {searchQuery
                  ? "Nenhuma nota encontrada"
                  : "Nenhuma nota cadastrada"}
              </Text>
            </YStack>
          ) : (
            groupedGrades.map((item) => (
              <YStack
                key={item.studentId}
                bg="white"
                rounded={16}
                p="$4"
                shadowColor="#000"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.1}
                shadowRadius={8}
                elevation={3}
                borderWidth={1}
                borderColor="#F3F4F6"
              >
                <XStack gap="$3" items="flex-start" mb="$3">
                  <View
                    width={56}
                    height={56}
                    rounded={28}
                    bg="#E5E7EB"
                    items="center"
                    justify="center"
                  >
                    <Text
                      fontSize={18}
                      fontWeight="600"
                      style={{ fontFamily: "Montserrat-Regular" }}
                      color="#6B7280"
                    >
                      {getInitials(item.studentName)}
                    </Text>
                  </View>

                  <YStack flex={1}>
                    <Text
                      fontSize={18}
                      fontWeight="bold"
                      style={{ fontFamily: "Montserrat-Regular" }}
                      color="#111827"
                    >
                      {item.studentName}
                    </Text>
                    <Text
                      fontSize={14}
                      style={{ fontFamily: "Montserrat-Regular" }}
                      color="#6B7280"
                    >
                      {item.grades.length} disciplina(s)
                    </Text>
                  </YStack>
                </XStack>

                {item.grades.map((grade) => (
                  <YStack
                    key={grade.id}
                    bg="#F9FAFB"
                    rounded={12}
                    p="$3"
                    mb="$2"
                  >
                    <XStack justify="space-between" items="center" mb="$2">
                      <XStack gap="$2" items="center" flex={1}>
                        <BookOpen size={16} color="#6B7280" />
                        <Text
                          fontSize={15}
                          fontWeight="600"
                          style={{ fontFamily: "Montserrat-Regular" }}
                          color="#374151"
                          flex={1}
                        >
                          {getSubjectName(grade.subject_id)}
                        </Text>
                      </XStack>
                      <View
                        bg={getStatusInfo(grade.status).bg}
                        px="$3"
                        py="$1.5"
                        rounded={12}
                      >
                        <Text
                          fontSize={12}
                          fontWeight="700"
                          style={{ fontFamily: "Montserrat-Regular" }}
                          color={getStatusInfo(grade.status).color}
                        >
                          {getStatusInfo(grade.status).text}
                        </Text>
                      </View>
                    </XStack>

                    <XStack gap="$2" flexWrap="wrap" items="center" mb="$2">
                      {grade.scores.map((score, index) => (
                        <View
                          key={index}
                          bg="#E3F2FD"
                          px="$3"
                          py="$1.5"
                          rounded={10}
                        >
                          <Text
                            fontSize={14}
                            fontWeight="600"
                            style={{ fontFamily: "Montserrat-Regular" }}
                            color="#0075BE"
                          >
                            {score.toFixed(1)}
                          </Text>
                        </View>
                      ))}
                    </XStack>

                    <XStack justify="space-between" items="center">
                      <Text
                        fontSize={14}
                        fontWeight="600"
                        style={{ fontFamily: "Montserrat-Regular" }}
                        color="#6B7280"
                      >
                        Média: {grade.average.toFixed(2)}
                      </Text>
                      <Button
                        onPress={() => openEditModal(grade)}
                        bg="transparent"
                        borderWidth={1}
                        borderColor="#E5E7EB"
                        color="#374151"
                        rounded={10}
                        height={32}
                        px="$3"
                      >
                        <Text
                          fontSize={13}
                          fontWeight={"600"}
                          style={{ fontFamily: "Montserrat-Regular" }}
                          color="#374151"
                        >
                          Editar
                        </Text>
                      </Button>
                    </XStack>
                  </YStack>
                ))}
              </YStack>
            ))
          )}
        </YStack>
      </ScrollView>

      {/* Sheet para Criar Nova Nota */}
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
        <Sheet.Overlay bg="rgba(0,0,0,0.5)" />
        <Sheet.Frame
          bg="white"
          borderTopLeftRadius={20}
          borderTopRightRadius={20}
          p="$4"
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <YStack gap="$4">
              <XStack justify="space-between" items="center">
                <Text
                  fontSize={24}
                  fontWeight="bold"
                  style={{ fontFamily: "Montserrat-Regular" }}
                  color="#111827"
                >
                  {currentGrade ? "Editar Nota" : "Adicionar Nova Nota"}
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

              <YStack gap="$3">
                <YStack gap="$2">
                  <Text
                    fontSize={14}
                    fontWeight="600"
                    style={{ fontFamily: "Montserrat-Regular" }}
                    color="#374151"
                  >
                    Aluno *
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <XStack gap="$2">
                      {students.map((student) => (
                        <Button
                          key={student.id}
                          size="$3"
                          bg={
                            formData.student_id === student.id
                              ? "#0075BE"
                              : "#F3F4F6"
                          }
                          onPress={() =>
                            setFormData({ ...formData, student_id: student.id })
                          }
                          rounded={10}
                        >
                          <Text
                            color={
                              formData.student_id === student.id
                                ? "white"
                                : "#374151"
                            }
                            fontSize={13}
                            fontWeight={"600"}
                            style={{ fontFamily: "Montserrat-Regular" }}
                          >
                            {student.name}
                          </Text>
                        </Button>
                      ))}
                    </XStack>
                  </ScrollView>
                </YStack>

                <YStack gap="$2">
                  <Text
                    fontSize={14}
                    fontWeight="600"
                    style={{ fontFamily: "Montserrat-Regular" }}
                    color="#374151"
                  >
                    Disciplina *
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <XStack gap="$2">
                      {subjects.map((subject) => (
                        <Button
                          key={subject.id}
                          size="$3"
                          bg={
                            formData.subject_id === subject.id
                              ? "#0075BE"
                              : "#F3F4F6"
                          }
                          onPress={() =>
                            setFormData({
                              ...formData,
                              subject_id: subject.id,
                            })
                          }
                          rounded={10}
                        >
                          <Text
                            color={
                              formData.subject_id === subject.id
                                ? "white"
                                : "#374151"
                            }
                            fontSize={13}
                            fontWeight={"600"}
                            style={{ fontFamily: "Montserrat-Regular" }}
                          >
                            {subject.name}
                          </Text>
                        </Button>
                      ))}
                    </XStack>
                  </ScrollView>
                </YStack>

                <YStack gap="$2">
                  <Text
                    fontSize={14}
                    fontWeight="600"
                    style={{ fontFamily: "Montserrat-Regular" }}
                    color="#374151"
                  >
                    Notas (0-10) *
                  </Text>
                  <XStack gap="$2">
                    <Input
                      flex={1}
                      placeholder="Digite a nota"
                      value={scoreInput}
                      onChangeText={setScoreInput}
                      keyboardType="numeric"
                      autoCapitalize="none"
                      bg="#F3F4F6"
                      borderWidth={1}
                      borderColor="#E5E7EB"
                      rounded={12}
                      px="$3"
                      py="$3.5"
                      height={52}
                      fontSize={16}
                      shadowColor="transparent"
                      elevation={0}
                      style={{ fontFamily: "Montserrat-Regular", textShadowColor: "transparent", lineHeight: 22 }}
                    />
                    <Button
                      onPress={handleAddScore}
                      bg="#10B981"
                      rounded={12}
                      width={52}
                      height={52}
                    >
                      <Plus size={20} color="white" />
                    </Button>
                  </XStack>

                  {formData.scores.length > 0 && (
                    <YStack bg="#F9FAFB" rounded={12} p="$3" gap="$2">
                      <XStack gap="$2" flexWrap="wrap">
                        {formData.scores.map((score, index) => (
                          <XStack
                            key={index}
                            bg="#E3F2FD"
                            px="$3"
                            py="$2"
                            rounded={10}
                            gap="$2"
                            items="center"
                          >
                            <Text
                              fontSize={14}
                              fontWeight="600"
                              style={{ fontFamily: "Montserrat-Regular" }}
                              color="#0075BE"
                            >
                              {score.toFixed(1)}
                            </Text>
                            <Button
                              onPress={() => handleRemoveScore(index)}
                              bg="transparent"
                              p={0}
                              width={20}
                              height={20}
                            >
                              <X size={16} color="#EF4444" />
                            </Button>
                          </XStack>
                        ))}
                      </XStack>
                    </YStack>
                  )}
                </YStack>
              </YStack>

              <YStack gap="$3" mt="$2">
                <Button
                  onPress={handleCreateGrade}
                  bg="#0075BE"
                  color="white"
                  rounded={12}
                  height={52}
                  fontSize={16}
                  fontWeight="600"
                  disabled={loading}
                  hoverStyle={{ bg: "#0e2b5a" }}
                >
                  <Text
                    color="#fff"
                    style={{ fontFamily: "Montserrat-Regular" }}
                  >
                    {loading ? "Salvando..." : "Criar Nota"}
                  </Text>
                </Button>

                <Button
                  onPress={() => setOpen(false)}
                  bg="transparent"
                  borderWidth={1}
                  borderColor="#E5E7EB"
                  color="#374151"
                  rounded={12}
                  height={52}
                  fontSize={16}
                  fontWeight="600"
                >
                  <Text style={{ fontFamily: "Montserrat-Regular" }} color="#374151">
                    Cancelar
                  </Text>
                </Button>
              </YStack>
            </YStack>
          </ScrollView>
        </Sheet.Frame>
        </Sheet>
      )}

      {/* Sheet para Editar Notas */}
      <Sheet
        forceRemoveScrollEnabled
        open={editOpen}
        onOpenChange={(val) => {
          setEditOpen(val);
          if (!val) {
            setEditAllScoresData([]);
            setCurrentGrade(null);
          }
        }}
        snapPoints={[90]}
        dismissOnSnapToBottom
        modal
        zIndex={100000}
      >
        <Sheet.Overlay bg="rgba(0,0,0,0.5)" />
        <Sheet.Frame
          bg="white"
          borderTopLeftRadius={20}
          borderTopRightRadius={20}
          p="$4"
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <YStack gap="$4">
              <XStack justify="space-between" items="center">
                <Text
                  fontSize={24}
                  fontWeight="bold"
                  style={{ fontFamily: "Montserrat-Regular" }}
                  color="#111827"
                >
                  Editar Notas
                </Text>
                <Button
                  onPress={() => setEditOpen(false)}
                  bg="transparent"
                  p={0}
                  width={32}
                  height={32}
                  circular
                >
                  <X size={24} color="#6B7280" />
                </Button>
              </XStack>

              {currentGrade && (
                <YStack bg="#F9FAFB" rounded={12} p="$3" gap="$1">
                  <XStack gap="$2" items="center">
                    <GraduationCap size={16} color="#6B7280" />
                    <Text
                      fontSize={14}
                      style={{ fontFamily: "Montserrat-Regular" }}
                      color="#6B7280"
                    >
                      Aluno: {getStudentName(currentGrade.student_id)}
                    </Text>
                  </XStack>
                  <XStack gap="$2" items="center">
                    <BookOpen size={16} color="#6B7280" />
                    <Text
                      fontSize={14}
                      style={{ fontFamily: "Montserrat-Regular" }}
                      color="#6B7280"
                    >
                      Disciplina: {getSubjectName(currentGrade.subject_id)}
                    </Text>
                  </XStack>
                </YStack>
              )}

              <YStack gap="$3">
                <Text
                  fontSize={14}
                  fontWeight="600"
                  style={{ fontFamily: "Montserrat-Regular" }}
                  color="#374151"
                >
                  Notas (0-10)
                </Text>
                {editAllScoresData.map((score, index) => (
                  <XStack key={index} gap="$2" items="center">
                    <Text
                      width={70}
                      fontSize={14}
                      fontWeight="600"
                      style={{ fontFamily: "Montserrat-Regular" }}
                      color="#6B7280"
                    >
                      Nota {index + 1}:
                    </Text>
                    <Input
                      flex={1}
                      placeholder="0.0"
                      value={score.toString()}
                      onChangeText={(value) =>
                        handleUpdateScoreInList(index, value)
                      }
                      keyboardType="numeric"
                      autoCapitalize="none"
                      bg="#F3F4F6"
                      borderWidth={1}
                      borderColor="#E5E7EB"
                      rounded={12}
                      px="$3"
                      py="$3.5"
                      height={52}
                      fontSize={16}
                      shadowColor="transparent"
                      elevation={0}
                      style={{ fontFamily: "Montserrat-Regular", textShadowColor: "transparent", lineHeight: 22 }}
                    />
                    <Button
                      onPress={() => handleRemoveScoreFromList(index)}
                      bg="#FEE2E2"
                      rounded={10}
                      width={48}
                      height={44}
                    >
                      <X size={20} color="#EF4444" />
                    </Button>
                  </XStack>
                ))}

                <Button
                  onPress={handleAddScoreToList}
                  bg="#10B981"
                  rounded={12}
                  height={44}
                  hoverStyle={{ bg: "#0c8a60" }}
                >
                  <Text
                    color="white"
                    fontWeight="600"
                    style={{ fontFamily: "Montserrat-Regular" }}
                  >
                    + Adicionar Nota
                  </Text>
                </Button>
              </YStack>

              <YStack gap="$3" mt="$2">
                <Button
                  onPress={handleSaveAllScores}
                  bg="#0075BE"
                  color="white"
                  rounded={12}
                  height={52}
                  fontSize={16}
                  fontWeight="600"
                  disabled={loading}
                  hoverStyle={{ bg: "#0e2b5a" }}
                >
                  <Text
                    color="#fff"
                    style={{ fontFamily: "Montserrat-Regular" }}
                  >
                    {loading ? "Salvando..." : "Salvar Alterações"}
                  </Text>
                </Button>

                <Button
                  onPress={() => setEditOpen(false)}
                  bg="transparent"
                  borderWidth={1}
                  borderColor="#E5E7EB"
                  color="#374151"
                  rounded={12}
                  height={52}
                  fontSize={16}
                  fontWeight="600"
                >
                  <Text style={{ fontFamily: "Montserrat-Regular" }} color="#374151">
                    Cancelar
                  </Text>
                </Button>
              </YStack>
            </YStack>
          </ScrollView>
        </Sheet.Frame>
      </Sheet>

      {/* Alerta Customizado */}
      {showAlert && (
        <View
          position="absolute"
          t={60}
          l={0}
          r={0}
          z={9999}
          px="$4"
          animation="quick"
          enterStyle={{ opacity: 0, y: -20 }}
          exitStyle={{ opacity: 0, y: -20 }}
        >
          <YStack
            bg="#FEF3C7"
            rounded={16}
            p="$4"
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.15}
            shadowRadius={12}
            elevation={5}
            borderWidth={1}
            borderColor="#F59E0B"
          >
            <XStack gap="$3" items="center">
              <View
                width={40}
                height={40}
                rounded={20}
                bg="#F59E0B"
                items="center"
                justify="center"
              >
                <Text fontSize={20}>⚠️</Text>
              </View>
              <YStack flex={1}>
                <Text
                  fontSize={16}
                  fontWeight="700"
                  color="#92400E"
                  style={{ fontFamily: "Montserrat-Regular" }}
                  mb="$1"
                >
                  Nota já cadastrada
                </Text>
                <Text
                  fontSize={14}
                  color="#78350F"
                  style={{ fontFamily: "Montserrat-Regular" }}
                >
                  {alertMessage}
                </Text>
              </YStack>
            </XStack>
          </YStack>
        </View>
      )}
    </View>
  );
}
