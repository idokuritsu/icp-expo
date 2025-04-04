import { StyleSheet, View, Text } from "react-native";
import React from "react";
import internetIdLogo from "../../assets/images/internetIdentity.png";
import { useAuth } from "../../context/Auth";
import { PrimaryImageButton } from "../../components/reuseable";
export default function Authentication() {
  const styles = createStyles();
  const { login } = useAuth();
  return (
    <>
      <View>
        <Text allowFontScaling={false} style={styles.headerText}>
          Create your account
        </Text>

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
          <Text
            allowFontScaling={false}
            variant="SatoshiMedium"
            style={[styles.subText, { textAlign: "center" }]}
          >
            Or
          </Text>
        </View>
        <Text allowFontScaling={false} style={styles.desc}>
          By signing up, you agree to our Terms,Privacy Policy, and
          {"\n"}
          Cookie Use.
        </Text>
      </View>
    </>
  );
}

