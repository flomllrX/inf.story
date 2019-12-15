import React from "react";
import { View, StyleSheet, Image } from "react-native";
import App from "next/app";
import ControlService from "../services/ControlService";
import { Provider, observer } from "mobx-react";
import dynamic from "next/dynamic";
import MainStore from "../mobx/mainStore";
import * as Font from "expo-font";
import ErrorService from "../services/ErrorService";

const Loading = dynamic(() => import("../screens/Loading"), {
  ssr: false
});

const ErrorScreen = dynamic(() => import("../screens/ErrorWeb"), {
  ssr: false
});

/** Initialize mainStore */
const mainStore = new MainStore();
ControlService.setMainStore(mainStore);
ErrorService.setMainStore(mainStore);

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
    await Font.loadAsync({
      "SourceCodePro-Regular": require("../assets/fonts/SourceCodePro-Regular.ttf"),
      "SourceCodePro-SemiBold": require("../assets/fonts/SourceCodePro-SemiBold.ttf"),
      "SourceCodePro-Bold": require("../assets/fonts/SourceCodePro-Bold.ttf")
    });

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
