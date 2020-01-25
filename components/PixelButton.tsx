import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import PixelBorderBox from "./PixelBorderBox";
import { colors, fonts } from "../theme";

const styles = StyleSheet.create({
  container: {
    height: 50
  },
  text: {
    color: colors.defaultText,
    fontFamily: fonts.regular,
    padding: 10,
    textAlign: "center"
  },
  textDeactivated: {
    color: colors.lightgray
  }
});

interface Props {
  onPress?: () => any;
  label: string;
  style?: any;
  deactivated?: boolean;
}
const PixelButton: React.SFC<Props> = ({
  onPress,
  label,
  style,
  deactivated
}) => (
  <TouchableOpacity
    disabled={deactivated}
    onPress={() => {
      !deactivated && onPress();
    }}
    style={[styles.container, style]}
  >
    <PixelBorderBox>
      <Text
        style={[styles.text, deactivated ? styles.textDeactivated : undefined]}
      >
        {label}
      </Text>
    </PixelBorderBox>
  </TouchableOpacity>
);

PixelButton.propTypes = {
  onPress: PropTypes.func,
  label: PropTypes.string,
  style: PropTypes.any,
  deactivated: PropTypes.bool
};

export default PixelButton;
