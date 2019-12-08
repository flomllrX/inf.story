import React from "react";
import Loading from "./screens/Loading";
import * as Font from "expo-font";
import { View, StyleSheet } from "react-native";
import { Provider } from "mobx-react";
import MainStore from "./mobx/mainStore";
import ControlService from "./services/ControlService";
import Navigation from "./container/Navigation";

const mainStore = new MainStore();
ControlService.setMainStore(mainStore);

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
          {fontLoaded ? <Navigation /> : <Loading />}
        </View>
      </Provider>
    );
  }
}
