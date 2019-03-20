/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  StatusBar
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import Config from "react-native-config";
import Icon from "react-native-vector-icons/MaterialIcons";
const axios = require("axios");

export default class GetMovies extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: "Movie Details",
      headerStyle: {
        backgroundColor: "#303135",
        elevation: 0
      },
      headerRight: (
        <View style={{ paddingRight: 8 }}>
          <Icon
            name="delete"
            size={25}
            color={"#ffffff"}
            onPress={() => params.deleteMovie()}
          />
        </View>
      )
    };
  };
  constructor() {
    super();
    console.log("Inside constructor");
    this.state = {
      showSpinner: true,
      movieData: []
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({
      deleteMovie: this.deleteMovie
    });
    this.getMovieDetails();
  }

  deleteMovie = () => {
    let self = this;
    self.setState({
      showSpinner: true
    });
    const { navigation } = this.props;
    let movieId = navigation.getParam("movieId");
    let deleteMovieUrl = `${Config.base}${Config.deleteMovie}/${movieId}`;
    axios
      .delete(deleteMovieUrl)
      .then(function(response) {
        self.setState({
          showSpinner: false
        });
        ToastAndroid.show("Deleted Movie from list!", ToastAndroid.SHORT);
        navigation.goBack();
      })
      .catch(function(error) {
        self.setState({
          showSpinner: false
        });
        console.warn(error.message);
        ToastAndroid.show(
          "There was a problem deleting the movie",
          ToastAndroid.SHORT
        );
      });
  };
  getMovieDetails() {
    let self = this;
    const { navigation } = this.props;
    let getMovieDetailsUrl = `${Config.base}${
      Config.movieDetails
    }/${navigation.getParam("movieId")}`;
    axios
      .get(getMovieDetailsUrl)
      .then(function(response) {
        console.log(response.status);
        self.setState({
          showSpinner: false,
          movieData: response.data
        });
        ToastAndroid.show("Movie Data loaded!", ToastAndroid.SHORT);
        console.log(response.data.length);
      })
      .catch(function(error) {
        console.log(
          "There has been a problem with your fetch operation: " + error.message
        );
      });
  }
  render() {
    return (
      <View style={styles.container}>
      <StatusBar backgroundColor="#303135" barStyle="light-content" />
        <Spinner
          visible={this.state.showSpinner}
          textContent={"Loading..."}
          textStyle={styles.spinnerTextStyle}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.titleStyle}>{this.state.movieData.title}</Text>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.textStyle}>
            {this.state.movieData.description}
          </Text>
        </View>
        <View style={styles.yearGenreContainer}>
          <View style={styles.genreContainer}>
            <Text style={styles.boldStyle}>Genre</Text>
            <Text>{this.state.movieData.genre}</Text>
          </View>
          <View style={styles.yearContainer}>
            <Text style={styles.boldStyle}>Year</Text>
            <Text>{this.state.movieData.year}</Text>
          </View>
        </View>
        <View style={styles.ratingLengthContainer}>
          <View style={styles.ratingContainer}>
            <Text style={styles.boldStyle}>Rating</Text>
            <Text>{this.state.movieData.rating}</Text>
          </View>
          <View style={styles.lengthContainer}>
            <Text style={styles.boldStyle}>Length</Text>
            <Text>{this.state.movieData.length}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  titleContainer: {
    flex: 3,
    backgroundColor: "#303135",
    justifyContent: "center"
  },
  titleStyle: {
    fontSize: 30,
    color: "#ffffff",
    fontFamily: "Roboto",
    fontWeight: "bold",
    padding: 20
  },
  descriptionContainer: {
    padding: 20,
    flex: 1
  },
  yearGenreContainer: {
    padding: 20,
    flexDirection: "row"
  },
  yearContainer: {
    flex: 1
  },
  genreContainer: {
    flex: 1
  },
  ratingLengthContainer: {
    padding: 20,
    flexDirection: "row",
    flex: 1
  },
  ratingContainer: {
    flex: 1
  },
  lengthContainer: {
    flex: 1
  },
  boldStyle: {
    fontWeight: "bold"
  }
});
