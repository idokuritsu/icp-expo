import { View, StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import internetIdLogo from "../../assets/images/internetIdentity.png";
import { useAuth } from "../../context/Auth";
import { PrimaryImageButton } from "../../components/reuseable";

export default function Authentication() {
  const { login } = useAuth();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  }
});
