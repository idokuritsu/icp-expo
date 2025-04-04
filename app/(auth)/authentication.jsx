import { View } from "react-native";
import React from "react";
import internetIdLogo from "../../assets/images/internetIdentity.png";
import { useAuth } from "../../context/Auth";
import { PrimaryImageButton } from "../../components/reuseable";
export default function Authentication() {
  const { login } = useAuth();
  return (
    <>
      <View>
        <PrimaryImageButton
          imgDim={{ width: 30, height: 10 }}
          src={internetIdLogo}
          text="Continue with Internet Identity"
          customStyle={{ fontSize: 14 }}
          submit={() => {
            login("internetIdentity");
          }}
        />
      </View>
    </>
  );
}
