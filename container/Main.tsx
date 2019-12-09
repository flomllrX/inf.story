import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Welcome from "../screens/Welcome";
import Story from "../screens/Story";
import { inject, observer } from "mobx-react";

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

class Main extends Component<any, any> {
  static defaultProps = {};
  render() {
    return <Welcome />;
  }
}

export default inject("mainStore")(observer(Main));
