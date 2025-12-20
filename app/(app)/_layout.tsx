import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "@/src/contexts/AuthContext";

export default function Layout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth/sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="auth/sign-up"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
