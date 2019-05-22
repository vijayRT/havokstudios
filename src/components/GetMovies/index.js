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
  StatusBar,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { Button, Input, Slider } from "react-native-elements";
import { ListItem } from "react-native-material-ui";
import Spinner from "react-native-loading-spinner-overlay";
import Icon from "react-native-vector-icons/MaterialIcons";
import Modal from "react-native-modal";
const axios = require("axios");
import Config from "react-native-config";
import { ScrollView } from "react-native-gesture-handler";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const blankMovie = {
  title: "",
  description: "",
  genre: "",
  year: "",
  rating: 0,
  length: 0
};
export default class GetMovies extends Component<{}> {
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
          <Icon
            name="add"
            size={25}
            color={"#ffffff"}
            onPress={() => params.toggleModal()}
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
      showSpinner: true,
      isModalVisible: false,
      addMovie: JSON.parse(JSON.stringify(blankMovie))
    };
  }
  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

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
  addMovie() {
    let self = this;
    let url = `${Config.base}${Config.addMovie}`;
    axios.post(url, this.state.addMovie).then
    console.warn(JSON.stringify(this.state.addMovie));
    this._toggleModal();
    this.setState({
      addMovie: JSON.parse(JSON.stringify(blankMovie))
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
        <ScrollView>
        <Modal
          isVisible={this.state.isModalVisible}
          style={styles.addMovieModal}
        >
          <View style={styles.addMovieModalContainer}>
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
                      addMovie: {
                        title: text
                      }
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
                      addMovie: {
                        description: text
                      }
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
                        addMovie: {
                          genre: text
                        }
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
                        addMovie: {
                          year: text
                        }
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
                        addMovie: {
                          length: parseInt(text)
                        }
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
                        addMovie: {
                          rating: parseInt(value)
                        }
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
          </View>
        </Modal>
        </ScrollView>
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
    margin: 20,
    height: HEIGHT - 55
  },
  addMovieModalContainer: {
    flex: 1,
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
