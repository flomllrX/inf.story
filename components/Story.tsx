import React from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { colors, fonts } from "../theme";
import { StoryBit } from "../services/ApiService";

interface Props {
  items: StoryBit[];
  extraData: object;
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
  }
});

const Story: React.SFC<Props> = props => {
  const renderItem = element => {
    const { item } = element;
    return (
      <View style={styles.row}>
        <View style={styles.rowText}>
          {item.type === "ACT_SAY" || item.type === "ACT_DO" ? (
            <>
              <Text style={[styles.prompt, styles.semiBold]}>&gt; </Text>
              <Text style={[styles.message, styles.semiBold]}>
                {item.payload}
              </Text>
            </>
          ) : item.type === "IMAGE" ? (
            <Text style={styles.message}>{item.payload}</Text>
          ) : (
            <Text style={styles.message}>{item.payload}</Text>
          )}
        </View>
      </View>
    );
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
