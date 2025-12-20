import HeaderMenu from "@/components/common/header-menu";
import { useAuth } from "@/src/hooks/useAuth";
import { Redirect, Slot, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function AuthLayout() {
  const { isAuthenticated, loading } = useAuth();

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return (
    <>
      <HeaderMenu isAtAuthPage={true} />
      <Slot screenOptions={{ headerShown: false }} />
    </>
  );
}
