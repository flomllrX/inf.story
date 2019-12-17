import React, { useContext } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationContext } from "react-navigation";
import { colors, fonts } from "../theme";
import { Platform } from "@unimodules/core";

interface Props {
  leftButton?: any;
  rightButtons?: any[];
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    height: 50,
    marginTop: Platform.OS === "android" ? 25 : 0
  },
  left: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 20
  },
  right: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: 20
  },
  button: {
    color: colors.defaultText,
    fontFamily: fonts.regular,
    fontSize: 30
  },
  buttonContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center"
  }
});

const Header: React.SFC<Props> = ({ leftButton, rightButtons }) => {
  const navigation = useContext(NavigationContext);
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {leftButton || (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.buttonContainer}
          >
            <Text style={styles.button}>&lt;</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.right}>{rightButtons}</View>
    </View>
  );
};

Header.defaultProps = {};

Header.propTypes = {
  leftButton: PropTypes.any,
  rightButtons: PropTypes.any
};

export default Header;
