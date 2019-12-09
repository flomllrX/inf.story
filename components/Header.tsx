import React from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { withNavigation } from "react-navigation";
import { colors, fonts } from "../theme";

interface Props {
  leftButton?: any;
  rightButtons?: any[];
  navigation: any;
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
  },
  button: {
    color: colors.defaultText,
    fontFamily: fonts.regular,
    fontSize: 30,
    paddingHorizontal: 10
  }
});

const Header: React.SFC<Props> = ({ leftButton, rightButtons, navigation }) => (
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

Header.defaultProps = {};

Header.propTypes = {
  leftButton: PropTypes.any,
  rightButtons: PropTypes.any,
  navigation: PropTypes.any
};

export default withNavigation(Header);
