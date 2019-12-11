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
import PORTRAITS from "../assets/portraits/PATHS";
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
    width: 390,
    height: 120
  },
  android: {
    width: 50,
    height: 20
  },
  resumeView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "90%",
    marginLeft: "5%"
  },
  resumeButton: {
    position: "absolute",
    bottom: 50
  },
  bold: {
    fontFamily: fonts.bold
  }
});

interface WelcomeState {
  playerClass: string;
  name: string;
  location: string;
  storyId: string;
}

class Welcome extends Component<any, WelcomeState> {
  static navigationOptions = { header: null };

  state = {
    playerClass: "noble",
    name: "",
    location: "",
    storyId: ""
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
    let { playerClass, name, location } = this.state;
    const { stories, storyId } = mainStore;

    // TODO: solve re-rendering issue with values of past story
    if (storyId && stories) {
      const resumedStory = stories.find(e => {
        return e.uid.toString() === storyId;
      });
      if (resumedStory) {
        playerClass = resumedStory.origin.class;
        name = resumedStory.origin.name;
        location = resumedStory.origin.location;
      }
    }

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Image source={require("../assets/title.png")} style={styles.img} />
        <View>
          <TouchableOpacity style={styles.startButton} onPress={this.onStart}>
            <Text style={styles.text}>&gt; Start an Adventure</Text>
          </TouchableOpacity>
        </View>
        {mainStore.storyId ? (
          <TouchableOpacity
            style={[styles.startButton, styles.resumeButton]}
            onPress={this.onResume}
          >
            <View style={styles.resumeView}>
              <Image
                style={{ width: 70, height: 70 }}
                source={PORTRAITS.find(c => c.value === playerClass).portrait}
              />
              <Text style={[styles.text, { paddingLeft: 30, width: "80%" }]}>
                Resume your adventure with{" "}
                <Text style={styles.bold}>{name}</Text> the{" "}
                <Text style={styles.bold}>{playerClass}</Text> from{" "}
                <Text style={styles.bold}>{location}</Text>.
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
      </KeyboardAvoidingView>
    );
  }
}

export default inject("mainStore")(withNavigation(observer(Welcome)));
