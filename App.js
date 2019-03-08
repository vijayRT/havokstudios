// In App.js in a new project

import React from "react";
import { View, Text, Button } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
import GetMovies from './src/components/GetMovies'
import GetMovieDetails from './src/components/GetMovieDetails'
class HomeScreen extends React.Component {
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
    navigationOptions: () => ({
      title: `Home`,
    })
  },
  getMovies: {
    screen: GetMovies,
    navigationOptions: () => ({
      title: `All Movies`,
    })  
  },
  getMovieDetails: {
    screen: GetMovieDetails,
    navigationOptions: () => ({
      title: `All Movies`,
    })  
  }
},
{
  initialRouteName: "Home"
});

export default createAppContainer(AppNavigator);