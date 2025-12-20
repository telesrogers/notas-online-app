import { authService } from "@/src/services";
import type { User } from "@/src/types/user.types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Avatar, Text, XStack } from "tamagui";
import logo from "../../assets/images/logo.jpg";

export default function HeaderMenu({
  isAtAuthPage = false,
}: {
  isAtAuthPage?: boolean;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    };
    loadUser();
  }, []);

  const handleNavigation = (route: any) => {
    router.push(route);
  };

  return (
    <XStack
      height="10%"
      items={"center"}
      justify={"space-between"}
      px="$2"
      bg="#fff"
      borderBottomWidth={2}
      borderBottomColor="#8c8c8c1b"
    >
      <XStack
        items="center"
        p="$2"
        cursor="pointer"
        onPress={() => handleNavigation("/(app)/(tabs)/")}
      >
        <Avatar circular size="$7">
          <Avatar.Image src={logo} />
        </Avatar>
      </XStack>

      <XStack
        items="center"
        p="$3"
        cursor="pointer"
        style={{
          visibility: isAtAuthPage ? "hidden" : "visible",
        }}
      >
        <Text
          fontWeight={"500"}
          fontSize={"$5"}
          style={{ fontFamily: "Montserrat-Regular" }}
          color={"#003866"}
        >
          Seja bem-vindo,
        </Text>
        <Text
          fontWeight={"700"}
          fontSize={"$5"}
          style={{ fontFamily: "Montserrat-Regular" }}
          color={"#003866"}
        >
          {user?.name ? ` ${user.name}` : " Caro Usuário"}
        </Text>
        <Text
          pl="$0.5"
          fontWeight={"700"}
          fontSize={"$5"}
          style={{ fontFamily: "Montserrat-Regular" }}
          color={"#003866"}
        >
          !
        </Text>
      </XStack>
    </XStack>
  );
}
