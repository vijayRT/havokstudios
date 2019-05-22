// In App.js in a new project

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  StatusBar
} from "react-native";
import { Button } from "react-native-elements";
import { createStackNavigator, createAppContainer } from "react-navigation";
// Import components
import GetMovies from "./src/components/GetMovies";
import GetMovieDetails from "./src/components/GetMovieDetails";

// Import assets
import bgImage from "./assets/mainscreenbg.jpg";
const { width: WIDTH } = Dimensions.get("window");
class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <ImageBackground source={bgImage} style={styles.topContainer}>
        <StatusBar backgroundColor="#F9FCFB" barStyle="dark-content" />
        <View style={styles.logoContainer}>
          <Text style={styles.logoFont}>Havok Studios</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <Button
            titleStyle={styles.buttonText}
            buttonStyle={styles.button}
            title="Director"
            type="outline"
            onPress={() => this.props.navigation.navigate("getMovies")} 
          />
          <Button
            titleStyle={styles.buttonText}
            buttonStyle={styles.button}
            title="Writer"
            type="outline"
            onPress={() => this.props.navigation.navigate("getMovies")}
          />
          <Button
            titleStyle={styles.buttonText}
            buttonStyle={styles.button}
            title="Actor"
            type="outline"
            onPress={() => this.props.navigation.navigate("getMovies")}
          />
        </View>
      </ImageBackground>
    );
  }
}

// The root of the application. Here you define all the Activities, give each one a name, so that you can just 
// mention the name of your target activity and you move to there. Each activity name is assigned the JS class
// of that Activity.


// To move from one activity to another you use the function this.props.navigation.navigate("targetActivityName")

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    getMovies: {
      screen: GetMovies
    },
    getMovieDetails: {
      screen: GetMovieDetails
    }
  },
  {
    initialRouteName: "Home",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#303135"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    }
  }
);

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center"
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  logoFont: {
    fontFamily: "Roboto",
    fontSize: 30,
    fontWeight: "bold"
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingTop: 50
  },
  button: {
    backgroundColor: "transparent",
    borderColor: 'rgb(52, 52, 52)',
    width: WIDTH - 55,
    borderRadius: 50,
    height: 50,
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
    elevation: 4
  },
  buttonText: {
    color: "white"
  }
});
export default createAppContainer(AppNavigator);
