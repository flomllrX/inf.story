import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView
} from "react-native";
import { colors, fonts } from "../theme";
import PickerSelect from "react-native-picker-select";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    color: colors.defaultText,
    fontFamily: fonts.regular,
    fontSize: 18
  },
  headLine: {
    fontSize: 30
  },
  setupRow: {
    flexDirection: "row",
    marginTop: 30
  },
  underline: {
    textDecorationLine: "underline"
  },
  textInput: {
    minWidth: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.defaultText
  },
  startButton: {
    marginTop: 50
  },
  primaryColor: {
    color: colors.primary
  }
});

interface WelcomeState {
  playerClass: string;
}

class Welcome extends Component<any, WelcomeState> {
  static navigationOptions = { header: null };

  state = {
    playerClass: "human"
  };

  onStart = () => {
    const { navigate } = this.props.navigation;
    navigate("Story");
  };

  render() {
    const { playerClass } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Text style={[styles.text, styles.headLine]}>The</Text>
        <Text style={[styles.text, styles.headLine, styles.primaryColor]}>
          Infinite
        </Text>
        <Text style={[styles.text, styles.headLine]}>Story</Text>
        <View style={styles.setupRow}>
          <Text style={styles.text}>Choose your class: </Text>
          <PickerSelect
            style={{
              inputIOS: [styles.text, styles.underline],
              inputAndroid: [styles.text, styles.underline]
            }}
            onValueChange={value => console.log(value)}
            value={playerClass}
            items={[
              { label: "Human", value: "human" },
              { label: "Wizard", value: "wizard" },
              { label: "Royal", value: "royal" }
            ]}
          />
        </View>
        <View style={styles.setupRow}>
          <Text style={styles.text}>Choose your name: </Text>
          <TextInput style={[styles.text, styles.textInput]} />
        </View>
        <View>
          <TouchableOpacity style={styles.startButton} onPress={this.onStart}>
            <Text style={styles.text}>Start</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default Welcome;
