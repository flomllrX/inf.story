import React from "react";
import Loading from "./screens/Loading";
import ErrorScreen from "./screens/Error";
import * as Font from "expo-font";
import { View, StyleSheet } from "react-native";
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
    flex: 1
  }
});

const prefix = Linking.makeUrl("/");

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
    console.log(window.location.href);
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

export default observer(App);
