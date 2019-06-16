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

export default class GetMoviesFromCurrentYear extends Component<{}> {

  // This section controls what's displayed on the top header bar. On this screen, we have an Add Button and a Refresh Button
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: "Current Year Movies",
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
          <Icon
            name="star"
            size={25}
            color={"#ffffff"}
            onPress={() => navigation.navigate("getMoviesByRating")}
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
      isModalVisible: false,
      editingMovieIndex: 0,
      sortingMode: "rating",
      editedRating: 0
    }; // this.state controls the data on an activity. When you modify the state using this.setState() function, the screen is refreshed with the updated values
  }
  openUpdateModal = (index) =>
    this.setState({ 
      isModalVisible: !this.state.isModalVisible,
      editingMovieIndex: this.state.movieData[index].id,
      editedRating: this.state.movieData[index].rating
    }); // Self explanatory. When you press the + button on the header, it toggles a popup. This is the function that does it.

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({
      refresh: this.refresh,
      changeSort: this.changeSort,
      toggleModal: this.openUpdateModal
    });
    this.getMoviesByGenre();
  }

  changeSort = () => {
    this.setState({
      sortingMode: (this.state.sortingMode === "rating") ? "length" : "rating"
    });
    this.getMoviesByGenre();
    ToastAndroid.show("Sorted by " + this.state.sortingMode)
  };

  refresh = () => {
    this.getMoviesByGenre();
  };
  //
  // Get Movies List
  //
  getMoviesByGenre() {
    let self = this;
    const { navigation } = this.props;
    let url = `${Config.base}${Config.movies}`; // axios is the library that is used for GET and POST operations. It's very simple.
    axios
      .get(url)
      .then(function(response) {
        let currentYearMovies = []
        response.data.forEach(function(movie) {
          if (movie.year === 2019) {
            currentYearMovies.push(movie)
          }
        })
        self.setState({
          showSpinner: false,
          movieData: currentYearMovies
          //movieData: (currentYearMovies.length > 1) ? _.sortBy(currentYearMovies, self.state.sortingMode) : currentYearMovies
        });
        ToastAndroid.show("Movies List loaded!", ToastAndroid.SHORT);
        console.log(response.data.length);
      })
      .catch(function(error) {
        console.log("There has been a problem with your fetch operation: " + error.message);
        ToastAndroid.show("There was an error with your request! " + error.message, ToastAndroid.SHORT);
        self.setState({
          showSpinner: false,
        })
      });
  }
  updateRating() {
    let self = this;
    let url = `${Config.base}${Config.updateRating}`;
    let requestBody = {
      id: this.state.editingMovieIndex,
      rating: this.state.editedRating,
    }
    axios.post(url, requestBody).then(function() {
      ToastAndroid.show("Rating Updated! Refresh the list.", ToastAndroid.SHORT);
      self.setState({
        editingMovieIndex: 0,
        editedRating: 0,
        isModalVisible: false
      });
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
          data={this.state.movieData.sort((a, b) =>{return b.rating - a.rating})}
          renderItem={({ item, index }) => (
            <ListItem
              divider
              centerElement={{
                primaryText: item.title + " (" + item.year.toString() + ")",
                secondaryText: "Rating: " + item.rating.toString()
              }}
              onPress={() => this.openUpdateModal(index)}
            />
          )}
          keyExtractor={item => item.id.toString()}
        />
        {/* Modal means popup. */}
        <Modal
          isVisible={this.state.isModalVisible}
          style={styles.addMovieModal}
        >
          {/* KeyboardAwareScrollView keeps the popup usable when the keyboard opens. If I use a normal View component, everything gets mashed up. */}
          <KeyboardAwareScrollView
            contentContainerStyle={styles.addMovieModalContainer}
          >
            <View style={styles.addMovieModalHeader}>
              <Text style={{ fontSize: 20 }}>Update Rating</Text>
              <Icon
                name="close"
                size={25}
                onPress={() => this.setState({
                  isModalVisible: false,
                })}
              />
            </View>
            <View style={styles.addMovieModalBody}>
            <View style={styles.ratingContainer}>
                  <Text>Rating</Text>
                  <Slider
                    value={this.state.editedRating}
                    minimumValue={0}
                    maximumValue={5}
                    step={1}
                    thumbTintColor={"#343434"}
                    onValueChange={value =>
                      this.setState({
                        editedRating: parseInt(value)
                      })
                    }
                  />
                </View>
              <View style={styles.addMovieModalOKButtonContainer}>
                <Button
                  type="clear"
                  title="Update Rating"
                  onPress={() => this.updateRating(this.state.editingMovieIndex)}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        </Modal>
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
    height: 200,
    margin: 20
  },
  addMovieModalContainer: {
    flex: 1,
    margin: 20,
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
