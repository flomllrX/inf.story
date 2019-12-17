import React from "react";
import PropTypes from "prop-types";
import { colors, fonts } from "../theme";

import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity
} from "react-native";
import { inject, observer } from "mobx-react";
import { Platform } from "@unimodules/core";

interface Props {
  value: string;
  sendMessage: () => void;
  onChangeText: (text: string) => void;
  inputDisabled: boolean;
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    backgroundColor: colors.chatboxBackground,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.chatboxBorder,
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 20
  },
  input: {
    paddingRight: 20,
    paddingLeft: 10,
    fontSize: 15,
    flex: 1,
    color: colors.chatboxText,
    fontFamily: fonts.regular
  },
  buttonDisabled: {
    backgroundColor: colors.buttonDisabled
  },
  sendButton: {
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignSelf: "center",
    padding: 20,
    margin: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  sendIcon: {
    position: "absolute",
    color: colors.chatboxSendIcon,
    fontSize: 20,
    fontFamily: fonts.semiBold,
    paddingLeft: 3
  },
  actDo: {
    color: colors.actDo
  },
  actSay: {
    color: colors.actSay
  },
  toggleButton: {
    borderRadius: 50,
    alignSelf: "center",
    padding: 20,
    margin: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  toggleButtonText: {
    position: "absolute",
    color: colors.chatboxSendIcon,
    fontSize: 15,
    fontFamily: fonts.semiBold,
    paddingLeft: 35
  },
  sendButtonSay: {
    backgroundColor: colors.actSay
  }
});

const Chatbox: React.SFC<any> = ({
  value,
  onChangeText,
  sendMessage,
  inputDisabled,
  mainStore
}) => {
  const actionDo = mainStore.actionType === "ACT_DO";
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null}>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.toggleButton]}
          onPress={() => mainStore.toggleActionType()}
          disabled={inputDisabled}
        >
          <Text
            style={[
              styles.input,
              styles.toggleButtonText,
              actionDo ? styles.actDo : styles.actSay
            ]}
          >
            {actionDo ? "Do:" : "Say:"}
          </Text>
        </TouchableOpacity>
        <TextInput
          editable={!inputDisabled}
          value={value}
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder={
            inputDisabled
              ? "Action being executed..."
              : actionDo
              ? "Next action?"
              : "What do you say?"
          }
          placeholderTextColor={colors.chatboxPlaceholder}
          onChangeText={onChangeText}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            actionDo ? undefined : styles.sendButtonSay,
            inputDisabled ? styles.buttonDisabled : undefined
          ]}
          onPress={sendMessage}
          disabled={inputDisabled}
        >
          <Text style={styles.sendIcon}>&gt;</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

Chatbox.propTypes = {
  value: PropTypes.string,
  sendMessage: PropTypes.func,
  onChangeText: PropTypes.func,
  inputDisabled: PropTypes.bool,
  mainStore: PropTypes.any
};

export default inject("mainStore")(observer(Chatbox));
