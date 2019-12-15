import React from "react";
import { View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { NextPage, NextPageContext } from "next";
import ApiService from "../../services/ApiService";
import ErrorService from "../../services/ErrorService";
import StoryComponent from "../../components/Story";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 500,
    paddingTop: 50,
    alignSelf: "center"
  }
});

const StoryPage: NextPage<any> = ({ story }) => (
  <View style={styles.container}>
    <StoryComponent items={story} />
  </View>
);

StoryPage.getInitialProps = async ({ query }) => {
  const { id } = query;
  const { storyBits, error } = await ApiService.getStory(id as string);
  if (error) {
    ErrorService.criticalError(error);
  }
  return { story: storyBits || [] };
};

StoryPage.propTypes = {
  story: PropTypes.any
};

export default StoryPage;
