import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Share,
  Dimensions,
  TouchableOpacity
} from "react-native";
import Chatbox from "../components/Chatbox";
import StoryComponent from "../components/Story";
import { colors, fonts } from "../theme";
import { inject, observer } from "mobx-react";
import ControlService from "../services/ControlService";
import Header from "../components/Header";
import MainStore from "../mobx/mainStore";
import { withNavigation } from "react-navigation";
import LoadingStory from "./LoadingStory";
import { Platform } from "@unimodules/core";
import Toast from "react-native-root-toast";
import TellMeMore from "../components/TellMeMore";
import ApiService from "../services/ApiService";

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
  toast: {
    fontFamily: fonts.regular
  },
  toastContainer: {
    backgroundColor: colors.primary,
    padding: 10
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 50
  },
  textButton: {
    fontFamily: fonts.regular,
    color: colors.defaultText,
    fontSize: 18
  },
  headerButton: {
    marginRight: 20
  },
  modalButton: {
    paddingTop: 20,
    fontSize: 18
  },
  modal: {
    alignItems: "center"
  },
  red: {
    color: colors.primary
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
    const { navigation, mainStore } = this.props;
    const storyId = navigation.getParam("storyId");
    if (storyId) {
      ControlService.setStory(storyId);
    }
    if (!mainStore.tutorialDone) {
      ControlService.openModal(
        <>
          <Text style={styles.modalTitle}>Stay Awhile and Listen</Text>
          <Text style={styles.modalText}>
            The Infinite Story is a text adventure game whose story is generated
            by an AI. You progress through the story by using{" "}
            <Text style={styles.modalRed}>Actions</Text> and{" "}
            <Text style={styles.modalGreen}>Speech</Text>.
          </Text>
          <Text style={{ ...styles.modalText, paddingTop: 10 }}>
            You can <Text style={styles.modalBold}>do</Text> something by
            clicking on the bottom left button until it says{" "}
            <Text style={styles.modalRed}>Do:</Text>
          </Text>
          <Text style={styles.modalText}>
            Then, type an action like{" "}
            <Text style={styles.modalBold}>Go to the tavern</Text> or{" "}
            <Text style={styles.modalBold}>Prepare my magic sword</Text>.
            Actions must start with a verb!
          </Text>

          <Text style={{ ...styles.modalText, paddingTop: 10 }}>
            You can <Text style={styles.modalBold}>say</Text> something by
            clicking on the button until it says{" "}
            <Text style={styles.modalGreen}>Say:</Text>
          </Text>
          <View style={styles.tutorialButton}>
            <TouchableOpacity
              onPress={() => {
                ControlService.setTutorialDone();
                ControlService.closeModal();
              }}
            >
              <Text style={styles.textButton}>Understood</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    }
  }

  share = async () => {
    const { mainStore, navigation } = this.props;
    const storyId = navigation.getParam("storyId") || mainStore.storyId;
    if (storyId) {
      const response = await ApiService.updateStory(storyId, true);
      Platform.OS === "ios"
        ? Share.share({
            url: "https://infinitestory.app/story/" + storyId
          })
        : Share.share({
            message:
              "Check out my story: https://infinitestory.app/story/" +
              (storyId || mainStore.storyId)
          });
    }
  };

  deleteStory = async () => {
    const { mainStore, navigation } = this.props;
    const storyId = mainStore.storyId;
    ControlService.openModal(
      <View style={[styles.modal]}>
        <Text style={styles.modalTitle}>Warning:</Text>
        <Text style={styles.text}>This action can not be undone</Text>
        <Text
          onPress={async () => {
            await ControlService.deleteStory(storyId);
            await ControlService.closeModal();
            navigation.goBack();
          }}
          style={[styles.text, styles.modalButton, styles.red]}
        >
          Delete story
        </Text>
        <Text
          style={[styles.text, styles.modalButton]}
          onPress={async () => await ControlService.closeModal()}
        >
          Cancel
        </Text>
      </View>
    );
  };

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
        {!!mainStore.storyError && (
          <Toast
            visible={true}
            position={Toast.positions.CENTER}
            backgroundColor={colors.primary}
            opacity={1}
          >
            <Text style={styles.toast}>{mainStore.storyError}</Text>
          </Toast>
        )}
        <Header
          rightButtons={[
            <TouchableOpacity
              key={0}
              onPress={this.deleteStory}
              style={styles.headerButton}
            >
              <Text style={styles.text}>Delete</Text>
            </TouchableOpacity>,
            <TouchableOpacity key={1} onPress={this.share}>
              <Text style={styles.text}>Share</Text>
            </TouchableOpacity>
          ]}
        />
        <StoryComponent
          items={mainStore.story}
          extraData={this.state}
          own={!!ownStory}
        />
        {ownStory && (
          <>
            <TellMeMore />
            <Chatbox
              value={typing}
              sendMessage={this.sendMessage}
              onChangeText={typing => this.setState({ typing })}
              inputDisabled={mainStore.infering}
            />
          </>
        )}
      </SafeAreaView>
    );
  }
}

export default withNavigation(inject("mainStore")(observer(Story)));
