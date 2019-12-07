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
    paddingHorizontal: 20,
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
  }
});

const Chatbox: React.SFC<Props> = ({
  value,
  onChangeText,
  sendMessage,
  inputDisabled
}) => (
  <KeyboardAvoidingView behavior="padding">
    <View style={styles.footer}>
      <TextInput
        editable={!inputDisabled}
        value={value}
        style={styles.input}
        underlineColorAndroid="transparent"
        placeholder={
          inputDisabled
            ? "Action being executed..."
            : "What's your next action?"
        }
        placeholderTextColor={colors.chatboxPlaceholder}
        onChangeText={onChangeText}
      />
      <TouchableOpacity
        style={[
          styles.sendButton,
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

Chatbox.propTypes = {
  value: PropTypes.string,
  sendMessage: PropTypes.func,
  onChangeText: PropTypes.func,
  inputDisabled: PropTypes.bool
};

export default Chatbox;
