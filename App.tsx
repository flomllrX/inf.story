import React from "react";
import Welcome from "./screens/Welcome";
import Story from "./screens/Story";
import Loading from "./screens/Loading";
import * as Font from "expo-font";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { View, StyleSheet } from "react-native";

const AppNavigator = createStackNavigator({
  Welcome: { screen: Welcome },
  Story: { screen: Story }
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
  } = {
    fontLoaded: false
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
      <View style={styles.container}>
        {fontLoaded ? <AppContainer /> : <Loading />}
      </View>
    );
  }
}
