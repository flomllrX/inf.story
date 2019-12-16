import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { colors, fonts } from "../theme";
import { inject, observer } from "mobx-react";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    color: colors.defaultText,
    fontSize: 20,
    width: "80%",
    margin: "0 10%"
  },
  bold: {
    fontFamily: fonts.semiBold
  },
  subText: {
    fontFamily: fonts.regular
  },
  fire: {
    width: 350,
    height: 350
  }
});

class LoadingStory extends Component<any, any> {
  static navigationOptions = { header: null };
  static defaultProps = {};

  render() {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, styles.bold]}>
          We are creating the adventure...
        </Text>
        <Text style={[styles.text, styles.subText]}>
          Meanwhile, rest next to the camp fire.
        </Text>
        <Image style={styles.fire} source={require("../assets/fire.gif")} />
      </View>
    );
  }
}

export default LoadingStory;
