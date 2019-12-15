import React, { Component } from "react";
import { View, Text, StyleSheet, SafeAreaView, Share, Dimensions } from "react-native";
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
import style from "react-syntax-highlighter/dist/styles/hljs/agate";

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
    padding: 10
  },
  modalInner: {
    backgroundColor: colors.modalBackground,
    padding: 20
  },
  modalTitle: {
    fontFamily: fonts.semiBold,
    color: colors.defaultText,
    fontSize: 18,
    paddingBottom: 10
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
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingBottom: 10
  },
  textButton: {
    fontFamily: fonts.regular,
    color: colors.defaultText,
    fontSize: 18
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
    const ownStory = !storyId || (mainStore.stories && mainStore.stories[storyId]);
    return mainStore.loadingStory ? (
      <LoadingStory />
    ) : (
      <SafeAreaView style={styles.container}>
        <Modal isVisible={!mainStore.tutorialDone}>
          <View style={styles.modalContainer}>
            <View style={styles.modalInner}>
              <Text style={styles.modalTitle}>Stay Awhile and Listen</Text>
              <Text style={styles.modalText}>
                The Infinite Story is a text adventure game whose story is generated by an AI. You progress through the
                story by using <Text style={styles.modalRed}>Actions</Text> and{" "}
                <Text style={styles.modalGreen}>Speech</Text>.
              </Text>
              <Text style={{ ...styles.modalText, paddingTop: 10 }}>
                You can <Text style={styles.modalBold}>do</Text> something by clicking on the bottom left button until
                it says <Text style={styles.modalRed}>Do:</Text>
              </Text>
              <Text style={styles.modalText}>
                Then, type an action like <Text style={styles.modalBold}>Go to the tavern</Text> or{" "}
                <Text style={styles.modalBold}>Prepare my magic sword</Text>. Actions must start with a verb!
              </Text>

              <Text style={{ ...styles.modalText, paddingTop: 10 }}>
                You can <Text style={styles.modalBold}>say</Text> something by clicking on the button until it says{" "}
                <Text style={styles.modalGreen}>Say:</Text>
              </Text>
              <View style={styles.tutorialButton}>
                <TouchableOpacity onPress={() => ControlService.closeTutorial()}>
                  <Text style={styles.textButton}>Understood</Text>
                </TouchableOpacity>
              </View>
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
                      url: "https://infinitestory.app/story/" + (storyId || mainStore.storyId)
                    })
                  : Share.share({
                      message: "Check out my story: https://infinitestory.app/story/" + (storyId || mainStore.storyId)
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
