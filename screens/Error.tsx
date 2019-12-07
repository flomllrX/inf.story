import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    color: colors.defaultText,
    justifyContent: "center",
    alignItems: "center"
  }
});

class Error extends Component<{}, any> {
  static navigationOptions = { header: null };
  static defaultProps = {};

  render() {
    return (
      <View style={styles.container}>
        <Text>Error</Text>
      </View>
    );
  }
}

export default Error;
