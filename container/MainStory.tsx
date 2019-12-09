import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { inject, observer } from "mobx-react";
import CreateStory from "../screens/CreateStory";
import Story from "../screens/Story";

class MainStory extends Component<any, any> {
  render() {
    const { mainStore } = this.props;
    return mainStore.creatingStory ? <CreateStory /> : <Story />;
  }
}

export default inject("mainStore")(observer(MainStory));
