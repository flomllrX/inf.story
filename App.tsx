import React from "react";
import Loading from "./screens/Loading";
import ErrorScreen from "./screens/Error";
import * as Font from "expo-font";
import { View, StyleSheet, Image } from "react-native";
import { Asset } from "expo-asset";
import { Provider, observer } from "mobx-react";
import MainStore from "./mobx/mainStore";
import ControlService from "./services/ControlService";
import Navigation from "./container/Navigation";
import Story from "./screens/Story";
import MainStory from "./container/MainStory";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { portraits, locations } from "./components/StoryBit";

import codePush from "react-native-code-push";
const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME
};

const prefix = "infinitestory://";

/** Navigation */
const MainNavigator = createStackNavigator(
  {
    Navigation: { screen: Navigation, path: "" },
    StoryModal: { screen: Story, path: "story/:storyId" },
    MainStoryModal: { screen: MainStory }
  },
  {
    mode: "modal",
    headerMode: "none"
  }
);
const AppContainer = createAppContainer(MainNavigator);

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
    flex: 1
  }
});

class App extends React.Component {
  state: {
    fontLoaded: boolean;
    activeStoryId: string | undefined;
  } = {
    fontLoaded: false,
    activeStoryId: undefined
  };

  /** Fetch custom fonts */
  async componentDidMount() {
    const fontLoaders = Font.loadAsync({
      "SourceCodePro-Regular": require("./assets/fonts/SourceCodePro-Regular.ttf"),
      "SourceCodePro-SemiBold": require("./assets/fonts/SourceCodePro-SemiBold.ttf"),
      "SourceCodePro-Bold": require("./assets/fonts/SourceCodePro-Bold.ttf")
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
    const { fontLoaded } = this.state;
    return (
      <Provider mainStore={mainStore}>
        <View style={styles.container}>
          {fontLoaded ? (
            mainStore.error ? (
              <ErrorScreen />
            ) : (
              <AppContainer uriPrefix={prefix} />
            )
          ) : (
            <Loading />
          )}
        </View>
      </Provider>
    );
  }
}

//export default from './storybook';
export default codePush(codePushOptions)(observer(App));
