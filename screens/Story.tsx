import React, { Component } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import Chatbox from "../components/Chatbox";
import StoryComponent from "../components/Story";
import { colors } from "../theme";
import { inject, observer } from "mobx-react";
import ApiService from "../services/ApiService";
import { TouchableOpacity } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  button: {
    color: colors.defaultText
  }
});

class Story extends Component<any, any> {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: colors.background,
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0
    },
    headerLeft: () => (
      <TouchableOpacity onPress={ApiService.resetStory}>
        <Text style={styles.button}>&lt;</Text>
      </TouchableOpacity>
    )
  };
  state: {
    typing: string;
  } = {
    typing: ""
  };

  static defaultProps = {};

  sendMessage = async () => {
    const { typing } = this.state;
    ApiService.act(typing);
    this.setState({
      typing: ""
    });
  };

  render() {
    const { typing } = this.state;
    const { mainStore } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <StoryComponent items={mainStore.story} extraData={this.state} />
        <Chatbox
          value={typing}
          sendMessage={this.sendMessage}
          onChangeText={typing => this.setState({ typing })}
          inputDisabled={mainStore.infering}
        />
      </SafeAreaView>
    );
  }
}

export default inject("mainStore")(observer(Story));
