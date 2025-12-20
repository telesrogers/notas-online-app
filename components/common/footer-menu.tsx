import { useAuth } from "@/src/hooks/useAuth";
import {
    BookOpen,
    ChartColumn,
    GraduationCap,
    Home,
    LogOut,
    Users,
} from "@tamagui/lucide-icons";
import { usePathname, useRouter } from "expo-router";
import { XStack, YStack } from "tamagui";

export default function FooterMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut, user } = useAuth();

  const handleNavigation = (route: any) => {
    router.push(route);
  };

  const home =
    pathname === "/(app)/(tabs)" ||
    pathname === "/(app)/(tabs)/" ||
    pathname.endsWith("/");
  const students = pathname.includes("/alunos");
  const subjects = pathname.includes("/disciplinas");
  const teachers = pathname.includes("/professores");
  const grades = pathname.includes("/notas");

  const handleLogout = async () => {
    try {
      await signOut();
    } finally {
      router.replace("/auth/sign-in");
    }
  };

  return (
    <XStack
      position="absolute"
      b="$0"
      l="$0"
      r="$0"
      height="10%"
      items={"center"}
      px="$4"
      borderTopWidth={2}
      borderTopColor="#8c8c8c1b"
      gap="$4"
      backgroundColor="white"
    >
      <YStack
        flex={1}
        items="center"
        gap="$1.5"
        background={home ? "#074b83" : "transparent"}
        rounded="$4"
        p="$2.5"
        onPress={() => handleNavigation("/(app)/(tabs)/")}
        cursor="pointer"
      >
        <Home size="$1.5" color={home ? "black" : "#666666"} />
        {/* <Text color={home ? "white" : "black"} fontWeight={600}>
          Home
        </Text> */}
      </YStack>

      {user?.user_type === "admin" && (
        <YStack
          flex={1}
          items="center"
          gap="$1.5"
          background={teachers ? "#074b83" : "transparent"}
          p="$2.5"
          rounded="$4"
          onPress={() => handleNavigation("/(app)/(tabs)/professores")}
          cursor="pointer"
        >
          <GraduationCap size="$1.5" color={teachers ? "black" : "#666666"} />
          {/* <Text color={teachers ? "white" : "black"} fontWeight={600}>
            Professores
          </Text> */}
        </YStack>
      )}

      <YStack
        flex={1}
        items="center"
        gap="$1.5"
        background={students ? "#074b83" : "transparent"}
        p="$2.5"
        rounded="$4"
        onPress={() => handleNavigation("/(app)/(tabs)/alunos")}
        cursor="pointer"
      >
        <Users size="$1.5" color={students ? "black" : "#666666"} />
        {/* <Text color={students ? "white" : "black"} fontWeight={600}>
          Alunos
        </Text> */}
      </YStack>

      <YStack
        flex={1}
        items="center"
        gap="$1.5"
        background={subjects ? "#074b83" : "transparent"}
        p="$2.5"
        rounded="$4"
        onPress={() => handleNavigation("/(app)/(tabs)/disciplinas")}
        cursor="pointer"
      >
        <BookOpen size="$1.5" color={subjects ? "black" : "#666666"} />
        {/* <Text color={subjects ? "white" : "black"} fontWeight={600}>
          Disciplinas
        </Text> */}
      </YStack>

      <YStack
        flex={1}
        items="center"
        gap="$1.5"
        background={grades ? "#074b83" : "transparent"}
        p="$2.5"
        rounded="$4"
        onPress={() => handleNavigation("/(app)/(tabs)/notas")}
        cursor="pointer"
      >
        <ChartColumn size="$1.5" color={grades ? "black" : "#666666"} />
        {/* <Text color={grades ? "white" : "black"} fontWeight={600}>
          Notas
        </Text> */}
      </YStack>

      <YStack
        flex={1}
        items="center"
        gap="$1.5"
        p="$2.5"
        rounded="$4"
        onPress={handleLogout}
        cursor="pointer"
      >
        <LogOut size="$1.5" color="#666666" />
        {/* <Text fontWeight={600}>Sair</Text> */}
      </YStack>
    </XStack>
  );
}
