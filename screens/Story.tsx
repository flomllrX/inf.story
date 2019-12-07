import React, { Component } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import Chatbox from "../components/Chatbox";
import StoryComponent from "../components/Story";
import { colors } from "../theme";
import { inject, observer } from "mobx-react";
import ApiService from "../services/ApiService";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  }
});

class Story extends Component<any, any> {
  static navigationOptions = { header: null };
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
