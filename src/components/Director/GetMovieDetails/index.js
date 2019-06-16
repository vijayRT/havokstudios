/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from "react";
import { StyleSheet, Text, View, ToastAndroid, StatusBar, Dimensions } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import Config from "react-native-config";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons"
import Modal from "react-native-modal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Input, Slider } from "react-native-elements";
const axios = require("axios");
const { height: HEIGHT } = Dimensions.get("window");
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
        <View
          style={{
            paddingRight: 8,
            flexDirection: "row",
            justifyContent: "space-between",
            width: 75
          }}
        >
          <MaterialCommunityIcon
            name="pencil"
            size={25}
            color={"#ffffff"}
            onPress={() => params.updateMovie()}
          />
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
  openUpdateModal = () =>
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      editingMovieIndex: this.state.movieData.id,
      editMovieTitle: this.state.movieData.title,
      editMovieDescription: this.state.movieData.description,
      editMovieGenre: this.state.movieData.genre,
      editMovieYear: this.state.movieData.year,
      editMovieRating: this.state.movieData.rating,
      editMovieLength: this.state.movieData.length
    })
  

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({
      updateMovie: this.openUpdateModal,
      deleteMovie: this.deleteMovie
    });
    this.getMovieDetails();
  }

  updateMovie(){
    let self = this;
    let url = `${Config.base}${Config.update}`;
    let requestBody = {
      id: this.state.editingMovieIndex,
      title: this.state.editMovieTitle,
      description: this.state.editMovieDescription,
      genre: this.state.editMovieGenre,
      year: this.state.editMovieYear,
      rating: this.state.editMovieRating,
      length: this.state.editMovieLength
    }
    axios.post(url, requestBody).then(function() {
      ToastAndroid.show("Description Updated! Refresh the list.", ToastAndroid.SHORT);
      self.setState({
        editingMovieIndex: 0,
        editMovieTitle: "",
        editMovieDescription: "",
        editMovieGenre: "",
        editMovieYear: 0,
        editMovieRating: 0,
        editMovieLength: 0,
        isModalVisible: false
      });
    });
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
              <Text style={{ fontSize: 20 }}>Edit Movie</Text>
              <Icon
                name="close"
                size={25}
                onPress={() => this.setState({
                  isModalVisible: false
                })}
              />
            </View>
            <View style={styles.addMovieModalBody}>
              <View style={{ flex: 1 }}>
                <Input
                  placeholder="Title"
                  value={this.state.editMovieTitle}
                  editable={true}
                  onChangeText={text =>
                    this.setState({
                      editMovieTitle: text
                    })
                  }
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  multiline={true}
                  placeholder="Description"
                  value={this.state.editMovieDescription}
                  editable={true}
                  onChangeText={text =>
                    this.setState({
                      editMovieDescription: text
                    })
                  }
                />
              </View>
              <View style={styles.addMovieModalSubContainer}>
                <View style={styles.subSubContainer}>
                  <Input
                    placeholder="Genre"
                    value={this.state.editMovieGenre}
                    editable={true}
                    maxLength={10}
                    onChangeText={text =>
                      this.setState({
                        editMovieGenre: text
                      })
                    }
                  />
                </View>
                <View style={styles.subSubContainer}>
                  <Input
                    placeholder="Year"
                    value={this.state.editMovieYear}
                    editable={true}
                    maxLength={10}
                    onChangeText={text =>
                      this.setState({
                        editMovieYear: parseInt(text)
                      })
                    }
                  />
                </View>
              </View>
              <View style={styles.addMovieModalSubContainer}>
                <View style={styles.subSubContainer}>
                  <Input
                    placeholder="Length"
                    value={this.state.editMovieLength}
                    editable={true}
                    onChangeText={text =>
                      this.setState({
                        editMovieLength: parseInt(text)
                      })
                    }
                  />
                </View>
                <View style={styles.ratingContainer}>
                  <Text>Rating</Text>
                  <Slider
                    value={this.state.editMovieRating}
                    minimumValue={0}
                    maximumValue={5}
                    step={1}
                    thumbTintColor={"#343434"}
                    onValueChange={value =>
                      this.setState({
                        editMovieRating: parseInt(value)
                      })
                    }
                  />
                </View>
              </View>
              <View style={styles.addMovieModalOKButtonContainer}>
                <Button
                  type="clear"
                  title="Update Movie"
                  onPress={() => this.updateMovie(this.state.editingMovieIndex)}
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
