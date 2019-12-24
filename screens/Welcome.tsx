import React, { Component, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Animated,
  Linking,
  TextInput
} from "react-native";
import PropTypes from "prop-types";
import { colors, fonts } from "../theme";
import ControlService from "../services/ControlService";
import { inject, observer } from "mobx-react";
import { withNavigation } from "react-navigation";
import PORTRAITS from "../assets/portraits/PATHS";
import ErrorService from "../services/ErrorService";
import AutoHeightImage from "../components/AutoHeightImage";
import { Platform } from "@unimodules/core";
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  centerContainer: {
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
    borderBottomWidth: 1,
    borderBottomColor: colors.defaultText,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 10,
    minWidth: 200
  },
  startButton: {
    marginTop: 50
  },
  android: {
    width: 50,
    height: 20
  },
  selectIcon: {
    position: "absolute",
    left: -20,
    zIndex: 999
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
    bottom: 40
  },
  bold: {
    fontFamily: fonts.bold
  },
  quests: {
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20
  },
  questTitle: {
    color: colors.defaultText,
    fontFamily: fonts.semiBold,
    fontSize: 18,
    marginBottom: 8
  },
  quest: {
    color: colors.greyed,
    fontFamily: fonts.regular,
    fontSize: 13
  },
  questDone: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    color: colors.greyed,
    fontFamily: fonts.regular,
    fontSize: 13
  },
  logo: {
    marginTop: "20%"
  },
  warning: {
    color: colors.defaultText,
    margin: 20,
    padding: 10,
    fontSize: 15,
    backgroundColor: colors.primary
  },
  modalTitle: {
    fontFamily: fonts.semiBold,
    color: colors.defaultText,
    fontSize: 18,
    paddingBottom: 10,
    alignSelf: "center"
  },
  modalText: {
    fontFamily: fonts.regular,
    color: colors.defaultText,
    fontSize: 16
  },
  modalBold: {
    fontFamily: fonts.semiBold,
    color: colors.defaultText,
    fontSize: 16
  },
  modalRed: {
    fontFamily: fonts.bold,
    color: colors.actDo,
    fontSize: 16
  },
  modalGreen: {
    fontFamily: fonts.semiBold,
    color: colors.actSay,
    fontSize: 16
  },
  tutorialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  },
  textButton: {
    fontFamily: fonts.regular,
    color: colors.defaultText,
    fontSize: 18
  }
});

const MovingCursor = props => {
  const [left] = useState(new Animated.Value(3)); // Initial value for left: 3

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(left, {
          toValue: -3,
          duration: 500
        }),
        Animated.timing(left, {
          toValue: 3,
          duration: 500
        })
      ]),
      {}
    ).start();
  }, []);

  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        left: left // Bind left to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
};

MovingCursor.propTypes = {
  style: PropTypes.any,
  children: PropTypes.any
};

class Welcome extends Component<any, any> {
  static navigationOptions = { header: null };

  onStart = () => {
    const { navigation } = this.props;
    ControlService.createStory();
    navigation.navigate("MainStoryModal");
  };

  onResume = async () => {
    const { navigation } = this.props;
    ControlService.resumeStory();
    navigation.navigate("MainStoryModal");
  };

  onDiscordQuest = () => {
    let code;
    Linking.openURL("https://discord.gg/yXGmY6y");
    ControlService.openModal(
      <>
        <Text style={styles.modalTitle}>Enter your Discord code</Text>
        <TextInput
          style={[styles.text, styles.textInput]}
          onChangeText={text => (code = text)}
        />
        <View style={styles.tutorialButton}>
          <TouchableOpacity
            onPress={async () => {
              await ControlService.useDiscordCode("" + code);
              ControlService.closeModal();
            }}
          >
            <Text style={styles.textButton}>Verify</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  render() {
    const { mainStore } = this.props;
    const { stories, lastActStoryId: storyId } = mainStore;
    const {
      origin: { name, class: playerClass, location }
    } = (storyId && stories && stories[storyId]) || {
      origin: {}
    };

    const discordAchievement =
      mainStore.achievements &&
      mainStore.achievements.find(e => e === "discord");

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS ? "padding" : null}
      >
        <AutoHeightImage
          style={styles.logo}
          uri={require("../assets/title.png")}
          width={250}
        />
        {!mainStore.apiAvailable ? (
          <Text style={[styles.text, styles.warning]}>
            Warning: we are currently offline for maintenance. Join the{" "}
            <Text
              onPress={() => Linking.openURL("https://discord.gg/yXGmY6y")}
              style={styles.underline}
            >
              Discord
            </Text>{" "}
            to get notified immediately when we are back up.
          </Text>
        ) : (
          <View>
            <TouchableOpacity style={styles.startButton} onPress={this.onStart}>
              <View style={{ ...styles.selectIcon }}>
                <MovingCursor>
                  <Text style={styles.text}>&gt;</Text>
                </MovingCursor>
              </View>
              <Text style={styles.text}>Start an Adventure</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.quests}>
          <Text style={styles.questTitle}>Quests:</Text>
          <Text
            style={mainStore.tutorialDone ? styles.questDone : styles.quest}
          >
            {mainStore.tutorialDone ? "▣" : "▢"} Start your first adventure!
          </Text>
          <Text
            style={discordAchievement ? styles.questDone : styles.quest}
            onPress={this.onDiscordQuest}
          >
            {discordAchievement ? "▣" : "▢"} Join the Discord to access a ???
            class
          </Text>
        </View>
        {name && playerClass && location ? (
          <TouchableOpacity
            style={[styles.startButton, styles.resumeButton]}
            onPress={this.onResume}
          >
            <View style={styles.resumeView}>
              <Image
                style={{ width: 70, height: 70 }}
                source={PORTRAITS.find(c => c.value === playerClass).portrait}
              />
              <Text style={[styles.text, { paddingLeft: 15, width: "80%" }]}>
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
