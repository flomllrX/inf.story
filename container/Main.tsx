import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableOpacity
} from "react-native";
import Welcome from "../screens/Welcome";
import Story from "../screens/Story";
import { inject, observer } from "mobx-react";
import Header from "../components/Header";
import { colors, fonts } from "../theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  flex: {
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  text: {
    color: colors.defaultText,
    fontFamily: fonts.regular
  },
  button: {
    fontSize: 30,
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    fontSize: 13,
    paddingHorizontal: 10
  }
});

class Main extends Component<any, any> {
  static defaultProps = {};
  render() {
    const { slideLeft } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <Header
          leftButton={
            <TouchableOpacity style={styles.flex} onPress={() => slideLeft()}>
              <View style={styles.buttonContainer}>
                <Text style={[styles.text, styles.button]}>&lt;</Text>
                <Text style={[styles.text, styles.buttonText]}>History</Text>
              </View>
            </TouchableOpacity>
          }
        />
        <Welcome />
      </SafeAreaView>
    );
  }
}

export default inject("mainStore")(observer(Main));
