import React, { Component } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import ControlService from "../services/ControlService";
import { inject, observer } from "mobx-react";
import MainStore from "../mobx/mainStore";
import StorySmallComponent from "../components/StorySmall";
import { colors } from "../theme";
import { FlatList, ScrollView } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  }
});

class History extends Component<any, any> {
  static defaultProps = {};

  state = { id: Math.random() };

  render() {
    const mainStore: MainStore = this.props.mainStore;
    const { stories } = mainStore;
    const sortedStories = Object.values(stories || {}).sort((a, b) =>
      new Date(a.updatedAt) < new Date(b.updatedAt) ? 1 : -1
    );
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {sortedStories.map(item => (
            <StorySmallComponent key={item.uid} {...item} />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default inject("mainStore")(observer(History));
