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

export const locations = {
  dungeon: [
    require("../assets/locations/dungeon/dungeon1.png"),
    require("../assets/locations/dungeon/dungeon2.png"),
    require("../assets/locations/dungeon/dungeon3.png"),
    require("../assets/locations/dungeon/dungeon4.png"),
    require("../assets/locations/dungeon/dungeon5.png")
  ],
  jail: [require("../assets/locations/jail/jail1.png")],
  forest: [
    require("../assets/locations/forest/forest1.png"),
    require("../assets/locations/forest/forest2.png"),
    require("../assets/locations/forest/forest3.png"),
    require("../assets/locations/forest/forest4.png")
  ],
  graveyard: [
    require("../assets/locations/graveyard/graveyard1.png"),
    require("../assets/locations/graveyard/graveyard2.png"),
    require("../assets/locations/graveyard/graveyard3.png")
  ],
  mountain: [
    require("../assets/locations/mountain/mountain1.png"),
    require("../assets/locations/mountain/mountain2.png"),
    require("../assets/locations/mountain/mountain3.png")
  ],
  observatory: [
    require("../assets/locations/observatory/observatory1.png"),
    require("../assets/locations/observatory/observatory2.png"),
    require("../assets/locations/observatory/observatory3.png"),
    require("../assets/locations/observatory/observatory4.png"),
    require("../assets/locations/observatory/observatory5.png")
  ],
  orchard: [
    require("../assets/locations/orchard/orchard1.png"),
    require("../assets/locations/orchard/orchard2.png"),
    require("../assets/locations/orchard/orchard3.png"),
    require("../assets/locations/orchard/orchard4.png")
  ],
  ruin: [
    require("../assets/locations/ruin/ruin1.png"),
    require("../assets/locations/ruin/ruin2.png"),
    require("../assets/locations/ruin/ruin3.png"),
    require("../assets/locations/ruin/ruin4.png"),
    require("../assets/locations/ruin/ruin5.png")
  ],
  plain: [require("../assets/locations/plain/plain1.png")],
  sanctuary: [
    require("../assets/locations/sanctuary/sanctuary1.png"),
    require("../assets/locations/sanctuary/sanctuary2.png"),
    require("../assets/locations/sanctuary/sanctuary3.png"),
    require("../assets/locations/sanctuary/sanctuary4.png")
  ],
  sewer: [
    require("../assets/locations/sewer/sewer1.png"),
    require("../assets/locations/sewer/sewer2.png"),
    require("../assets/locations/sewer/sewer3.png"),
    require("../assets/locations/sewer/sewer4.png"),
    require("../assets/locations/sewer/sewer5.png")
  ],
  moon: [require("../assets/locations/moon/moon1.png")],
  mars: [require("../assets/locations/mars/mars1.png")],
  star: [require("../assets/locations/star/star1.png")],
  swamp: [
    require("../assets/locations/swamp/swamp1.png"),
    require("../assets/locations/swamp/swamp2.png"),
    require("../assets/locations/swamp/swamp3.png"),
    require("../assets/locations/swamp/swamp4.png")
  ],
  valley: [require("../assets/locations/valley/valley1.png")],
  temple: [
    require("../assets/locations/temple/temple1.png"),
    require("../assets/locations/temple/temple2.png"),
    require("../assets/locations/temple/temple3.png"),
    require("../assets/locations/temple/temple4.png"),
    require("../assets/locations/temple/temple5.png")
  ],
  desert: [
    require("../assets/locations/desert/desert1.png"),
    require("../assets/locations/desert/desert2.png"),
    require("../assets/locations/desert/desert3.png"),
    require("../assets/locations/desert/desert4.png"),
    require("../assets/locations/desert/desert5.png")
  ],
  city: [require("../assets/locations/city/city1.png"), require("../assets/locations/city/city2.png")],
  village: [require("../assets/locations/village/village1.png")],
  town: [require("../assets/locations/town/town1.png")],
  port: [require("../assets/locations/port/port1.png"), require("../assets/locations/port/port2.png")],
  cave: [
    require("../assets/locations/cave/cave1.png"),
    require("../assets/locations/cave/cave2.png"),
    require("../assets/locations/cave/cave3.png"),
    require("../assets/locations/cave/cave4.png")
  ],
  catacomb: [
    require("../assets/locations/catacomb/catacomb1.png"),
    require("../assets/locations/catacomb/catacomb2.png"),
    require("../assets/locations/catacomb/catacomb3.png"),
    require("../assets/locations/catacomb/catacomb4.png"),
    require("../assets/locations/catacomb/catacomb5.png"),
    require("../assets/locations/catacomb/catacomb6.png")
  ],
  castle: [
    require("../assets/locations/castle/castle1.png"),
    require("../assets/locations/castle/castle2.png"),
    require("../assets/locations/castle/castle3.png"),
    require("../assets/locations/castle/castle4.png"),
    require("../assets/locations/castle/castle5.png")
  ],
  volcano: [
    require("../assets/locations/volcano/volcano1.png"),
    require("../assets/locations/volcano/volcano2.png"),
    require("../assets/locations/volcano/volcano3.png"),
    require("../assets/locations/volcano/volcano4.png"),
    require("../assets/locations/volcano/volcano5.png")
  ],
  tower: [require("../assets/locations/tower/tower1.png")],
  fortress: [require("../assets/locations/fortress/fortress1.png"), require("../assets/locations/fortress/fortress2.png")]
};

export const portraits = {
  knight: require("../assets/portraits/knight.png"),
  noble: require("../assets/portraits/noble.png"),
  orc: require("../assets/portraits/orc.png"),
  peasant: require("../assets/portraits/peasant.png"),
  shadow: require("../assets/portraits/shadow.png"),
  squire: require("../assets/portraits/squire.png"),
  ranger: require("../assets/portraits/ranger.png"),
  rogue: require("../assets/portraits/rogue.png")
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
        <Text style={[styles.prompt, styles.semiBold, type === "ACT_SAY" && styles.sayPrompt]}>&gt; </Text>
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
          <Text style={[styles.message, styles.originSubtitle]}>{uppercase(playerClass)}</Text>
          <Text style={[styles.message, styles.originSubtitle]}>from {location}</Text>
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
              ★ New location discovered: <Text style={styles.bold}>{uppercase(location)}</Text>
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
