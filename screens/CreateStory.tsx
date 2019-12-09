import React, { Component, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  FlatList,
  SafeAreaView,
  Animated
} from "react-native";
import { colors, fonts } from "../theme";
import ControlService from "../services/ControlService";
import { inject, observer } from "mobx-react";
import PropTypes from "prop-types";
import Header from "../components/Header";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    color: colors.defaultText,
    fontFamily: fonts.regular,
    fontSize: 18
  },
  textGreyedOut: {
    color: colors.greyed,
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
  name: {
    marginBottom: 30,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  playerClass: {
    margin: 5,
    marginLeft: "10%",
    marginRight: "10%",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  playerClassTextContainer: {
    flex: 1,
    marginLeft: 10,
    flexDirection: "column"
    // justifyContent: "space-between"
  },
  playerClassName: {
    color: colors.defaultText,
    fontFamily: fonts.regular,
    fontSize: 19
  },
  playerClassDescription: {
    color: colors.greyed,
    fontFamily: fonts.regular,
    fontSize: 13
  },
  playerClassContainer: {
    flex: 1,
    width: "100%",
    paddingLeft: 80,
    paddingRight: 80
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15
  },
  headerText: {
    color: colors.defaultText,
    fontFamily: fonts.regular,
    fontSize: 23
  },
  buttonContainer: {
    marginTop: -40
  },
  android: {
    width: 50,
    height: 20
  },
  list: {
    flex: 1
  },
  selectIcon: {
    position: "absolute",
    left: -20,
    top: 22,
    zIndex: 999
  },
  nextButton: {
    paddingBottom: 20
  }
});

interface CreateStoryState {
  playerClass: string;
  name: string;
  step: number;
}

interface PlayerClass {
  name: string;
  portrait: any;
  description: string;
  value: string;
  locked?: boolean;
}
const CLASSES: PlayerClass[] = [
  {
    name: "Squire",
    portrait: require("../assets/portraits/squire.png"),
    description: "You are the shield bearer of a well respected knight.",
    value: "squire"
  },
  {
    name: "Thief",
    portrait: require("../assets/portraits/thief.png"),
    description: "You live from stealing rare artifacts.",
    value: "thief"
  },
  {
    name: "Knight",
    portrait: require("../assets/portraits/knight.png"),
    description: "You are brave and strong. Life is dangerous for you.",
    value: "knight"
  },
  {
    name: "King",
    portrait: require("../assets/portraits/noble.png"),
    description: "You must balance a life of luxury and reign.",
    value: "noble"
  },
  {
    name: "Peasant",
    portrait: require("../assets/portraits/peasant.png"),
    description: "You started from nothing and you still have nothing.",
    value: "peasant"
  },
  {
    name: "Rogue",
    portrait: require("../assets/portraits/rogue.png"),
    description: "You live in the forest and hunt your own food.",
    value: "rogue"
  },
  {
    name: "???",
    portrait: require("../assets/portraits/orc.png"),
    description: "🔒 This class is locked",
    value: "orc",
    locked: true
  },
  {
    name: "???",
    portrait: require("../assets/portraits/shadow.png"),
    description: "🔒 This class is locked",
    value: "shadow",
    locked: true
  }
];

const MovingCursor = props => {
  const [left] = useState(new Animated.Value(3)); // Initial value for opacity: 0

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
        left: left // Bind opacity to animated value
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

class CreateStory extends Component<any, CreateStoryState> {
  static navigationOptions = { header: null };

  state = {
    step: 0,
    playerClass: "",
    name: ""
  };

  onStart = () => {
    const { playerClass, name } = this.state;
    // TODO: verify that a name is given. (maybe generate one if none is given)
    ControlService.startStory(playerClass, name);
  };

  render() {
    const { playerClass, name, step } = this.state;
    const renderItem = element => {
      const { item } = element;
      const c: PlayerClass = item;
      const isSelected = playerClass == c.value;
      return (
        <TouchableOpacity
          onPress={() => {
            if (!c.locked) {
              this.setState({ playerClass: c.value });
            }
          }}
        >
          <View style={styles.playerClass} key={c.name}>
            {isSelected ? (
              <View style={{ ...styles.selectIcon }}>
                <MovingCursor>
                  <Text style={styles.text}>&gt;</Text>
                </MovingCursor>
              </View>
            ) : (
              undefined
            )}
            <Image style={{ width: 70, height: 70 }} source={c.portrait} />
            <View style={styles.playerClassTextContainer}>
              <Text style={styles.playerClassName}>{c.name}</Text>
              <Text style={styles.playerClassDescription}>{c.description}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    };
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <KeyboardAvoidingView behavior="padding" style={styles.center}>
          {step === 0 ? (
            <SafeAreaView style={styles.playerClassContainer}>
              <View style={styles.header}>
                <Text style={styles.headerText}>Choose your class: </Text>
              </View>
              <FlatList
                style={styles.list}
                data={CLASSES}
                renderItem={renderItem}
                keyExtractor={() => "" + Math.random()}
                extraData={{ playerClass }}
              />
            </SafeAreaView>
          ) : (
            undefined
          )}
          {step === 1 ? (
            <KeyboardAvoidingView behavior="padding">
              <View style={styles.name}>
                <Image
                  style={{ width: 80, height: 80 }}
                  source={CLASSES.find(c => c.value === playerClass).portrait}
                />
                <View style={styles.setupRow}>
                  <Text style={styles.text}>Choose your name: </Text>
                  <TextInput
                    value={this.state.name}
                    style={[styles.text, styles.textInput]}
                    onChangeText={name => this.setState({ name })}
                  />
                </View>
              </View>
            </KeyboardAvoidingView>
          ) : (
            undefined
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => {
                // Final state
                if (!playerClass && step === 0) {
                  return;
                }
                if (name.length === 0 && step === 1) {
                  return;
                }
                if (step === 1) {
                  ControlService.startStory(playerClass, name);
                } else {
                  this.setState({
                    step: step + 1
                  });
                }
              }}
            >
              <Text
                style={[
                  playerClass ? styles.text : styles.textGreyedOut,
                  styles.nextButton
                ]}
              >
                {step === 1 ? "Start" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

export default inject("mainStore")(observer(CreateStory));
