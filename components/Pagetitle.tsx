import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { colors, fonts } from "../theme";

const styles = StyleSheet.create({
  headline: {
    color: colors.defaultText,
    fontFamily: fonts.regular,
    fontSize: 25,
    marginHorizontal: 25
  }
});

const Pagetitle: React.SFC<any> = ({ children }) => (
  <Text style={styles.headline}>{children}</Text>
);

Pagetitle.propTypes = {
  children: PropTypes.string
};
Pagetitle.defaultProps = {};

export default Pagetitle;
