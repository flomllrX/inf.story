import React from "react";
import Loading from "./screens/Loading";
import ErrorScreen from "./screens/Error";
import * as Font from "expo-font";
import { View, StyleSheet, Platform } from "react-native";
import { Linking } from "expo";
import { Provider, observer } from "mobx-react";
import MainStore from "./mobx/mainStore";
import ControlService from "./services/ControlService";
import MainScreen from "./container/Main";
import Histroy from "./screens/History";
import Story from "./screens/Story";
import MainStory from "./container/MainStory";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import NavigationService from "./services/NavigationService";
import { colors } from "./theme";

const MainNavigator = createStackNavigator(
  {
    Main: { screen: MainScreen, path: "" },
    History: { screen: Histroy, path: "history" },
    StoryModal: { screen: Story, path: "story/:storyId" },
    MainStoryModal: { screen: MainStory }
  },
  {
    mode: "modal",
    headerMode: "none"
  }
);

const AppContainer = createAppContainer(MainNavigator);

const mainStore = new MainStore();
ControlService.setMainStore(mainStore);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: 30
  },
  inner: {
    flex: 1,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center"
  }
});

const prefix = Linking.makeUrl("/");

const getPathAtIndex = index => {
  const path = window.location.pathname;
  return path.split("/")[index];
};

class App extends React.Component {
  state: {
    fontLoaded: boolean;
    activeStoryId: string | undefined;
  } = {
    fontLoaded: false,
    activeStoryId: undefined
  };

  async componentDidMount() {
    await Font.loadAsync({
      "SourceCodePro-Regular": require("./assets/fonts/SourceCodePro-Regular.ttf"),
      "SourceCodePro-SemiBold": require("./assets/fonts/SourceCodePro-SemiBold.ttf")
    });
    this.setState({ fontLoaded: true });
    this.doNavigation();
  }

  doNavigation = () => {
    console.log(getPathAtIndex(1));
    if (getPathAtIndex(1) === "story") {
      const storyId = getPathAtIndex(2);
      if (storyId) {
        NavigationService.navigate("StoryModal", { storyId });
      }
    }
  };

  render() {
    const { fontLoaded } = this.state;
    return (
      <Provider mainStore={mainStore}>
        <View style={styles.container}>
          <View style={styles.inner}>
            {fontLoaded ? (
              mainStore.error ? (
                <ErrorScreen />
              ) : (
                <AppContainer
                  uriPrefix={prefix}
                  ref={navigatorRef => {
                    NavigationService.setTopLevelNavigator(navigatorRef);
                  }}
                />
              )
            ) : (
              <Loading />
            )}
          </View>
        </View>
      </Provider>
    );
  }
}

export default observer(App);
