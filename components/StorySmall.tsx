import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Origin } from "../types";
import PropTypes from "prop-types";
import { colors, fonts } from "../theme";
import { TouchableOpacity } from "react-native-gesture-handler";
import { withNavigation } from "react-navigation";

interface Props {
  createdAt: string;
  origin: Origin;
  title: string;
  uid: string | number;
  navigation: any;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  text: {
    color: colors.defaultText,
    fontFamily: fonts.regular
  }
});

const StorySmall: React.SFC<Props> = ({
  createdAt,
  origin,
  title,
  uid,
  navigation
}) => {
  console.log("Nav", navigation);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("StoryView", { storyId: uid })}
    >
      <Text style={styles.text}>{title}</Text>
      <Text style={styles.text}>{new Date(createdAt).toDateString()}</Text>
    </TouchableOpacity>
  );
};

StorySmall.defaultProps = {};

StorySmall.propTypes = {
  createdAt: PropTypes.string,
  origin: PropTypes.any,
  title: PropTypes.string,
  uid: PropTypes.any,
  navigation: PropTypes.any
};

export default withNavigation(StorySmall);
