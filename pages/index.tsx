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
      Click here to join the Discord to get access to the Beta
    </Text>
  </View>
);

Index.defaultProps = {};

export default Index;
