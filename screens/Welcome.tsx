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
import ApiService from "../services/ApiService";

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
  },
  android: {
    width: 50,
    height: 20
  }
});

interface WelcomeState {
  playerClass: string;
  name: string;
}

class Welcome extends Component<any, WelcomeState> {
  static navigationOptions = { header: null };

  state = {
    playerClass: "noble",
    name: ""
  };

  onStart = () => {
    const { playerClass, name } = this.state;
    // TODO: verify that a name is given. (maybe generate one if none is given)
    ApiService.startStory(playerClass, name);
  };

  startFake = () => {
    const { navigation } = this.props;
    navigation.navigate("Story");
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
              inputAndroid: [styles.text, styles.underline, styles.android]
            }}
            onValueChange={playerClass => this.setState({ playerClass })}
            value={playerClass}
            items={[
              { label: "Noble", value: "noble" },
              { label: "Knight", value: "knight" },
              { label: "Squire", value: "squire" },
              { label: "Wizard", value: "wizard" },
              { label: "Ranger", value: "ranger" },
              { label: "Peasant", value: "peasant" },
              { label: "Rogue", value: "rouge" }
            ]}
          />
        </View>
        <View style={styles.setupRow}>
          <Text style={styles.text}>Choose your name: </Text>
          <TextInput
            value={this.state.name}
            style={[styles.text, styles.textInput]}
            onChangeText={name => this.setState({ name })}
          />
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
