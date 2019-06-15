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

export default class GetMoviesByGenre extends Component<{}> {

  // This section controls what's displayed on the top header bar. On this screen, we have an Add Button and a Refresh Button
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: "Movies",
      headerRight: (
        <View
          style={{
            paddingRight: 8,
            flexDirection: "row",
            justifyContent: "space-between",
            width: 75
          }}
        >
          {/* Add Movie Button */}
          <Icon
            name="add"
            size={25}
            color={"#ffffff"}
            onPress={() => params.toggleModal()}
          />
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
      isModalVisible: false,
      addMovieTitle: "",
      addMovieDescription: "",
      addMovieGenre: "",
      addMovieYear: "",
      addMovieRating: 0,
      addMovieLength: 0
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
    this.getMovies();
  }
  refresh = () => {
    this.getMovies();
  };
  //
  // Get Movies List
  //
  getMovies() {
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
  //
  // Add Movie to the list
  //
  addMovie() {
    let self = this;
    let url = `${Config.base}${Config.addMovie}`;
    let requestBody = {
      title: this.state.addMovieTitle,
      description: this.state.addMovieDescription,
      genre: this.state.addMovieGenre,
      year: this.state.addMovieYear,
      rating: this.state.addMovieRating,
      length: this.state.addMovieLength
    }
    axios.post(url, requestBody).then(function() {
      ToastAndroid.show("Movies Added! Refresh the list.", ToastAndroid.SHORT);
      self.setState({
        addMovieTitle: "",
        addMovieDescription: "",
        addMovieGenre: "",
        addMovieYear: "",
        addMovieRating: 0,
        addMovieLength: 0
      });
    });
    
    this._toggleModal();
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
              <Text style={{ fontSize: 20 }}>Add Movie</Text>
              <Icon
                name="close"
                size={25}
                onPress={() => this._toggleModal()}
              />
            </View>
            <View style={styles.addMovieModalBody}>
              <View style={{ flex: 1 }}>
                <Input
                  placeholder="Title"
                  editable={true}
                  onChangeText={text =>
                    this.setState({
                      addMovieTitle: text
                    })
                  }
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  multiline={true}
                  placeholder="Description"
                  editable={true}
                  onChangeText={text =>
                    this.setState({
                      addMovieDescription: text
                    })
                  }
                />
              </View>
              <View style={styles.addMovieModalSubContainer}>
                <View style={styles.subSubContainer}>
                  <Input
                    placeholder="Genre"
                    editable={true}
                    maxLength={10}
                    onChangeText={text =>
                      this.setState({
                        addMovieGenre: text
                      })
                    }
                  />
                </View>
                <View style={styles.subSubContainer}>
                  <Input
                    placeholder="Year"
                    editable={true}
                    maxLength={10}
                    onChangeText={text =>
                      this.setState({
                        addMovieYear: text
                      })
                    }
                  />
                </View>
              </View>
              <View style={styles.addMovieModalSubContainer}>
                <View style={styles.subSubContainer}>
                  <Input
                    placeholder="Length"
                    editable={true}
                    onChangeText={text =>
                      this.setState({
                        addMovieLength: parseInt(text)
                      })
                    }
                  />
                </View>
                <View style={styles.ratingContainer}>
                  <Text>Rating</Text>
                  <Slider
                    minimumValue={0}
                    maximumValue={5}
                    step={1}
                    thumbTintColor={"#343434"}
                    onValueChange={value =>
                      this.setState({
                        addMovieRating: parseInt(value)
                      })
                    }
                  />
                </View>
              </View>
              <View style={styles.addMovieModalOKButtonContainer}>
                <Button
                  type="clear"
                  title="Add Movie"
                  onPress={() => this.addMovie()}
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
