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
  FlatList,
  Platform,
  ToastAndroid,
  StatusBar
} from "react-native";
import { ListItem } from "react-native-material-ui";
import Spinner from "react-native-loading-spinner-overlay";
import Icon from "react-native-vector-icons/MaterialIcons";
const axios = require("axios");
import Config from "react-native-config";

export default class GetMovies extends Component<{}> {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: "Movies",
      headerRight: (
        <View style={{ paddingRight: 8, flexDirection: "row", justifyContent: "space-between", width: 75 }}>
          <Icon
            name="add"
            size={25}
            color={"#ffffff"}
            onPress={() => params.refresh()}
          />
          <Icon
            name="refresh"
            size={25}
            color={"#ffffff"}
            onPress={() => params.refresh()}
          />
        </View>
      )
    };
  };
  constructor() {
    super();
    console.log("Inside constructor");
    this.state = {
      movieData: [],
      showSpinner: true
    };
  }
  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({
      refresh: this.refresh
    });
    this.getMovies();
  }
  refresh = () => {
    this.getMovies();
  };
  getMovies() {
    let self = this;
    let url = `${Config.base}${Config.movies}`;
    console.warn(url);
    axios
      .get(url)
      .then(function(response) {
        console.log(response.status);
        self.setState({
          showSpinner: false,
          movieData: response.data
        });
        ToastAndroid.show("Movies List loaded!", ToastAndroid.SHORT);
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
        <FlatList
          contentContainerStyle={styles.movieList}
          data={this.state.movieData}
          renderItem={({ item }) => (
            <ListItem
              divider
              centerElement={{
                primaryText: item.title,
                secondaryText: item.description
              }}
              onPress={() =>
                this.props.navigation.navigate("getMovieDetails", {
                  movieId: item.id
                })
              }
            />
          )}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: "#F5FCFF"
  },
  movieList: {
    justifyContent: "center",
    alignItems: "stretch"
  },
  listItem: {
    padding: 10
  }
});
