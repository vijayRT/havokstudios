// In App.js in a new project

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, StatusBar } from "react-native";
import {Button} from "react-native-elements"
import { createStackNavigator, createAppContainer } from "react-navigation";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import EntypoIcon from "react-native-vector-icons/Entypo";
// Import components
import GetMovies from "./src/components/GetMovies";
import GetMovieDetails from "./src/components/GetMovieDetails";
import DirectorScreen from "./src/components/DirectorScreen"

// Import assets
import bgImage from "./assets/mainscreenbg.jpg"
const {width: WIDTH} = Dimensions.get("window")
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
          <Button titleStyle={styles.buttonText} buttonStyle={styles.button} title="Director" type="outline" onPress={() => this.props.navigation.navigate("getMovies")}/>
          <Button titleStyle={styles.buttonText} buttonStyle={styles.button} title="Writer" type="outline" onPress={() => this.props.navigation.navigate("directorScreen")}/>
          <Button titleStyle={styles.buttonText} buttonStyle={styles.button} title="Actor" type="outline" onPress={() => this.props.navigation.navigate("directorScreen")}/>
          </View>
      </ImageBackground>
    );
  } 
}
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
    },
    directorScreen: {
      screen: DirectorScreen
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
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoFont: {
    fontFamily: 'Roboto',
    fontSize: 30,
    fontWeight: 'bold'
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingTop: 50
  },
  button: {
    backgroundColor: 'transparent',
    borderColor: 'white',
    width: WIDTH - 55,
    borderRadius: 50
  },
  buttonText: {
    color: 'white'
  }
});
export default createAppContainer(AppNavigator);
