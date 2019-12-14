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
  swiper;
  slideLeft = () => {
    this.swiper && this.swiper.scrollBy(-1);
  };
  slideRight = () => {
    this.swiper && this.swiper.scrollBy(1);
  };
  render() {
    const { mainStore } = this.props;
    return (
      <Swiper
        ref={swiper => (this.swiper = swiper)}
        loop={false}
        showsPagination={false}
        index={0}
        onIndexChanged={s => {
          mainStore.stories || ControlService.loadStories();
          console.log(s);
        }}
      >
        <History slideRight={() => this.slideRight()} />
        <MainScreen slideLeft={() => this.slideLeft()} />
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
