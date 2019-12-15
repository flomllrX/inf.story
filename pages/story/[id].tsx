import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import PropTypes from "prop-types";
import { NextPage, NextPageContext } from "next";
import ApiService from "../../services/ApiService";
import ErrorService from "../../services/ErrorService";
import StoryComponent from "../../components/Story";

const screenWidth = Math.round(Dimensions.get("window").width);
const maxWidth = 600;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: Math.min(screenWidth, maxWidth),
    paddingTop: 50,
    alignSelf: "center"
  }
});

const StoryPage: NextPage<any> = ({ story }) => (
  <View style={styles.container}>
    <StoryComponent
      items={story}
      width={maxWidth < screenWidth ? maxWidth : undefined}
    />
  </View>
);

StoryPage.getInitialProps = async ({ query }) => {
  try {
    const { id } = query;
    const { storyBits, error } = await ApiService.getStory(id as string);
    if (error) {
      ErrorService.criticalError(error);
    }
    return { story: storyBits || [] };
  } catch (e) {
    ErrorService.criticalError(e);
  }
};

StoryPage.propTypes = {
  story: PropTypes.any
};

export default StoryPage;
