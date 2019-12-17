import React from "react";
import { View, Image, StyleSheet, Text, Linking } from "react-native";
import { colors, fonts } from "../theme";
import AutoHeightImage from "../components/AutoHeightImage";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    color: colors.defaultText,
    fontFamily: fonts.regular
  }
});

const Index: React.SFC<{}> = props => (
  <View style={styles.container}>
    <AutoHeightImage uri={require("../assets/title.png")} width={250} />
    <Text
      style={styles.text}
      onPress={() => Linking.openURL("https://discord.gg/yXGmY6y")}
    >
      Join the Discord
    </Text>
    <Text
      style={styles.text}
      onPress={() =>
        Linking.openURL("https://testflight.apple.com/join/aeEVsAWE")
      }
    >
      Download the iOS Beta
    </Text>
    <Text
      style={styles.text}
      onPress={() =>
        Linking.openURL(
          "https://play.google.com/store/apps/details?id=com.infinitestory"
        )
      }
    >
      Download for Android
    </Text>
  </View>
);

Index.defaultProps = {};

export default Index;
