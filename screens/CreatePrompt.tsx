import React, { Component, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { inject, observer } from "mobx-react";
import { colors, fonts } from "../theme";
import Header from "../components/Header";
import PropTypes from "prop-types";
import PixelBorderBox from "../components/PixelBorderBox";
import ControlService from "../services/ControlService";
import { NavigationContext } from "react-navigation";
import PixelButton from "../components/PixelButton";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

interface Props {
  mainStore?: any;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  title: {
    color: colors.defaultText,
    fontFamily: fonts.regular,
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center"
  },
  innerContainer: {
    flex: 1,
    marginHorizontal: 20
  },
  keyboardAvoidingView: {
    flex: 1
  },
  textInput: {
    color: colors.defaultText,
    fontFamily: fonts.regular,
    marginHorizontal: 10,
    textAlignVertical: "top"
  },
  text: {
    color: colors.defaultText,
    fontFamily: fonts.regular
  },
  borderTop: {
    height: 3,
    backgroundColor: colors.borderBoxOuter,
    marginHorizontal: 3
  },
  borderBottom: {
    height: 3,
    backgroundColor: colors.borderBoxOuter,
    marginHorizontal: 3
  },
  createStoryBox: {
    marginBottom: 30
  },
  buttons: {
    height: 50,
    marginVertical: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end"
  },
  button: {
    height: 50,
    marginHorizontal: 10,
    width: 130
  },
  startButtonText: {
    color: colors.defaultText,
    fontFamily: fonts.regular,
    padding: 10,
    textAlign: "center"
  },
  titleBox: {
    minHeight: 120
  },
  shareButton: {
    color: colors.defaultText,
    fontFamily: fonts.regular
  },
  contextInput: {
    minHeight: 300
  }
});

const CreatePrompt: React.SFC<Props> = ({ mainStore }) => {
  const navigation = useContext(NavigationContext);

  const {
    currentPromptTitle: title,
    currentPromptContext: context,
    currentPromptUid: promptId,
    promptButtonActivated
  } = mainStore;

  const buttonsDisabled = !promptButtonActivated || !(title && context);

  const onStart = async () => {
    let uid = promptId;
    if (!uid) {
      const { uid: newUid } = await ControlService.createPrompt(title, context);
      uid = newUid;
    }
    ControlService.startStory(undefined, undefined, uid);
    await navigation.goBack();
    navigation.navigate("StoryModal");
  };
  const onSave = async () => {
    if (mainStore.currentPromptUid) {
      await ControlService.updatePrompt(promptId, title, context);
    } else {
      await ControlService.createPrompt(title, context);
    }
    navigation.goBack();
  };

  const onDeletePrompt = async () => {
    if (mainStore.currentPromptUid) {
      await ControlService.deletePrompt(promptId);
    }
    navigation.goBack();
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header
        rightButtons={[
          <TouchableOpacity key={Math.random()} onPress={onDeletePrompt}>
            <Text style={styles.text}>Delete</Text>
          </TouchableOpacity>
        ]}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.innerContainer}>
          <View style={{ height: 90 }}>
            <Text style={styles.title}>Title</Text>
            <PixelBorderBox>
              <TextInput
                style={styles.textInput}
                placeholder="Insert the title of your story..."
                placeholderTextColor={colors.lightgray}
                value={title}
                onChangeText={text => mainStore.setCurrentPromptTitle(text)}
              />
            </PixelBorderBox>
          </View>
          <View style={{ flex: 3, marginTop: 30 }}>
            <Text style={styles.title}>Opening</Text>
            <PixelBorderBox>
              <TextInput
                multiline
                style={[styles.textInput, styles.contextInput]}
                placeholder="Insert background information and the opening of your story in this box..."
                placeholderTextColor={colors.lightgray}
                value={context}
                onChangeText={text => mainStore.setCurrentPromptContext(text)}
              />
            </PixelBorderBox>
          </View>
          <View style={styles.buttons}>
            <PixelButton
              onPress={onSave}
              label={"Save"}
              style={{ marginRight: 15, flex: 1 }}
              deactivated={buttonsDisabled}
            />
            <PixelButton
              onPress={onStart}
              label={"Start"}
              style={{ marginLeft: 15, flex: 1 }}
              deactivated={buttonsDisabled}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

CreatePrompt.propTypes = {
  mainStore: PropTypes.any
};

export default inject("mainStore")(observer(CreatePrompt));
