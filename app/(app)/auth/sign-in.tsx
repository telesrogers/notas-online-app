import { useAuth } from "@/src/hooks/useAuth";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignIn() {
  const router = useRouter();
  const { signIn, loading } = useAuth();
  const params = useLocalSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<{
    email?: boolean;
    password?: boolean;
  }>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(
    typeof params?.msg === "string" ? params.msg : null
  );

  const isEmail = (v: string) => /.+@.+\..+/.test(v);

  const errors = useMemo(() => {
    const e: { email?: string; password?: string } = {};
    if (!email.trim()) e.email = "E-mail é obrigatório.";
    else if (!isEmail(email.trim())) e.email = "Informe um e-mail válido.";
    if (!password) e.password = "Senha é obrigatória.";
    return e;
  }, [email, password]);

  const onSubmit = async () => {
    setTouched({ email: true, password: true });
    if (errors.email || errors.password) return;
    try {
      setSubmitting(true);
      setAuthError(null);
      await signIn({ email, password });
      router.replace("/(app)/(tabs)");
    } catch (e: any) {
      const API_UNAVAILABLE =
        "Não foi possível efetuar o login, tente novamente mais tarde.";
      const INVALID_DATA =
        "Não foi possível efetuar o login, verifique os dados informados e tente novamente.";
      let message = INVALID_DATA;
      const status = e?.response?.status as number | undefined;

      if (status === 401 || status === 404) {
        message = INVALID_DATA;
      } else if (typeof status === "number" && status >= 500) {
        message = API_UNAVAILABLE;
      } else if (e?.request && !e?.response) {
        message = API_UNAVAILABLE;
      }

      setAuthError(message);
      try {
        Alert.alert("Erro ao entrar", message);
      } catch {}
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        padding: 24,
        backgroundColor: "white",
        justifyContent: "center",
      }}
    >
      <View style={{ gap: 16 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "600",
            marginBottom: 12,
            fontFamily: "Montserrat-Regular",
          }}
        >
          Entrar
        </Text>

        {infoMessage ? (
          <View
            style={{
              backgroundColor: "#dcfce7",
              borderWidth: 1,
              borderColor: "#86efac",
              padding: 12,
              borderRadius: 8,
            }}
          >
            <Text
              style={{ color: "#166534", fontFamily: "Montserrat-Regular" }}
            >
              {infoMessage}
            </Text>
          </View>
        ) : null}

        {authError ? (
          <View
            style={{
              backgroundColor: "#fee2e2",
              borderWidth: 1,
              borderColor: "#fca5a5",
              padding: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#b91c1c" }}>{authError}</Text>
          </View>
        ) : null}

        <View>
          <Text style={{ marginBottom: 6, fontFamily: "Montserrat-Regular" }}>
            E-mail{" "}
            <Text
              style={{ color: "#dc2626", fontFamily: "Montserrat-Regular" }}
            >
              *
            </Text>
          </Text>
          <TextInput
            placeholder="seu@email.com"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
            }}
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            style={{
              borderWidth: 1,
              borderColor: touched.email && errors.email ? "#dc2626" : "#ddd",
              borderRadius: 8,
              padding: 12,
              fontFamily: "Montserrat-Regular",
              color: "#111827",
            }}
          />
          {touched.email && errors.email ? (
            <Text
              style={{
                color: "#dc2626",
                marginTop: 6,
                fontFamily: "Montserrat-Regular",
              }}
            >
              {errors.email}
            </Text>
          ) : null}
        </View>

        <View>
          <Text style={{ marginBottom: 6, fontFamily: "Montserrat-Regular" }}>
            Senha <Text style={{ color: "#dc2626" }}>*</Text>
          </Text>
          <TextInput
            placeholder="••••••••"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
            }}
            onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
            style={{
              borderWidth: 1,
              borderColor:
                touched.password && errors.password ? "#dc2626" : "#ddd",
              borderRadius: 8,
              padding: 12,
              color: "#111827",
            }}
          />
          {touched.password && errors.password ? (
            <Text
              style={{
                color: "#dc2626",
                marginTop: 6,
                fontFamily: "Montserrat-Regular",
              }}
            >
              {errors.password}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={onSubmit}
          disabled={submitting || loading}
          style={{
            backgroundColor: "#2563eb",
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
            {submitting ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/auth/sign-up")}
          style={{ alignItems: "center", padding: 8 }}
        >
          <Text style={{ color: "#2563eb", fontFamily: "Montserrat-Regular" }}>
            Não tem conta? Cadastre-se
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
