import React, { Component, useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, TextInput } from "react-native";
import { inject, observer } from "mobx-react";
import { colors, fonts } from "../theme";
import Header from "../components/Header";
import PropTypes from "prop-types";
import { ScrollView } from "react-native-gesture-handler";
import { withNavigation } from "react-navigation";
import PixelButton from "../components/PixelButton";
import PromptOverview from "../components/PromptOverview";
import MainStore from "../mobx/mainStore";

interface Props {
  mainStore?: MainStore;
  navigation?: any;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  title: {
    color: colors.defaultText,
    fontFamily: fonts.regular,
    fontSize: 18,
    marginTop: 30,
    marginBottom: 10,
    textAlign: "center"
  },
  innerContainer: {
    flex: 1,
    marginHorizontal: 20
  },
  buttons: {
    height: 50,
    marginVertical: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end"
  },
  button: {
    height: 50,
    marginHorizontal: 10
  },
  startButtonText: {
    color: colors.defaultText,
    fontFamily: fonts.regular,
    padding: 10,
    textAlign: "center"
  },
  placeholder: {
    color: colors.lightgray,
    fontFamily: fonts.regular,
    marginTop: 30
  },
  heading: {
    fontFamily: fonts.regular,
    color: colors.defaultText,
    fontSize: 23,
    textAlign: "center",
    marginBottom: 15
  }
});

const CreativeModeOverview: React.SFC<Props> = ({ mainStore, navigation }) => {
  const { prompts } = mainStore;
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Text style={styles.heading}>Story Openings</Text>
      <View style={styles.innerContainer}>
        <PixelButton
          onPress={() => {
            mainStore.setCurrentPromptTitle("");
            mainStore.setCurrentPromptContext("");
            mainStore.setCurrentPromptUid(undefined);
            mainStore.setPromptButtonActivated(true);
            navigation.navigate("PromptModal");
          }}
          label={"Create"}
        />
        <ScrollView style={{ flex: 1 }}>
          {prompts && prompts.length > 0 ? (
            prompts.map(p => <PromptOverview key={Math.random()} {...p} />)
          ) : (
            <Text style={styles.placeholder}>
              Once you create your own custom stories, they will show up here
            </Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

CreativeModeOverview.propTypes = {
  mainStore: PropTypes.any,
  navigation: PropTypes.any
};

export default inject("mainStore")(
  withNavigation(observer(CreativeModeOverview))
);
