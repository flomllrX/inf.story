import React from "react";
import { View, StyleSheet, Dimensions, Text, Linking } from "react-native";
import PropTypes from "prop-types";
import { NextPage, NextPageContext } from "next";
import ApiService from "../../services/ApiService";
import ErrorService from "../../services/ErrorService";
import StoryComponent from "../../components/Story";
import AutoHeightImage from "../../components/AutoHeightImage";
import { colors, fonts } from "../../theme";

const screenWidth = Math.round(Dimensions.get("window").width);
const maxWidth = 600;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: Math.min(screenWidth, maxWidth),
    paddingVertical: 50,
    alignSelf: "center"
  },
  text: {
    color: colors.defaultText,
    fontFamily: fonts.regular
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 100
  }
});

const StoryPage: NextPage<any> = ({ story }) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <AutoHeightImage uri={require("../../assets/title.png")} width={250} />
      <Text
        style={styles.text}
        onPress={() => Linking.openURL("https://discord.gg/yXGmY6y")}
      >
        Join the Discord
      </Text>
      <Text
        style={styles.text}
        onPress={() =>
          Linking.openURL("https://testflight.apple.com/join/aeEVsAWE")
        }
      >
        Download the iOS Beta
      </Text>
      <Text
        style={styles.text}
        onPress={() =>
          Linking.openURL(
            "https://play.google.com/store/apps/details?id=com.infinitestory"
          )
        }
      >
        Download for Android
      </Text>
    </View>
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
