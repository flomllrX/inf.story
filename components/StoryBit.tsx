import React from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import { StoryBit, Origin, Location } from "../types";
import { colors, fonts } from "../theme";
import PropTypes from "prop-types";

interface Props {
  bit: StoryBit;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  rowText: {
    flex: 1,
    flexDirection: "row"
  },
  message: {
    fontSize: 18,
    color: colors.messageText,
    fontFamily: fonts.regular
  },
  prompt: {
    fontSize: 18,
    color: colors.primary,
    fontFamily: fonts.regular
  },
  semiBold: {
    fontFamily: fonts.semiBold
  },
  sayPrompt: {
    color: colors.actSay
  },
  bold: {
    fontFamily: fonts.semiBold
  },
  location: {
    color: colors.lightgray,
    marginVertical: 10
  },
  origin: {
    flexDirection: "row",
    flex: 1
  },
  originPortrait: {
    width: 150,
    height: 150
  },
  originText: {
    marginHorizontal: 10,
    flex: 1,
    justifyContent: "center"
  },
  originName: {
    fontSize: 20
  },
  originSubtitle: {
    color: colors.lightgray
  }
});

const bg = "../assets/locations/";
const locations = {
  forest: [require(bg + "jail.png")],
  jail: [require(bg + "jail.png")],
  castle: [require(bg + "jail.png")],
  keep: [require(bg + "jail.png")],
  lake: [require(bg + "jail.png")],
  mountain: [require(bg + "jail.png")],
  town: [require(bg + "jail.png")],
  village: [require(bg + "jail.png")]
};

const pt = "../assets/portraits/";
const portraits = {
  knight: require(pt + "knight.png"),
  noble: require(pt + "noble.png"),
  orc: require(pt + "orc.png"),
  peasant: require(pt + "peasant.png"),
  shadow: require(pt + "shadow.png"),
  squire: require(pt + "squire.png"),
  thief: require(pt + "thief.png"),
  rogue: require(pt + "rogue.png")
};
const uppercase = (s: string) => {
  return s[0].toUpperCase() + s.substr(1).toLowerCase();
};

const Bit: React.SFC<Props> = ({ bit }) => {
  const { type, payload } = bit;
  let content;
  if (type === "ACT_SAY" || type === "ACT_DO") {
    content = (
      <>
        <Text
          style={[
            styles.prompt,
            styles.semiBold,
            type === "ACT_SAY" && styles.sayPrompt
          ]}
        >
          &gt;{" "}
        </Text>
        <Text style={[styles.message, styles.semiBold]}>{payload}</Text>
      </>
    );
  } else if (type === "IMAGE") {
    content = <Text style={styles.message}>{payload}</Text>;
  } else if (type === "ORIGIN") {
    const { name, class: playerClass, location } = payload as Origin;
    content = (
      <View style={styles.origin}>
        <Image source={portraits[playerClass]} style={styles.originPortrait} />
        <View style={styles.originText}>
          <Text style={[styles.message, styles.originName]}>{name}</Text>
          <Text style={[styles.message, styles.originSubtitle]}>
            {uppercase(playerClass)}
          </Text>
          <Text style={[styles.message, styles.originSubtitle]}>
            from {location}
          </Text>
        </View>
      </View>
    );
  } else if (type === "LOCATION") {
    const { location, firstVisit, seed } = payload as Location;
    const backgrounds = locations[location];
    const source = backgrounds[seed % backgrounds.length];
    content = (
      <View>
        <Image source={source} />
        <Text style={[styles.message, styles.location]}>
          {firstVisit ? (
            <Text>
              ★ New location discovered:{" "}
              <Text style={styles.bold}>{uppercase(location)}</Text>
            </Text>
          ) : (
            uppercase(location)
          )}
        </Text>
      </View>
    );
  } else {
    content = <Text style={styles.message}>{bit.payload}</Text>;
  }

  return (
    <View style={styles.row}>
      <View style={styles.rowText}>{content}</View>
    </View>
  );
};

Bit.defaultProps = {};

Bit.propTypes = {
  bit: PropTypes.any
};

export default Bit;
