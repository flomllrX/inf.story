import React, { ReactChild } from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../theme";
import PropTypes from "prop-types";

interface Props {
  children: ReactChild;
}

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    marginHorizontal: 20
  },
  box: {
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderLeftColor: colors.borderBoxOuter,
    borderRightColor: colors.borderBoxOuter,
    flex: 1
  },
  boxInner: {
    borderColor: colors.borderBoxInner,
    borderWidth: 3,
    flex: 1
  },
  boxContainer: {
    flex: 1
  },
  borderTop: {
    height: 3,
    backgroundColor: colors.borderBoxOuter,
    marginHorizontal: 3
  },
  borderBottom: {
    height: 3,
    backgroundColor: colors.borderBoxOuter,
    marginHorizontal: 3
  }
});

const PixelBorderBox: React.SFC<Props> = ({ children }) => {
  return (
    <View style={styles.boxContainer}>
      <View style={styles.borderTop}></View>
      <View style={styles.box}>
        <View style={styles.boxInner}>{children}</View>
      </View>
      <View style={styles.borderBottom}></View>
    </View>
  );
};

PixelBorderBox.propTypes = {
  children: PropTypes.any
};

export default PixelBorderBox;
