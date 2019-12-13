import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme";
import { inject, observer } from "mobx-react";
import { TouchableOpacity } from "react-native-gesture-handler";
import ControlService from "../services/ControlService";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    color: colors.defaultText
  }
});

class Error extends Component<any, any> {
  static defaultProps = {};
  render() {
    const { mainStore } = this.props;
    const error = mainStore.error;
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{error}</Text>
        <TouchableOpacity onPress={() => mainStore.clearError()}>
          <Text style={styles.text}>Go back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => ControlService.clearAllData()}>
          <Text style={styles.text}>Clear data</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default inject("mainStore")(observer(Error));
