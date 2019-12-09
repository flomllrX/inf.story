import React, { Component } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import Chatbox from "../components/Chatbox";
import StoryComponent from "../components/Story";
import { colors, fonts } from "../theme";
import { inject, observer } from "mobx-react";
import ControlService from "../services/ControlService";
import { TouchableOpacity } from "react-native-gesture-handler";
import Header from "../components/Header";
import MainStore from "../mobx/mainStore";
import { withNavigation } from "react-navigation";
import LoadingStory from "./LoadingStory";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  }
});

interface Props {
  mainStore?: MainStore;
  storyId?: string;
  navigation: any;
}

class Story extends Component<Props, any> {
  state: {
    typing: string;
  } = {
    typing: ""
  };

  static defaultProps = {};

  sendMessage = async () => {
    const { typing } = this.state;
    ControlService.act(typing);
    this.setState({
      typing: ""
    });
  };

  componentDidMount() {
    const { navigation } = this.props;
    const storyId = navigation.getParam("storyId");
    if (storyId) {
      ControlService.setStory(storyId);
    }
  }

  render() {
    const { typing } = this.state;
    const { mainStore } = this.props;
    return mainStore.loadingStory ? (
      <LoadingStory />
    ) : (
      <SafeAreaView style={styles.container}>
        <Header />
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

export default withNavigation(inject("mainStore")(observer(Story)));
