import React, { Component } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import ControlService from "../services/ControlService";
import { inject, observer } from "mobx-react";
import MainStore from "../mobx/mainStore";
import StorySmallComponent from "../components/StorySmall";
import { colors } from "../theme";
import { FlatList } from "react-native-gesture-handler";
import { StorySmall } from "../types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  }
});

class History extends Component<any, any> {
  static defaultProps = {};

  componentDidMount = () => {
    ControlService.loadStories();
  };

  render() {
    const mainStore: MainStore = this.props.mainStore;
    const stories = mainStore.stories;
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
