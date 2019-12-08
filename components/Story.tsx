import React from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { colors, fonts } from "../theme";
import { StoryBit } from "../types";
import StoryBitComponent from "./StoryBit";

interface Props {
  items: StoryBit[];
  extraData: object;
}

const Story: React.SFC<Props> = props => {
  const renderItem = element => {
    const { item } = element;
    return <StoryBitComponent bit={item} />;
  };
  return (
    <FlatList
      inverted
      data={props.items}
      renderItem={renderItem}
      extraData={props.extraData}
      keyExtractor={() => "" + Math.random()}
    />
  );
};

Story.defaultProps = {};

Story.propTypes = {
  items: PropTypes.array,
  extraData: PropTypes.object
};

export default Story;
