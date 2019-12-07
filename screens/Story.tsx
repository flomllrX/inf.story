import React, { Component } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import Chatbox from "../components/Chatbox";
import StoryComponent from "../components/Story";
import { colors } from "../theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  }
});

class Story extends Component<{}, any> {
  static navigationOptions = { header: null };
  state: {
    typing: string;
    messages: { sender: "PLAYER" | "AI"; message: string; id: string }[];
    inputDisabled: boolean;
  } = {
    typing: "",
    messages: [
      {
        sender: "AI",
        message: `You are Arthur, a peasant living in the kingdom of Larion.
    
You have a pitchfork and a nothing else. You wake up and begin working in the fields. You see your brother William, who is also a farmer, chopping wood for the winter. He looks up from his work when he sees you approach.
    
"What's going on?" he asks. "I thought you were dead".`,
        id: "intro"
      }
    ],
    inputDisabled: false
  };

  static defaultProps = {};

  sendMessage = async () => {
    // set the component state (clears text input)
    const { messages, typing } = this.state;
    messages.unshift({
      sender: "PLAYER",
      message: typing,
      id: "" + Math.random()
    });
    this.setState({
      typing: "",
      messages,
      inputDisabled: true
    });
    console.log(messages);
  };

  render() {
    const { typing, inputDisabled } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <StoryComponent items={this.state.messages} extraData={this.state} />
        <Chatbox
          value={typing}
          sendMessage={this.sendMessage}
          onChangeText={typing => this.setState({ typing })}
          inputDisabled={inputDisabled}
        />
      </SafeAreaView>
    );
  }
}

export default Story;
