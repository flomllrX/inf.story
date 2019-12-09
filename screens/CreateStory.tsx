import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  FlatList,
  SafeAreaView
} from "react-native";
import { colors, fonts } from "../theme";
import Svg, { Image as ImageSvg } from "react-native-svg";
import ControlService from "../services/ControlService";
import { inject, observer } from "mobx-react";
import { element } from "prop-types";

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
  playerClass: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  playerClassContainer: {
    flex: 1
  },
  android: {
    width: 50,
    height: 20
  },
  list: {
    flex: 1
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
}
const CLASSES: PlayerClass[] = [
  {
    name: "Squire",
    portrait: require("../assets/portraits/squire.png"),
    description: "A noble dude",
    value: "squire"
  },
  {
    name: "Thief",
    portrait: require("../assets/portraits/thief.png"),
    description: "A noble dude",
    value: "thief"
  },
  {
    name: "Knight",
    portrait: require("../assets/portraits/knight.png"),
    description: "A knight",
    value: "knight"
  },
  {
    name: "Noble",
    portrait: require("../assets/portraits/noble.png"),
    description: "A noble dude",
    value: "noble"
  },
  {
    name: "Peasant",
    portrait: require("../assets/portraits/peasant.png"),
    description: "A noble dude",
    value: "peasant"
  },
  {
    name: "Rogue",
    portrait: require("../assets/portraits/rogue.png"),
    description: "A noble dude",
    value: "rogue"
  },
  {
    name: "???",
    portrait: require("../assets/portraits/orc.png"),
    description: "This class is locked",
    value: "orc"
  },
  {
    name: "???",
    portrait: require("../assets/portraits/shadow.png"),
    description: "This class is locked",
    value: "shadow"
  }
];

class CreateStory extends Component<any, CreateStoryState> {
  static navigationOptions = { header: null };

  state = {
    step: 0,
    playerClass: "noble",
    name: ""
  };

  onStart = () => {
    const { playerClass, name } = this.state;
    // TODO: verify that a name is given. (maybe generate one if none is given)
    ControlService.startStory(playerClass, name);
  };

  startFake = () => {
    const { navigation } = this.props;
    navigation.navigate("Story");
  };

  render() {
    const { playerClass, name, step } = this.state;
    const { mainStore } = this.props;
    const renderItem = element => {
      const { item } = element;
      const c = item;
      return (
        <View style={styles.playerClass} key={c.name}>
          <Image style={{ width: 70, height: 70 }} source={c.portrait} />
          <Text style={styles.text}>{c.name}</Text>
        </View>
      );
    };
    return (
      <SafeAreaView style={styles.container}>
        {step === 0 ? (
          <SafeAreaView style={styles.playerClassContainer}>
            <Text style={styles.text}>Choose your class: </Text>
            <FlatList
              style={styles.list}
              data={CLASSES}
              renderItem={renderItem}
              keyExtractor={() => "" + Math.random()}
            />
          </SafeAreaView>
        ) : (
          undefined
        )}
        {step === 1 ? (
          <View style={styles.setupRow}>
            <Text style={styles.text}>Choose your name: </Text>
            <TextInput
              value={this.state.name}
              style={[styles.text, styles.textInput]}
              onChangeText={name => this.setState({ name })}
            />
          </View>
        ) : (
          undefined
        )}
        <View>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => {
              // Final state
              if (this.state.step === 1) {
                ControlService.startStory(playerClass, name);
              } else {
                this.setState({
                  step: step + 1
                });
              }
            }}
          >
            <Text style={styles.text}>{step === 1 ? "Start" : "Next"}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

export default inject("mainStore")(observer(CreateStory));
