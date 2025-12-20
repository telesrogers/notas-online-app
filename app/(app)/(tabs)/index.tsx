import { useAuth } from "@/src/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View as RNView } from "react-native";
import { Heading, Text, View, XStack, YStack } from "tamagui";

interface QuickActionItem {
  id: string;
  label: string;
  iconColor: string;
  bgColor: string;
  route: string;
}

const quickActions: QuickActionItem[] = [
  {
    id: "teachers",
    label: "Professores",
    iconColor: "white",
    bgColor: "#8B5CF6",
    route: "/(app)/(tabs)/professores",
  },
  {
    id: "students",
    label: "Alunos",
    iconColor: "white",
    bgColor: "#3B82F6",
    route: "/(app)/(tabs)/alunos",
  },
  {
    id: "subjects",
    label: "Disciplinas",
    iconColor: "white",
    bgColor: "#10B981",
    route: "/(app)/(tabs)/disciplinas",
  },
  {
    id: "grades",
    label: "Notas",
    iconColor: "white",
    bgColor: "#F97316",
    route: "/(app)/(tabs)/notas",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const handleActionPress = (route: any) => {
    router.push(route);
  };

  const renderIcon = (id: string, color: string) => {
    switch (id) {
      case "teachers":
        return <Ionicons name="school" size={28} color={color} />;
      case "students":
        return <Ionicons name="people" size={28} color={color} />;
      case "subjects":
        return <Ionicons name="book" size={28} color={color} />;
      case "grades":
        return <Ionicons name="bar-chart" size={28} color={color} />;
      default:
        return null;
    }
  };

  return (
    <View flex={1} background="white" p="$4">
      <YStack justify="space-between" items="center" mb="$6">
        <Heading
          size="$6"
          fontWeight="700"
          style={{ fontFamily: "Montserrat-Regular" }}
        >
          Home
        </Heading>

        <Text color="#6B7280" style={{ fontFamily: "Montserrat-Regular" }}>
          Navegue entre as páginas abaixo
        </Text>
      </YStack>

      <XStack flexWrap="wrap" gap="$4" justify="space-between">
        {(user?.user_type === "admin"
          ? quickActions
          : quickActions.filter((a) => a.id !== "teachers")
        ).map((action) => {
          return (
            <YStack
              key={action.id}
              width="100%"
              background="white"
              p="$4"
              items="center"
              justify="center"
              gap="$3"
              cursor="pointer"
              onPress={() => handleActionPress(action.route)}
              shadowColor="#000"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.05}
              shadowRadius={8}
              borderWidth={1}
              borderColor="#F3F4F6"
              hoverStyle={{
                shadowOpacity: 0.1,
                shadowRadius: 12,
                transform: [{ scale: 0.98 }],
                bg: action.bgColor + "20",
                borderColor: action.bgColor + "40",
              }}
              pressStyle={{
                transform: [{ scale: 0.95 }],
              }}
              style={{
                borderRadius: 16,
              }}
            >
              <RNView
                style={{
                  backgroundColor: action.bgColor,
                  width: 52,
                  height: 52,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 16,
                }}
              >
                {renderIcon(action.id, action.iconColor)}
              </RNView>
              <Text
                fontSize="$5"
                fontWeight="600"
                style={{ fontFamily: "Montserrat-Regular" }}
                color="#1F2937"
              >
                {action.label}
              </Text>
            </YStack>
          );
        })}
      </XStack>
    </View>
  );
}
