import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ToastAndroid,
  StatusBar,
  Dimensions} from "react-native";
import { Button, Input, Slider } from "react-native-elements";
import { ListItem } from "react-native-material-ui";
import Spinner from "react-native-loading-spinner-overlay";
import Icon from "react-native-vector-icons/MaterialIcons";
import Modal from "react-native-modal";
const axios = require("axios");
import Config from "react-native-config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const { height: HEIGHT } = Dimensions.get("window");

export default class GetMoviesByRating extends Component<{}> {

  // This section controls what's displayed on the top header bar. On this screen, we have an Add Button and a Refresh Button
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: "Top 10 Movies",
      headerRight: (
        <View
          style={{
            paddingRight: 8,
            flexDirection: "row",
            justifyContent: "space-between",
            width: 75
          }}
        >
          {/* Refresh Movie List Button */}
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
      showSpinner: true,
    }; // this.state controls the data on an activity. When you modify the state using this.setState() function, the screen is refreshed with the updated values
  }
  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible }); // Self explanatory. When you press the + button on the header, it toggles a popup. This is the function that does it.

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({
      refresh: this.refresh,
      toggleModal: this._toggleModal
    });
    this.getMoviesTop10();
  }
  refresh = () => {
    this.getMoviesTop10();
  };
  //
  // Get Movies List
  //
  getMoviesTop10() {
    let self = this;
    let url = `${Config.base}${Config.movies}`; // axios is the library that is used for GET and POST operations. It's very simple.
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
        {/* To make the status bar white */}
        <StatusBar backgroundColor="#303135" barStyle="light-content" /> 
        <Spinner
          visible={this.state.showSpinner}
          textContent={"Loading..."}
          textStyle={styles.spinnerTextStyle}
        />
        {/* The list component. The data attribute defines the which JSON is used to load the data. */}
        <FlatList
          contentContainerStyle={styles.movieList}
          data={this.state.movieData.sort((a, b) =>{return b.rating - a.rating}).slice(0,10)}
          renderItem={({ item }) => (
            <ListItem
              divider
              centerElement={{
                primaryText: item.title + " (" + item.year + ")",
                secondaryText: "Rating: " + item.rating
              }}
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
  },
  addMovieModal: {
    backgroundColor: "white",
    margin: 20
  },
  addMovieModalContainer: {
    height: HEIGHT - 55,
    margin: 20
  },
  addMovieModalHeader: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  addMovieModalBody: {
    flex: 4,
    justifyContent: "space-between"
  },
  addMovieModalSubContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  subSubContainer: {
    flex: 1
  },
  ratingContainer: {
    flex: 1
  },
  addMovieModalOKButtonContainer: {
    flex: 1,
    alignItems: "flex-end"
  }
});
