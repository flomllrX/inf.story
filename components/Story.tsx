import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { FlatList } from "react-native";
import { StoryBit } from "../types";
import StoryBitComponent from "./StoryBit";
import { Platform } from "@unimodules/core";

interface Props {
  items: StoryBit[];
  extraData?: object;
  width?: number;
  inverted?: boolean;
}

const Story: React.SFC<Props> = ({ items, extraData, width, inverted }) => {
  let ref;
  const renderItem = element => {
    const { item } = element;
    return <StoryBitComponent bit={item} width={width} />;
  };
  useEffect(() => {
    ref.scrollToIndex({ animated: true, index: 0, viewPosition: 0 });
  }, [items]);
  return (
    <FlatList
      inverted={inverted || Platform.OS !== "web"}
      data={items}
      renderItem={renderItem}
      extraData={extraData}
      keyExtractor={() => "" + Math.random()}
      ref={r => (ref = r)}
    />
  );
};

Story.defaultProps = {};

Story.propTypes = {
  items: PropTypes.array,
  extraData: PropTypes.object,
  width: PropTypes.number,
  inverted: PropTypes.bool
};

export default Story;
