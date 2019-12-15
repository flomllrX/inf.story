import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";
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
    <Text style={styles.text}>Join the beta</Text>
  </View>
);

Index.defaultProps = {};

export default Index;
