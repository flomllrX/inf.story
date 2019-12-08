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
import ControlService from "../services/ControlService";
import { inject, observer } from "mobx-react";

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
    ControlService.createStory()
  };

  startFake = () => {
    const { navigation } = this.props;
    navigation.navigate("Story");
  };

  render() {
    const { playerClass } = this.state;
    const { mainStore } = this.props;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Text style={[styles.text, styles.headLine]}>The</Text>
        <Text style={[styles.text, styles.headLine, styles.primaryColor]}>
          Infinite
        </Text>
        <Text style={[styles.text, styles.headLine]}>Story</Text>
        <View>
          <TouchableOpacity style={styles.startButton} onPress={this.onStart}>
            <Text style={styles.text}>Start</Text>
          </TouchableOpacity>
        </View>
        {mainStore.storyId ? (
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => ControlService.resumeStory()}
          >
            <Text style={styles.text}>Resume</Text>
          </TouchableOpacity>
        ) : null}
      </KeyboardAvoidingView>
    );
  }
}

export default inject("mainStore")(observer(Welcome));
