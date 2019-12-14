import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Swiper from "react-native-swiper";
import MainScreen from "./Main";
import History from "../screens/History";
import ControlService from "../services/ControlService";
import { inject, observer } from "mobx-react";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  left: {
    backgroundColor: "green"
  },
  right: {
    backgroundColor: "yellow"
  },
  center: {
    backgroundColor: "blue"
  },
  viewStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

class Navigation extends Component<any, any> {
  render() {
    const { mainStore } = this.props;
    return (
      <Swiper
        loop={false}
        showsPagination={false}
        index={1}
        onIndexChanged={() =>
          mainStore.stories || true || ControlService.loadStories()
        }
      >
        <History />
        <MainScreen />
        {/*
        <View style={[styles.viewStyle, styles.right]}>
          <Text>Community (coming soon)</Text>
        </View>
        */}
      </Swiper>
    );
  }
}
export default inject("mainStore")(observer(Navigation));
