// In App.js in a new project

import React from "react";
import { View, Text, Button } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
import GetMovies from './src/components/GetMovies'
import GetMovieDetails from './src/components/GetMovieDetails'
class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Home Screen</Text>
        <Button
          title="Go to getMovies"
          onPress={() => this.props.navigation.navigate('getMovies')}
        />
      </View>
    );
  }
}
const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
  getMovies: {
    screen: GetMovies,
  },
  getMovieDetails: {
    screen: GetMovieDetails,
  }
},
{
  initialRouteName: "Home",
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: "#2196F3"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  }
});

export default createAppContainer(AppNavigator);