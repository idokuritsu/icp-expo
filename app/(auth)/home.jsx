import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useUserActor } from "../../actor";
import { registerUserProfile } from "../../api";
export default function Home() {
  const actor = useUserActor();
  useEffect(() => {
    const register = async () => {
      if (!actor) return;

      await registerUserProfile(actor, "Alice", 25);
    };

    register();
  }, [actor]);
  return (
    <>
      <View>
        <Text>Congratulations you are authorized</Text>
      </View>
    </>
  );
}
