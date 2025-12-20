import { studentService } from "@/src/services/student.service";
import { CreateStudentData, Student } from "@/src/types/student.types";
import { Mail, Phone, Search, X } from "@tamagui/lucide-icons";
import { useCallback, useEffect, useState } from "react";
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

export default function AlunosScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filterStudents = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredStudents(students);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.registration_number.toLowerCase().includes(query)
    );
    setFilteredStudents(filtered);
  }, [searchQuery, students]);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [filterStudents]);

  const loadStudents = async () => {
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    }
  };

  const openAddModal = () => {
    setEditingStudent(null);
    setName("");
    setEmail("");
    setRegistrationNumber("");
    setPhone("");
    setErrors({});
    setOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setName(student.name);
    setEmail(student.email);
    setRegistrationNumber(student.registration_number);
    setPhone(student.phone || "");
    setErrors({});
    setOpen(true);
  };

  const saveStudent = async () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Nome é obrigatório";
    if (!email.trim()) newErrors.email = "Email é obrigatório";
    if (!registrationNumber.trim()) newErrors.registrationNumber = "Matrícula é obrigatória";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: CreateStudentData = {
      name,
      email,
      registration_number: registrationNumber,
      phone: phone || undefined,
    };

    try {
      setLoading(true);

      if (editingStudent) {
        await studentService.update(editingStudent.id, payload);
      } else {
        await studentService.create(payload);
      }

      setOpen(false);
      resetForm();
      await loadStudents();
    } catch (error: any) {
      console.error("Erro ao salvar aluno:", error);
      const errorMessage =
        error.response?.data?.errors?.join("\n") ||
        error.response?.data?.error ||
        "Erro ao salvar aluno";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setRegistrationNumber("");
    setPhone("");
    setEditingStudent(null);
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
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
              Alunos
            </Text>
            <Text
              fontSize={14}
              style={{ fontFamily: "Montserrat-Regular" }}
              color="rgba(255,255,255,0.8)"
            >
              {students.length}{" "}
              {students.length === 1
                ? "aluno cadastrado"
                : "alunos cadastrados"}
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
            placeholder="Buscar alunos..."
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

      <ScrollView flex={1} bg="white" pt="$4">
        <YStack gap="$3" px="$4" pb="$6">
          {filteredStudents.map((student) => (
            <YStack
              key={student.id}
              bg="#fff"
              p="$4"
              rounded={16}
              shadowColor="#000"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.05}
              shadowRadius={8}
              borderWidth={1}
              borderColor="#F3F4F6"
            >
              <XStack gap="$3" items="flex-start">
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
                    {getInitials(student.name)}
                  </Text>
                </View>

                <YStack flex={1} gap="$1.5">
                  <Text
                    fontSize={18}
                    fontWeight="bold"
                    style={{ fontFamily: "Montserrat-Regular" }}
                    color="#111827"
                    mb="$1"
                  >
                    {student.name}
                  </Text>
                  <Text
                    fontSize={14}
                    style={{ fontFamily: "Montserrat-Regular" }}
                    color="#6B7280"
                  >
                    Reg. {student.registration_number}
                  </Text>

                  <XStack gap="$1" items="center" mt="$1">
                    <Mail size={14} color="#6B7280" />
                    <Text
                      fontSize={14}
                      style={{ fontFamily: "Montserrat-Regular" }}
                      color="#6B7280"
                    >
                      {student.email}
                    </Text>
                  </XStack>

                  {student.phone && (
                    <XStack gap="$1" items="center">
                      <Phone size={14} color="#6B7280" />
                      <Text
                        fontSize={14}
                        style={{ fontFamily: "Montserrat-Regular" }}
                        color="#6B7280"
                      >
                        {student.phone}
                      </Text>
                    </XStack>
                  )}
                </YStack>
              </XStack>

              <Button
                onPress={() => openEditModal(student)}
                bg="transparent"
                borderWidth={1}
                borderColor="#E5E7EB"
                color="#374151"
                rounded={15}
                mt="$3"
                height={40}
              >
                <Text
                  fontWeight={"600"}
                  style={{ fontFamily: "Montserrat-Regular" }}
                  color="#374151"
                >
                  Editar
                </Text>
              </Button>
            </YStack>
          ))}

          {filteredStudents.length === 0 && (
            <YStack items="center" py="$8">
              <Text
                color="#6B7280"
                fontSize={16}
                style={{ fontFamily: "Montserrat-Regular" }}
              >
                {searchQuery
                  ? "Nenhum aluno encontrado"
                  : "O aluno digitado não foi encontrado "}
              </Text>
            </YStack>
          )}
        </YStack>
      </ScrollView>

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
          <YStack gap="$4">
            <XStack justify="space-between" items="center">
              <Text
                fontSize={24}
                fontWeight="bold"
                style={{ fontFamily: "Montserrat-Regular" }}
                color="#111827"
              >
                {editingStudent ? "Editar Aluno" : "Adicionar Novo Aluno"}
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
                  Nome *
                </Text>
                <Input
                  placeholder="Digite o nome do aluno"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
                  }}
                  autoCapitalize="none"
                  bg="white"
                  borderWidth={2}
                  borderColor={errors.name ? "#dc2626" : "#3B82F6"}
                  rounded={12}
                  px="$3"
                  py="$3.5"
                  height={52}
                  fontSize={16}
                  color="#111827"
                  shadowColor="transparent"
                  elevation={0}
                  style={{ fontFamily: "Montserrat-Regular", textShadowColor: "transparent", lineHeight: 22 }}
                />
                {errors.name && (
                  <Text color="#dc2626" fontSize={12} ml="$1" style={{ fontFamily: "Montserrat-Regular" }}>
                    {errors.name}
                  </Text>
                )}
              </YStack>

              <YStack gap="$2">
                <Text
                  fontSize={14}
                  fontWeight="600"
                  style={{ fontFamily: "Montserrat-Regular" }}
                  color="#374151"
                >
                  Email *
                </Text>
                <Input
                  placeholder="student@school.edu"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  bg="#F3F4F6"
                  borderWidth={1}
                  borderColor={errors.email ? "#dc2626" : "#E5E7EB"}
                  rounded={12}
                  px="$3"
                  py="$3.5"
                  height={52}
                  fontSize={16}
                  color="#111827"
                  shadowColor="transparent"
                  elevation={0}
                  style={{ fontFamily: "Montserrat-Regular", textShadowColor: "transparent", lineHeight: 22 }}
                />
                {errors.email && (
                  <Text color="#dc2626" fontSize={12} ml="$1" style={{ fontFamily: "Montserrat-Regular" }}>
                    {errors.email}
                  </Text>
                )}
              </YStack>

              <YStack gap="$2">
                <Text
                  fontSize={14}
                  fontWeight="600"
                  style={{ fontFamily: "Montserrat-Regular" }}
                  color="#374151"
                >
                  Número de Matrícula *
                </Text>
                <Input
                  placeholder="STU2024XXX"
                  value={registrationNumber}
                  onChangeText={(text) => {
                    setRegistrationNumber(text);
                    if (errors.registrationNumber) setErrors(prev => ({ ...prev, registrationNumber: "" }));
                  }}
                  autoCapitalize="none"
                  bg="#F3F4F6"
                  borderWidth={1}
                  borderColor={errors.registrationNumber ? "#dc2626" : "#E5E7EB"}
                  rounded={12}
                  px="$3"
                  py="$3.5"
                  height={52}
                  fontSize={16}
                  color="#111827"
                  shadowColor="transparent"
                  elevation={0}
                  style={{ fontFamily: "Montserrat-Regular", textShadowColor: "transparent", lineHeight: 22 }}
                />
                {errors.registrationNumber && (
                  <Text color="#dc2626" fontSize={12} ml="$1" style={{ fontFamily: "Montserrat-Regular" }}>
                    {errors.registrationNumber}
                  </Text>
                )}
              </YStack>

              <YStack gap="$2">
                <Text
                  fontSize={14}
                  fontWeight="600"
                  style={{ fontFamily: "Montserrat-Regular" }}
                  color="#374151"
                >
                  Telefone
                </Text>
                <Input
                  placeholder="+55 (31) 9999-8888"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  bg="#F3F4F6"
                  borderWidth={1}
                  borderColor="#E5E7EB"
                  rounded={12}
                  px="$3"
                  py="$3.5"
                  height={52}
                  fontSize={16}
                  color="#111827"
                  shadowColor="transparent"
                  elevation={0}
                  style={{ fontFamily: "Montserrat-Regular", textShadowColor: "transparent", lineHeight: 22 }}
                />
              </YStack>
            </YStack>

            <YStack gap="$3" mt="$2">
              <Button
                onPress={saveStudent}
                bg="#0075BE"
                color="white"
                rounded={12}
                height={52}
                fontSize={16}
                fontWeight="600"
                disabled={loading}
                hoverStyle={{ bg: "#0e2b5a" }}
              >
                <Text color="#fff" style={{ fontFamily: "Montserrat-Regular" }}>
                  {loading
                    ? "Salvando..."
                    : editingStudent
                    ? "Atualizar Aluno"
                    : "Criar Aluno"}
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
        </Sheet.Frame>
        </Sheet>
      )}
    </View>
  );
}
