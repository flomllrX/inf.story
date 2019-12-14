import React from "react";
import { View, StyleSheet, Image } from "react-native";
import App from "next/app";
import ControlService from "../services/ControlService";
import { Provider, observer } from "mobx-react";
import dynamic from "next/dynamic";
import MainStore from "../mobx/mainStore";
import * as Font from "expo-font";
import { portraits, locations } from "../components/StoryBit";

const Loading = dynamic(() => import("../screens/Loading"), {
  ssr: false
});

const ErrorScreen = dynamic(() => import("../screens/Error"), {
  ssr: false
});

/** Initialize mainStore */
const mainStore = new MainStore();
ControlService.setMainStore(mainStore);

/** Prefetch images */
function cacheImages(images) {
  return images.map(image => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  }
});

class WebApp extends App {
  state = {};
  async componentDidMount() {
    const fontLoaders = Font.loadAsync({
      "SourceCodePro-Regular": require("../assets/fonts/SourceCodePro-Regular.ttf"),
      "SourceCodePro-SemiBold": require("../assets/fonts/SourceCodePro-SemiBold.ttf"),
      "SourceCodePro-Bold": require("../assets/fonts/SourceCodePro-Bold.ttf")
    });
    const p = Object.keys(portraits).map(k => portraits[k]);
    const l = Object.keys(locations)
      .map(k => locations[k])
      .reduce((prev, curr) => [...prev, ...curr], []);
    const imageLoaders = cacheImages([...p, ...l]);
    await Promise.all([...imageLoaders, fontLoaders]);

    this.setState({ fontLoaded: true });
  }

  render() {
    const { Component, pageProps } = this.props;
    const { fontLoaded } = this.state;

    return (
      <Provider mainStore={mainStore}>
        <View style={styles.container}>
          {fontLoaded ? (
            mainStore.error ? (
              <ErrorScreen />
            ) : (
              <Component {...pageProps} />
            )
          ) : (
            <Loading />
          )}
        </View>
      </Provider>
    );
  }
}

export default observer(WebApp);