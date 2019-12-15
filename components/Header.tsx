import React, { useContext } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationContext } from "react-navigation";
import { colors, fonts } from "../theme";

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
    flex: 1,
    minWidth: 50
  },
  right: {
    flex: 4,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: 20
  },
  button: {
    color: colors.defaultText,
    fontFamily: fonts.regular,
    fontSize: 30,
    paddingHorizontal: 20
  }
});

const Header: React.SFC<Props> = ({ leftButton, rightButtons }) => {
  const navigation = useContext(NavigationContext);
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {leftButton || (
          <TouchableOpacity onPress={() => navigation.goBack()}>
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
