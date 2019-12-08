import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Origin } from "../types";
import PropTypes from "prop-types";
import { colors, fonts } from "../theme";

interface Props {
  createdAt: string;
  origin: Origin;
  title: string;
  uid: string | number;
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

const StorySmall: React.SFC<Props> = ({ createdAt, origin, title, uid }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{title}</Text>
    <Text style={styles.text}>{new Date(createdAt).toDateString()}</Text>
  </View>
);

StorySmall.defaultProps = {};

StorySmall.propTypes = {
  createdAt: PropTypes.string,
  origin: PropTypes.any,
  title: PropTypes.string,
  uid: PropTypes.any
};

export default StorySmall;
