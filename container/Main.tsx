import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Welcome from "../screens/Welcome";
import Story from "../screens/Story";
import { inject, observer } from "mobx-react";
import Loading from "../screens/LoadingStory";
import Error from "../screens/Error";
import CreateStory from "../screens/CreateStory";

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

class Main extends Component<any, any> {
  static defaultProps = {};
  render() {
    const mainStore = this.props.mainStore;
    if(mainStore.creatingStory){
      return(
        <CreateStory/>
      )
    }
    return mainStore.storyActive ? (
      mainStore.loadingStory ? (
        <Loading />
      ) : mainStore.error ? (
        <Error />
      ) : (
        <Story />
      )
    ) : (
      <Welcome />
    );
  }
}

export default inject("mainStore")(observer(Main));
