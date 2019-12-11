import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Origin } from "../types";
import PropTypes from "prop-types";
import { colors, fonts } from "../theme";
import { TouchableOpacity } from "react-native-gesture-handler";
import { withNavigation } from "react-navigation";
import PORTRAITS from "../assets/portraits/PATHS.js";

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
  const day = new Date(createdAt).toDateString().substring(4);
  const rawTime = new Date(createdAt).toLocaleTimeString("en-US");
  const time = rawTime.substring(0, 5) + rawTime.substring(9);
  const date = day + " " + time.toLocaleLowerCase();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("StoryModal", { storyId: uid })}
    >
      <Image
        style={{ width: 70, height: 70 }}
        source={PORTRAITS.find(c => c.value === origin.class).portrait}
      />
      <View>
        <Text style={styles.text}>
          {origin.name}, the {origin.class}
        </Text>
        <Text style={[styles.text, styles.subText]}>{date}</Text>
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
