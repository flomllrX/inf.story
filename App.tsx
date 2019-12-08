import React from "react";
import Welcome from "./screens/Welcome";
import Story from "./screens/Story";
import Loading from "./screens/Loading";
import LoadingStory from "./screens/LoadingStory";
import ErrorScreen from "./screens/Error";
import * as Font from "expo-font";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { View, StyleSheet } from "react-native";
import { Provider } from "mobx-react";
import MainStore from "./mobx/mainStore";
import NavigationService from "./services/NavigationService";
import ApiService from "./services/ApiService";

const mainStore = new MainStore();
ApiService.setMainStore(mainStore);

const AppNavigator = createStackNavigator({
  Welcome: { screen: Welcome },
  LoadingStory: { screen: LoadingStory },
  Story: { screen: Story },
  Error: { screen: ErrorScreen }
});

const AppContainer = createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default class App extends React.Component {
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
  }

  render() {
    const { fontLoaded } = this.state;
    return (
      <Provider mainStore={mainStore}>
        <View style={styles.container}>
          {fontLoaded ? (
            <AppContainer
              ref={navigatorRef => {
                NavigationService.setTopLevelNavigator(navigatorRef);
                mainStore.setNavigatorAvailable();
              }}
            />
          ) : (
            <Loading />
          )}
        </View>
      </Provider>
    );
  }
}
