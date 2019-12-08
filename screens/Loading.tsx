import React from "react";
import { View, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const Loading: React.SFC<{}> = props => <View style={styles.container}></View>;

Loading.defaultProps = {};

export default Loading;
