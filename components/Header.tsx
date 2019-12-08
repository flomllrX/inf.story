import React from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  leftButton?: any;
  rightButtons?: any[];
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    height: 40
  },
  left: {
    flex: 1
  },
  right: {
    flex: 4,
    flexDirection: "row"
  }
});

const Header: React.SFC<Props> = ({ leftButton, rightButtons }) => (
  <View style={styles.container}>
    <View style={styles.left}>{leftButton}</View>
    <View style={styles.right}>{rightButtons}</View>
  </View>
);

Header.defaultProps = {};

Header.propTypes = {
  leftButton: PropTypes.any,
  rightButtons: PropTypes.any
};

export default Header;
