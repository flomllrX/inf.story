import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView
} from "react-native";
import { colors, fonts } from "../theme";
import ControlService from "../services/ControlService";
import { inject, observer } from "mobx-react";
import { withNavigation } from "react-navigation";
import MainTitle from "../components/MainTitle";

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
  img: {
    // TODO: center svg img
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
    const { navigation } = this.props;
    ControlService.createStory();
    navigation.navigate("MainStoryModal");
  };

  onResume = () => {
    const { navigation } = this.props;
    ControlService.resumeStory();
    navigation.navigate("MainStoryModal");
  };

  render() {
    const { mainStore } = this.props;

    console.log("heeeeeeere", mainStore);

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <MainTitle style={styles.img} />
        <View>
          <TouchableOpacity style={styles.startButton} onPress={this.onStart}>
            <Text style={styles.text}>> Start an Adventure</Text>
          </TouchableOpacity>
        </View>
        {mainStore.storyId ? (
          <TouchableOpacity style={styles.startButton} onPress={this.onResume}>
            <Text style={styles.text}>Resume your adventure with</Text>
          </TouchableOpacity>
        ) : null}
      </KeyboardAvoidingView>
    );
  }
}

export default inject("mainStore")(withNavigation(observer(Welcome)));
