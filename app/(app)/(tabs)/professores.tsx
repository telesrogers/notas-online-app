import { useAuth } from "@/src/hooks/useAuth";
import { teacherService } from "@/src/services/teacher.service";
import type { Teacher } from "@/src/types/teacher.types";
import { Search, X } from "@tamagui/lucide-icons";
import { Redirect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
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

export default function ProfessoresScreen() {
  const { user, loading } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setEditingTeacher(null);
    setName("");
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");
    setAddress("");
    setErrors({});
  };

  const loadTeachers = async () => {
    try {
      const data = await teacherService.getAll();
      setTeachers(data);
    } catch (e) {
      console.error("Erro ao buscar professores:", e);
    }
  };

  const filterTeachers = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredTeachers(teachers);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(query) ||
        teacher.email.toLowerCase().includes(query)
    );
    setFilteredTeachers(filtered);
  }, [searchQuery, teachers]);

  const openAddModal = () => {
    setEditingTeacher(null);
    setName("");
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");
    setAddress("");
    setErrors({});
    resetForm();
    setOpen(true);
  };

  // Carregar professores ao abrir tela
  useEffect(() => {
    loadTeachers();
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [filterTeachers]);

  const isEditing = useMemo(() => !!editingTeacher, [editingTeacher]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Nome é obrigatório";
    if (!email.trim()) newErrors.email = "E-mail é obrigatório";
    // senha obrigatória apenas no cadastro; na edição é opcional
    if (!isEditing && !password.trim())
      newErrors.password = "Senha é obrigatória";
    if (!isEditing && !passwordConfirmation.trim())
      newErrors.passwordConfirmation = "Confirmação de senha é obrigatória";
    if (
      !isEditing &&
      password.trim() &&
      passwordConfirmation.trim() &&
      password !== passwordConfirmation
    ) {
      newErrors.passwordConfirmation = "Senhas não coincidem";
    }
    if (!isEditing && !address.trim())
      newErrors.address = "Endereço é obrigatório";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveTeacher = async () => {
    if (!validate()) return;

    try {
      setSaving(true);
      if (isEditing && editingTeacher) {
        const payload: any = {
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          address: address.trim() || undefined,
        };
        if (password.trim()) {
          payload.password = password;
          payload.password_confirmation = passwordConfirmation;
        }
        await teacherService.update(editingTeacher.id!, payload);
      } else {
        await teacherService.create({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
          school_id: user?.school_id || "",
          address: address,
        });
      }
      setOpen(false);
      // reset
      setName("");
      setEmail("");
      setPassword("");
      setPasswordConfirmation("");
      setAddress("");
      setEditingTeacher(null);
      setErrors({});
      await loadTeachers();
    } catch (e: any) {
      console.error(
        isEditing
          ? "Erro ao atualizar professor:"
          : "Erro ao cadastrar professor:",
        e
      );
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (t: Teacher) => {
    setEditingTeacher(t);
    setName(t.name || "");
    setEmail(t.email || "");
    setPassword("");
    setPasswordConfirmation("");
    // @ts-ignore - alguns backends usam address no root
    setAddress((t as any).address || "");
    setErrors({});
    setOpen(true);
  };

  const confirmDelete = (t: Teacher) => {
    Alert.alert(
      "Excluir professor",
      `Tem certeza que deseja excluir ${t.name}? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await teacherService.delete(t.id!);
              await loadTeachers();
            } catch (e) {
              console.error("Erro ao excluir professor:", e);
            }
          },
        },
      ]
    );
  };

  // Guard de rota: apenas admin pode acessar
  if (!loading && user?.user_type !== "admin") {
    return <Redirect href="/(app)/(tabs)" />;
  }

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
              Professores
            </Text>
            <Text
              fontSize={14}
              style={{ fontFamily: "Montserrat-Regular" }}
              color="rgba(255,255,255,0.8)"
            >
              {teachers.length}{" "}
              {teachers.length === 1
                ? "professor cadastrado"
                : "professores cadastrados"}
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
            placeholder="Buscar professores..."
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
          {filteredTeachers.map((t) => (
            <YStack
              key={t.id}
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
                {t.name}
              </Text>
              <Text
                color="#6B7280"
                style={{ fontFamily: "Montserrat-Regular" }}
              >
                {t.email}
              </Text>
              <XStack gap="$2" mt="$3">
                <Button width={"50%"} onPress={() => startEdit(t)}>
                  <Text
                    fontWeight={"600"}
                    style={{ fontFamily: "Montserrat-Regular" }}
                    color="#374151"
                  >
                    Editar
                  </Text>
                </Button>
                <Button
                  width={"50%"}
                  theme="red"
                  onPress={() => confirmDelete(t)}
                >
                  <Text
                    fontWeight={"600"}
                    style={{ fontFamily: "Montserrat-Regular" }}
                  >
                    Deletar
                  </Text>
                </Button>
              </XStack>
            </YStack>
          ))}
          {filteredTeachers.length === 0 && (
            <YStack items="center" py="$8">
              <Text
                color="#6B7280"
                fontSize={16}
                style={{ fontFamily: "Montserrat-Regular" }}
              >
                {searchQuery
                  ? "Nenhum professor encontrado"
                  : "O professor digitado não foi encontrado "}
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
        <Sheet.Frame p="$4" background="#fff">
          <YStack gap="$3">
            <XStack justify="space-between" items="center">
              <Text
                fontSize={24}
                fontWeight="bold"
                style={{ fontFamily: "Montserrat-Regular" }}
                color="#111827"
              >
                {editingTeacher ? "Editar Professor" : "Cadastro de Professor"}
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
                placeholder="Nome"
                value={name}
                onChangeText={(v) => {
                  setName(v);
                  if (errors.name) setErrors((e) => ({ ...e, name: "" }));
                }}
                autoCapitalize="none"
                style={{ fontFamily: "Montserrat-Regular" }}
              />
              {!!errors.name && (
                <Text color="#DC2626" fontSize="$2">
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
                E-mail *
              </Text>
              <Input
                placeholder="E-mail"
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  if (errors.email) setErrors((e) => ({ ...e, email: "" }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ fontFamily: "Montserrat-Regular" }}
              />
              {!!errors.email && (
                <Text color="#DC2626" fontSize="$2">
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
                Senha *
              </Text>
              <Input
                placeholder="Senha"
                value={password}
                onChangeText={(v) => {
                  setPassword(v);
                  if (errors.password)
                    setErrors((e) => ({ ...e, password: "" }));
                }}
                secureTextEntry
                autoCapitalize="none"
                style={{ fontFamily: "Montserrat-Regular" }}
              />
              {!!errors.password && (
                <Text color="#DC2626" fontSize="$2">
                  {errors.password}
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
                Confirmação de Senha *
              </Text>
              <Input
                placeholder="Confirmar senha"
                value={passwordConfirmation}
                onChangeText={(v) => {
                  setPasswordConfirmation(v);
                  if (errors.passwordConfirmation)
                    setErrors((e) => ({ ...e, passwordConfirmation: "" }));
                }}
                secureTextEntry
                autoCapitalize="none"
                style={{ fontFamily: "Montserrat-Regular" }}
              />
              {!!errors.passwordConfirmation && (
                <Text color="#DC2626" fontSize="$2">
                  {errors.passwordConfirmation}
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
                Endereço *
              </Text>
              <Input
                placeholder="Endereço"
                value={address}
                onChangeText={(v) => {
                  setAddress(v);
                  if (errors.address) setErrors((e) => ({ ...e, address: "" }));
                }}
                autoCapitalize="none"
                style={{ fontFamily: "Montserrat-Regular" }}
              />
              {!!errors.address && (
                <Text color="#DC2626" fontSize="$2">
                  {errors.address}
                </Text>
              )}
            </YStack>

            <YStack gap="$3" mt="$2">
              <Button
                onPress={saveTeacher}
                bg="#0075BE"
                rounded={12}
                height={52}
                fontSize={16}
                fontWeight="600"
                disabled={saving}
                hoverStyle={{ bg: "#0e2b5a" }}
              >
                <Text
                  color="white"
                  fontWeight={"600"}
                  style={{ fontFamily: "Montserrat-Regular" }}
                >
                  {saving ? "Salvando..." : "Salvar"}
                </Text>
              </Button>
              <Button
                onPress={() => setOpen(false)}
                bg="transparent"
                borderWidth={1}
                borderColor="#E5E7EB"
                rounded={12}
                height={52}
                fontSize={16}
                fontWeight="600"
                disabled={saving}
              >
                <Text
                  color="#374151"
                  fontWeight={"600"}
                  style={{ fontFamily: "Montserrat-Regular" }}
                >
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
