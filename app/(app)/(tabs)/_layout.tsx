import MainStructure from "@/components/common/main-structure";
import { useAuth } from "@/src/hooks/useAuth";
import { Redirect, Slot } from "expo-router";
import { Spinner, View, YStack } from "tamagui";

export default function TabsLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View flex={1} justify="center" items="center" background="white">
        <YStack items="center" gap="$4">
          <Spinner size="large" color="$blue10" />
        </YStack>
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(app)/auth/sign-in" />;
  }

  return (
    <View flex={1} justify="flex-end" background={"white"}>
      <MainStructure>
        <Slot />
      </MainStructure>
    </View>
  );
}
