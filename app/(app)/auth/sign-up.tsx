import { useAuth } from "@/src/hooks/useAuth";
import { schoolService } from "@/src/services/school.service";
import type { RegisterData } from "@/src/types/auth.types";
import type { CreateSchoolData } from "@/src/types/school.types";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Role = "admin" | "teacher";

export default function SignUp() {
  const router = useRouter();
  const { signUp, loading } = useAuth();

  const [role, setRole] = useState<Role>("teacher");
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [schoolsMessage, setSchoolsMessage] = useState<string | null>(null);
  
  const [schoolName, setSchoolName] = useState('');
  const [schoolEmail, setSchoolEmail] = useState('');
  const [schoolAddress, setSchoolAddress] = useState('');
  const [schoolPhone, setSchoolPhone] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [address, setAddress] = useState('');
  
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [isSchoolListOpen, setIsSchoolListOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const scrollRef = useRef<ScrollView | null>(null);

  const isEmail = (v: string) => /.+@.+\..+/.test(v);

  const mapApiError = (e: any): string => {
    let message = "Ocorreu um erro ao processar seu cadastro. Tente novamente.";
    const status = e?.response?.status as number | undefined;
    if (status) {
      if (status >= 500) {
        message =
          "Serviço indisponível no momento. Tente novamente mais tarde.";
      } else if (status === 400 || status === 409 || status === 422) {
        message =
          "Não foi possível processar os dados informados. Verifique e tente novamente.";
      } else {
        message = "Ocorreu um erro ao processar seu cadastro. Tente novamente.";
      }
    } else if (e?.request && !e?.response) {
      message =
        "Não foi possível conectar ao servidor. Tente novamente mais tarde.";
    }
    return message;
  };

  const errors = useMemo(() => {
    const e: Record<string, string | undefined> = {};
    if (!name.trim()) e.name = "Nome é obrigatório.";
    if (!email.trim()) e.email = "E-mail é obrigatório.";
    else if (!isEmail(email.trim())) e.email = "Informe um e-mail válido.";
    if (!password) e.password = "Senha é obrigatória.";
    else if (password.length < 6)
      e.password = "Senha deve ter ao menos 6 caracteres.";
    if (!passwordConfirmation)
      e.password_confirmation = "Confirmação é obrigatória.";
    else if (passwordConfirmation !== password)
      e.password_confirmation = "As senhas não coincidem.";

    if (role === 'teacher') {
      if (!address.trim()) e.address = 'Endereço é obrigatório.';
      if (!selectedSchoolId) e.selectedSchoolId = 'Selecione uma escola.';
    } else {
      if (!schoolName.trim()) e.schoolName = "Nome da escola é obrigatório.";
      if (!schoolEmail.trim())
        e.schoolEmail = "E-mail da escola é obrigatório.";
      else if (!isEmail(schoolEmail.trim()))
        e.schoolEmail = "Informe um e-mail de escola válido.";
    }
    return e;
  }, [name, email, password, passwordConfirmation, address, role, selectedSchoolId, schoolName, schoolEmail]);

  useEffect(() => {
    if (role === "teacher") {
      loadSchools();
    }
  }, [role]);

  useEffect(() => {
    setTouched((prev) => {
      const next = { ...prev };
      if (role === "teacher") {
        delete next.schoolName;
        delete next.schoolEmail;
      } else {
        delete next.selectedSchoolId;
      }

      delete next.name;
      delete next.email;
      delete next.password;
      delete next.password_confirmation;
      delete next.address;
      return next;
    });
    setSubmitError(null);
    // Ao alternar o papel, garantir que a lista feche e a seleção seja limpa
    setIsSchoolListOpen(false);
    if (role !== "teacher") {
      setSelectedSchoolId("");
    }
  }, [role]);

  async function loadSchools() {
    try {
      setLoadingSchools(true);
      setSchoolsMessage(null);
      // Busca pública, sem necessidade de token
      const data = await schoolService.getPublic();
      const list = data.map((s) => ({ id: s.id, name: s.name }));
      setSchools(list);
      if (!list.length) {
        setSchoolsMessage("Nenhuma escola cadastrada");
      }
    } catch (e: any) {
      console.error(e);
      if (e?.request && !e?.response) {
        const msg = "Nenhuma escola encontrada, tente novamente mais tarde.";
        setSchools([]);
        setSchoolsMessage(msg);
        try {
          Alert.alert("Erro ao carregar escolas", msg);
        } catch {}
      } else {
        const msg = mapApiError(e);
        setSchools([]);
        setSchoolsMessage(
          "Nenhuma escola encontrada, tente novamente mais tarde."
        );
        try {
          Alert.alert("Erro ao carregar escolas", msg);
        } catch {}
      }
    } finally {
      setLoadingSchools(false);
    }
  }

  const canSubmit = useMemo(() => {
    if (!name || !email || !password || !passwordConfirmation) return false;
    if (password !== passwordConfirmation) return false;
    if (role === 'teacher' && !address.trim()) return false;
    if (role === 'teacher') {
      return !!selectedSchoolId;
    }
    return !!schoolName && !!schoolEmail;
  }, [
    name,
    email,
    password,
    passwordConfirmation,
    role,
    selectedSchoolId,
    schoolName,
    schoolEmail,
  ]);

  const handleSubmit = async () => {
    const markAllTouched: Record<string, boolean> = {
      name: true,
      email: true,
      password: true,
      password_confirmation: true,
    };
    if (role === "teacher") {
      markAllTouched.selectedSchoolId = true;
      markAllTouched.address = true;
    } else {
      markAllTouched.schoolName = true;
      markAllTouched.schoolEmail = true;
    }
    setTouched((prev) => ({ ...prev, ...markAllTouched }));

    if (Object.keys(errors).length > 0) {
      requestAnimationFrame(() =>
        scrollRef.current?.scrollTo({ y: 0, animated: true })
      );
      return;
    }
    try {
      setSubmitting(true);
      setSubmitError(null);

      if (role === "teacher") {
        const payload: RegisterData = {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
          user_type: "teacher",
          school_id: selectedSchoolId,
          address: address || undefined,
        };
        await signUp(payload);
      } else {
        const schoolPayload: CreateSchoolData = {
          name: schoolName,
          email: schoolEmail,
          address: schoolAddress || undefined,
          phone: schoolPhone || undefined,
        };
        const created = await schoolService.create(schoolPayload);
        const payload: RegisterData = {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
          user_type: "admin",
          school_id: created.id,
          address: address || undefined,
        };
        await signUp(payload);
      }

      const message = encodeURIComponent(
        "Cadastro efetuado com sucesso. Efetue o login."
      );
      router.replace(`/auth/sign-in?msg=${message}`);
    } catch (e: any) {
      const msg = mapApiError(e);
      setSubmitError(msg);
      try {
        Alert.alert("Erro no cadastro", msg);
      } catch {}
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView ref={scrollRef} contentContainerStyle={{ padding: 24, backgroundColor: 'white' }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 16, fontFamily: "Montserrat-Regular", }}>Criar conta</Text>

      {submitError ? (
        <View
          style={{
            backgroundColor: "#fee2e2",
            borderWidth: 1,
            borderColor: "#fca5a5",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <Text style={{ color: "#b91c1c", fontFamily: "Montserrat-Regular" }}>
            {submitError}
          </Text>
        </View>
      ) : null}

      <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
        <TouchableOpacity
          onPress={() => setRole("teacher")}
          style={{
            padding: 10,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: role === "teacher" ? "#2563eb" : "#ddd",
            backgroundColor: role === "teacher" ? "#dbeafe" : "white",
          }}
        >
          <Text style={{ color: "#111827", fontFamily: "Montserrat-Regular" }}>
            Professor
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setRole("admin")}
          style={{
            padding: 10,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: role === "admin" ? "#2563eb" : "#ddd",
            backgroundColor: role === "admin" ? "#dbeafe" : "white",
          }}
        >
          <Text style={{ color: "#111827", fontFamily: "Montserrat-Regular" }}>
            Admin
          </Text>
        </TouchableOpacity>
      </View>

      {role === "admin" && (
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              marginBottom: 10,
              fontFamily: "Montserrat-Regular",
            }}
          >
            Dados da Escola
          </Text>
          <Text style={{ marginBottom: 6, fontFamily: "Montserrat-Regular" }}>
            Nome da Escola <Text style={{ color: "#dc2626" }}>*</Text>
          </Text>
          <TextInput
            value={schoolName}
            onChangeText={setSchoolName}
            onBlur={() => setTouched((p) => ({ ...p, schoolName: true }))}
            placeholder="Nome da Escola"
            autoCapitalize="none"
            style={{
              borderWidth: 1,
              borderColor:
                touched.schoolName && errors.schoolName ? "#dc2626" : "#ddd",
              borderRadius: 8,
              padding: 12,
              marginBottom: 6,
              fontFamily: "Montserrat-Regular",
              color: "#111827",
            }}
          />
          {touched.schoolName && errors.schoolName ? (
            <Text
              style={{
                color: "#dc2626",
                marginBottom: 10,
                fontFamily: "Montserrat-Regular",
              }}
            >
              {errors.schoolName}
            </Text>
          ) : (
            <View style={{ height: 10 }} />
          )}
          <Text style={{ marginBottom: 6, fontFamily: "Montserrat-Regular" }}>
            E-mail da Escola <Text style={{ color: "#dc2626" }}>*</Text>
          </Text>
          <TextInput
            value={schoolEmail}
            onChangeText={setSchoolEmail}
            onBlur={() => setTouched((p) => ({ ...p, schoolEmail: true }))}
            placeholder="contato@escola.com"
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              borderWidth: 1,
              borderColor:
                touched.schoolEmail && errors.schoolEmail ? "#dc2626" : "#ddd",
              borderRadius: 8,
              padding: 12,
              marginBottom: 6,
              fontFamily: "Montserrat-Regular",
              color: "#111827",
            }}
          />
          {touched.schoolEmail && errors.schoolEmail ? (
            <Text
              style={{
                color: "#dc2626",
                marginBottom: 10,
                fontFamily: "Montserrat-Regular",
              }}
            >
              {errors.schoolEmail}
            </Text>
          ) : (
            <View style={{ height: 10 }} />
          )}
          <Text style={{ marginBottom: 6, fontFamily: "Montserrat-Regular" }}>
            Endereço
          </Text>
          <TextInput
            value={schoolAddress}
            onChangeText={setSchoolAddress}
            placeholder="Endereço (opcional)"
            autoCapitalize="none"
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
              fontFamily: "Montserrat-Regular",
              color: "#111827",
            }}
          />
          <Text style={{ marginBottom: 6, fontFamily: "Montserrat-Regular" }}>
            Telefone
          </Text>
          <TextInput
            value={schoolPhone}
            onChangeText={setSchoolPhone}
            placeholder="Telefone (opcional)"
            keyboardType="phone-pad"
            autoCapitalize="none"
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              padding: 12,
              fontFamily: "Montserrat-Regular",
              color: "#111827",
            }}
          />
        </View>
      )}

      {role === "teacher" && (
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              marginBottom: 10,
              fontFamily: "Montserrat-Regular",
            }}
          >
            Escolha a Escola
          </Text>
          <View
            style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8 }}
          >
            <TouchableOpacity
              onPress={() => {
                if (!loadingSchools && !schoolsMessage && schools.length > 0) {
                  setIsSchoolListOpen((o) => !o);
                  Keyboard.dismiss();
                }
              }}
              style={{
                padding: 12,
                backgroundColor: "#f9fafb",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ color: "#6b7280", fontFamily: "Montserrat-Regular" }}
              >
                {loadingSchools
                  ? "Carregando escolas..."
                  : selectedSchoolId
                  ? schools.find((s) => s.id === selectedSchoolId)?.name
                  : schoolsMessage ?? "Selecione uma escola"}
              </Text>
              <Text style={{ color: "#9ca3af" }}>
                {isSchoolListOpen ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>
            {!loadingSchools &&
            !schoolsMessage &&
            schools.length > 0 &&
            isSchoolListOpen ? (
              <ScrollView style={{ maxHeight: 200 }}>
                {schools.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    onPress={() => {
                      setSelectedSchoolId(s.id);
                      setTouched((p) => ({ ...p, selectedSchoolId: true }));
                      setIsSchoolListOpen(false);
                    }}
                    style={{
                      padding: 12,
                      backgroundColor:
                        selectedSchoolId === s.id ? "#eef2ff" : "white",
                    }}
                  >
                    <Text style={{ fontFamily: "Montserrat-Regular" }}>
                      {s.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : null}
          </View>
          {touched.selectedSchoolId && errors.selectedSchoolId ? (
            <Text
              style={{
                color: "#dc2626",
                marginTop: 6,
                fontFamily: "Montserrat-Regular",
              }}
            >
              {errors.selectedSchoolId}
            </Text>
          ) : null}
        </View>
      )}

      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 10,
            fontFamily: "Montserrat-Regular",
          }}
        >
          Seus Dados
        </Text>
        <Text style={{ marginBottom: 6, fontFamily: "Montserrat-Regular" }}>
          Nome <Text style={{ color: "#dc2626" }}>*</Text>
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          onBlur={() => setTouched((p) => ({ ...p, name: true }))}
          placeholder="Seu nome"
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderColor: touched.name && errors.name ? "#dc2626" : "#ddd",
            borderRadius: 8,
            padding: 12,
            marginBottom: 6,
            fontFamily: "Montserrat-Regular",
            color: "#111827",
          }}
        />
        {touched.name && errors.name ? (
          <Text
            style={{
              color: "#dc2626",
              marginBottom: 10,
              fontFamily: "Montserrat-Regular",
            }}
          >
            {errors.name}
          </Text>
        ) : (
          <View style={{ height: 10 }} />
        )}
        <Text style={{ marginBottom: 6, fontFamily: "Montserrat-Regular" }}>
          E-mail <Text style={{ color: "#dc2626" }}>*</Text>
        </Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          onBlur={() => setTouched((p) => ({ ...p, email: true }))}
          placeholder="seu@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
          style={{
            borderWidth: 1,
            borderColor: touched.email && errors.email ? "#dc2626" : "#ddd",
            borderRadius: 8,
            padding: 12,
            marginBottom: 6,
            fontFamily: "Montserrat-Regular",
            color: "#111827",
          }}
        />
        {touched.email && errors.email ? (
          <Text
            style={{
              color: "#dc2626",
              marginBottom: 10,
              fontFamily: "Montserrat-Regular",
            }}
          >
            {errors.email}
          </Text>
        ) : (
          <View style={{ height: 10 }} />
        )}
        <Text style={{ marginBottom: 6, fontFamily: "Montserrat-Regular" }}>
          Senha <Text style={{ color: "#dc2626" }}>*</Text>
        </Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          onBlur={() => setTouched((p) => ({ ...p, password: true }))}
          placeholder="••••••••"
          secureTextEntry
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderColor:
              touched.password && errors.password ? "#dc2626" : "#ddd",
            borderRadius: 8,
            padding: 12,
            marginBottom: 6,
            fontFamily: "Montserrat-Regular",
            color: "#111827",
          }}
        />
        {touched.password && errors.password ? (
          <Text
            style={{
              color: "#dc2626",
              marginBottom: 10,
              fontFamily: "Montserrat-Regular",
            }}
          >
            {errors.password}
          </Text>
        ) : (
          <View style={{ height: 10 }} />
        )}
        <Text style={{ marginBottom: 6, fontFamily: "Montserrat-Regular" }}>
          Confirme a Senha <Text style={{ color: "#dc2626" }}>*</Text>
        </Text>
        <TextInput
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
          onBlur={() =>
            setTouched((p) => ({ ...p, password_confirmation: true }))
          }
          placeholder="••••••••"
          secureTextEntry
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderColor:
              touched.password_confirmation && errors.password_confirmation
                ? "#dc2626"
                : "#ddd",
            borderRadius: 8,
            padding: 12,
            marginBottom: 6,
            color: "#111827",
          }}
        />
        {touched.password_confirmation && errors.password_confirmation ? (
          <Text style={{ color: '#dc2626', marginBottom: 10, fontFamily: "Montserrat-Regular", }}>{errors.password_confirmation}</Text>
        ) : <View style={{ height: 10 }} />}
        <Text style={{ marginBottom: 6, fontFamily: "Montserrat-Regular", }}>Endereço {role === 'teacher' ? <Text style={{ color: '#dc2626', fontFamily: "Montserrat-Regular", }}>*</Text> : null}</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          onBlur={() => setTouched((p) => ({ ...p, address: true }))}
          placeholder="Endereço"
          autoCapitalize="none"
          style={{ borderWidth: 1, borderColor: role === 'teacher' && touched.address && (errors as any).address ? '#dc2626' : '#ddd', borderRadius: 8, padding: 12, marginBottom: 6, fontFamily: "Montserrat-Regular", color: "#111827" }}
        />
        {role === 'teacher' && touched.address && (errors as any).address ? (
          <Text style={{ color: '#dc2626', marginBottom: 10, fontFamily: "Montserrat-Regular" }}>{(errors as any).address}</Text>
        ) : <View style={{ height: 10 }} />}
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={submitting || loading}
        style={{
          backgroundColor: "#16a34a",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
          opacity: submitting || loading ? 0.7 : 1,
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "600",
            fontFamily: "Montserrat-Regular",
          }}
        >
          {submitting ? "Enviando..." : "Cadastrar"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.back()}
        style={{ alignItems: "center", padding: 12 }}
      >
        <Text style={{ color: "#2563eb", fontFamily: "Montserrat-Regular" }}>
          Já tem conta? Entrar
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
