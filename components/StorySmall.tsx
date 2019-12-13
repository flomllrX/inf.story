import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Origin } from "../types";
import PropTypes from "prop-types";
import { colors, fonts } from "../theme";
import { TouchableOpacity } from "react-native-gesture-handler";
import { withNavigation } from "react-navigation";
import PORTRAITS from "../assets/portraits/PATHS.js";
import DateTime from "luxon/src/datetime.js";

interface Props {
  createdAt: string;
  origin: Origin;
  uid: string | number;
  navigation: any;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  text: {
    color: colors.defaultText,
    fontFamily: fonts.regular,
    fontSize: 20
  },
  subText: {
    color: colors.lightgray,
    fontSize: 14
  }
});

const StorySmall: React.SFC<Props> = ({
  createdAt,
  origin,
  uid,
  navigation
}) => {
  const dateJs = new Date(createdAt);
  const dateLuxon = DateTime.fromJSDate(dateJs);
  const template = DateTime.DATETIME_MED;
  delete template.year;
  const displayDate = dateLuxon.toLocaleString(template);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("StoryModal", { storyId: uid })}
    >
      <Image
        style={{ width: 70, height: 70 }}
        source={PORTRAITS.find(c => c.value === origin.class).portrait}
      />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.text}>
          {origin.name}, the {origin.class}
        </Text>
        <Text style={[styles.text, styles.subText]}>{displayDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

StorySmall.defaultProps = {};

StorySmall.propTypes = {
  createdAt: PropTypes.string,
  origin: PropTypes.any,
  uid: PropTypes.any,
  navigation: PropTypes.any
};

export default withNavigation(StorySmall);
