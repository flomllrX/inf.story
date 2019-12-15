import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Share,
  Dimensions
} from "react-native";
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
import { Platform } from "@unimodules/core";
import Modal from "react-native-modal";

const screenWidth = Math.round(Dimensions.get("window").width);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  text: {
    fontFamily: fonts.regular,
    color: colors.defaultText
  },
  modalContainer: {
    width: "100%",
    padding: 30
  },
  modalInner: {
    backgroundColor: colors.modalBackground,
    padding: 20
  },
  modalText: {
    fontFamily: fonts.regular,
    color: colors.defaultText
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
    console.log("moutned");
    const { navigation } = this.props;
    const storyId = navigation.getParam("storyId");
    if (storyId) {
      ControlService.setStory(storyId);
    }
  }

  render() {
    const { typing } = this.state;
    const { mainStore, navigation } = this.props;
    const storyId = navigation.getParam("storyId");
    const ownStory =
      !storyId || (mainStore.stories && mainStore.stories[storyId]);
    return mainStore.loadingStory ? (
      <LoadingStory />
    ) : (
      <SafeAreaView style={styles.container}>
        <Modal
          isVisible={!mainStore.tutorialDone}
          onBackdropPress={() => ControlService.closeTutorial()}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalInner}>
              <Text style={styles.modalText}>This is a modal</Text>
            </View>
          </View>
        </Modal>
        <Header
          rightButtons={[
            <TouchableOpacity
              key={0}
              onPress={() => {
                Platform.OS === "ios"
                  ? Share.share({
                      url:
                        "https://infinitestory.app/story/" +
                        (storyId || mainStore.storyId)
                    })
                  : Share.share({
                      message:
                        "Check out my story: https://infinitestory.app/story/" +
                        (storyId || mainStore.storyId)
                    });
              }}
            >
              <Text style={styles.text}>Share</Text>
            </TouchableOpacity>
          ]}
        />
        <StoryComponent items={mainStore.story} extraData={this.state} />
        {ownStory && (
          <Chatbox
            value={typing}
            sendMessage={this.sendMessage}
            onChangeText={typing => this.setState({ typing })}
            inputDisabled={mainStore.infering}
          />
        )}
      </SafeAreaView>
    );
  }
}

export default withNavigation(inject("mainStore")(observer(Story)));
