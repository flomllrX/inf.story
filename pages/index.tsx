import React from "react";
import { View, Image, StyleSheet } from "react-native";
import dynamic from "next/dynamic";
import { colors } from "../theme";

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
  }
});

const Index: React.SFC<{}> = props => (
  <View style={styles.container}>
    <Image source={require("../assets/title.png")} style={styles.img} />
  </View>
);

Index.defaultProps = {};

export default Index;
