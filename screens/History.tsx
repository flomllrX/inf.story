import React, { Component } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import ControlService from "../services/ControlService";
import { inject, observer } from "mobx-react";
import MainStore from "../mobx/mainStore";
import StorySmallComponent from "../components/StorySmall";
import { colors } from "../theme";
import { FlatList } from "react-native-gesture-handler";
import { StorySmall /* only for dev*/, Origin } from "../types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  }
});

class History extends Component<any, any> {
  static defaultProps = {};

  // load list of past stories
  componentDidMount = () => {
    ControlService.loadStories();
  };

  render() {
    // TODO: integrate real data flow
    //const mainStore: MainStore = this.props.mainStore;
    // const stories = mainStore.stories;
    const origin: Origin = {
      name: "Victor",
      class: "noble",
      location: "location"
    };
    const stories: StorySmall[] = [
      {
        title: "Test story 1",
        createdAt: "December 19, 1995 03:24:00",
        origin,
        uid: "uid1"
      },
      {
        title: "Test story 2",
        createdAt: "1995-12-17T03:24:00",
        origin,
        uid: "uid2"
      }
    ];
    console.log("Stories", stories);
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={stories}
          renderItem={({ item }) => <StorySmallComponent {...item} />}
          keyExtractor={() => "" + Math.random()}
        />
      </SafeAreaView>
    );
  }
}

export default inject("mainStore")(observer(History));
