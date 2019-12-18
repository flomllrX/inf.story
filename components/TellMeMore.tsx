import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ControlService from "../services/ControlService";
import { inject, observer } from "mobx-react";
import { fonts, colors } from "../theme";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontFamily: fonts.regular,
    color: colors.lightgray,
    fontSize: 14,
    padding: 5,
    marginTop: 10
  }
});

const TellMeMore: React.SFC<any> = ({ mainStore }) => (
  <TouchableOpacity
    style={styles.container}
    onPress={() => ControlService.act("")}
  >
    <Text style={styles.text}>Tell me more</Text>
  </TouchableOpacity>
);

TellMeMore.propTypes = {
  mainStore: PropTypes.any
};

export default inject("mainStore")(observer(TellMeMore));
