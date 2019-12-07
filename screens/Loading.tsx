import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  }
});

const Loading: React.SFC<{}> = props => <View style={styles.container}></View>;

Loading.defaultProps = {};

export default Loading;
