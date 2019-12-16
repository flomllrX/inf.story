import React, { Component, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Animated,
  Linking
} from "react-native";
import PropTypes from "prop-types";
import { colors, fonts } from "../theme";
import ControlService from "../services/ControlService";
import { inject, observer } from "mobx-react";
import { withNavigation } from "react-navigation";
import PORTRAITS from "../assets/portraits/PATHS";
import ErrorService from "../services/ErrorService";
import AutoHeightImage from "../components/AutoHeightImage";
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
    minWidth: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.defaultText
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

  render() {
    const { mainStore } = this.props;
    const { stories, lastActStoryId: storyId } = mainStore;
    const {
      origin: { name, class: playerClass, location }
    } = (storyId && stories && stories[storyId]) || {
      origin: {}
    };

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <AutoHeightImage
          style={styles.logo}
          uri={require("../assets/title.png")}
          width={250}
        />
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
        <View style={styles.quests}>
          <Text style={styles.questTitle}>Quests:</Text>
          <Text
            style={mainStore.tutorialDone ? styles.questDone : styles.quest}
          >
            {mainStore.tutorialDone ? "▣" : "▢"} Start your first adventure!
          </Text>
          <Text
            style={styles.quest}
            onPress={() => Linking.openURL("https://discord.gg/yXGmY6y")}
          >
            ▢ Join the Discord to access a ??? class
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
