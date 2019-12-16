import React from "react";
import { View, Image, StyleSheet, Text, Linking } from "react-native";
import { colors, fonts } from "../theme";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  img: {
    width: 390,
    height: 120
  },
  text: {
    color: colors.defaultText,
    fontFamily: fonts.regular
  }
});

const Index: React.SFC<{}> = props => (
  <View style={styles.container}>
    <Image source={require("../assets/title.png")} style={styles.img} />
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
