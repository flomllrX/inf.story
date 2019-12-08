import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { StoryBit, Origin } from "../types";
import { colors, fonts } from "../theme";
import PropTypes from "prop-types";

interface Props {
  bit: StoryBit;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  rowText: {
    flex: 1,
    flexDirection: "row"
  },
  message: {
    fontSize: 18,
    color: colors.messageText,
    fontFamily: fonts.regular
  },
  prompt: {
    fontSize: 18,
    color: colors.primary,
    fontFamily: fonts.regular
  },
  semiBold: {
    fontFamily: fonts.semiBold
  },
  sayPrompt: {
    color: colors.actSay
  }
});

const Bit: React.SFC<Props> = ({ bit }) => {
  const { type, payload } = bit;
  let content;
  switch (type) {
    case "ACT_SAY":
    case "ACT_DO":
      content = (
        <>
          <Text
            style={[
              styles.prompt,
              styles.semiBold,
              type === "ACT_SAY" && styles.sayPrompt
            ]}
          >
            &gt;{" "}
          </Text>
          <Text style={[styles.message, styles.semiBold]}>{payload}</Text>
        </>
      );
      break;
    case "IMAGE": // TODO
      content = <Text style={styles.message}>{payload}</Text>;
      break;
    case "ORIGIN":
      const { name, class: playerClass, location } = payload as Origin;
      content = (
        <View>
          <Text style={styles.message}>{name}</Text>
          <Text style={styles.message}>{playerClass}</Text>
          <Text style={styles.message}>{location}</Text>
        </View>
      );
      break;
    default:
      content = <Text style={styles.message}>{bit.payload}</Text>;
  }

  return (
    <View style={styles.row}>
      <View style={styles.rowText}>{content}</View>
    </View>
  );
};

Bit.defaultProps = {};

Bit.propTypes = {
  bit: PropTypes.any
};

export default Bit;
