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
var _ = require('lodash')
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const { height: HEIGHT } = Dimensions.get("window");

export default class GetGenres extends Component<{}> {

  // This section controls what's displayed on the top header bar. On this screen, we have an Add Button and a Refresh Button
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: "Genres",
      headerRight: (
        <View
          style={{
            paddingRight: 8,
            flexDirection: "row",
            justifyContent: "space-between",
            width: 75
          }}
        >          
          {/* Refresh Genre List Button */}
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
      genreData: [],
      showSpinner: true,
      isModalVisible: false,
      isGenreListLoaded: false,
      
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
    this.getGenres();
  }
  refresh = () => {
    this.getGenres();
  };
  //
  // Get Genres List
  //
  getGenres() {
    let self = this;
    let url = `${Config.base}${Config.genres}`; // axios is the library that is used for GET and POST operations. It's very simple.
    axios
      .get(url)
      .then(function(response) {
       console.log(response.status);
        self.setState({
          showSpinner: false,
          genreData: response.data,
          isGenreListLoaded: true
        });
        this.setGenreList(response.data)
        ToastAndroid.show("Movies List loaded!", ToastAndroid.SHORT);
        console.log(response.data.length);
      })
      .catch(function(error) {
        if (!self.state.isGenreListLoaded){
          ToastAndroid.show("There was an error with your request!", ToastAndroid.SHORT);
          self.setState({
            showSpinner: false,
          });
        }
        else {
          this.getGenreList();
        }
      });
  }  
  setGenreList = async (data) => {
    try {
      await AsyncStorage.setItem('genreList', JSON.stringify(data));
      ToastAndroid.show("Movies List Loaded and Saved!", ToastAndroid.SHORT);
    } catch(e) {
      console.log(e);
      ToastAndroid.show("Couldn't save Movie List!", ToastAndroid.SHORT);
    }
  
    console.log('Done.')
  }

  getGenreList = async () => {
    try {
      const mainList = await AsyncStorage.getItem('genreList');
      console.log(mainList);
      const parsedList = JSON.parse(mainList);
      if(parsedList !== null) {
        this.setState({
          movieData: parsedList
        })
        ToastAndroid.show("Movie list loaded offline!", ToastAndroid.SHORT);
      }
    } catch(e) {
      ToastAndroid.show("Couldn't retrieve saved list!", ToastAndroid.SHORT);
    }
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
          contentContainerStyle={styles.genreList}
          data={this.state.genreData}
          renderItem={({ item }) => (
            <ListItem
              divider
              centerElement={{
                primaryText: _.startCase(item)
              }}
              onPress={() =>
                this.props.navigation.navigate("getMoviesByGenre", {
                  genre: item.toString()
                })
              }
            />
          )}
          keyExtractor={item => item.toString()}
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
  genreList: {
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