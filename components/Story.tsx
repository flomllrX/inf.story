import React from "react";
import PropTypes from "prop-types";
import { FlatList } from "react-native";
import { StoryBit } from "../types";
import StoryBitComponent from "./StoryBit";
import { Platform } from "@unimodules/core";

interface Props {
  items: StoryBit[];
  extraData?: object;
  width?: number;
}

const Story: React.SFC<Props> = ({ items, extraData, width }) => {
  const renderItem = element => {
    const { item } = element;
    return <StoryBitComponent bit={item} width={width} />;
  };
  return (
    <FlatList
      inverted={Platform.OS !== "web"}
      data={items}
      renderItem={renderItem}
      extraData={extraData}
      keyExtractor={() => "" + Math.random()}
    />
  );
};

Story.defaultProps = {};

Story.propTypes = {
  items: PropTypes.array,
  extraData: PropTypes.object,
  width: PropTypes.number
};

export default Story;
