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
      editingMovieIndex: 0,
      editDescription: ''
    }; // this.state controls the data on an activity. When you modify the state using this.setState() function, the screen is refreshed with the updated values
  }
  openUpdateModal = (index) =>
    this.setState({ 
      isModalVisible: !this.state.isModalVisible,
      editingMovieIndex: this.state.movieData[index].id,
      editDescription: this.state.movieData[index].description
    }); // Self explanatory. When you press the + button on the header, it toggles a popup. This is the function that does it.

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({
      refresh: this.refresh,
      toggleModal: this.openUpdateModal
    });
    this.getMoviesByGenre();
  }
  refresh = () => {
    this.getMoviesByGenre();
  };
  //
  // Get Movies List
  //
  getMoviesByGenre() {
    let self = this;
    const { navigation } = this.props; 
    let url = `${Config.base}${Config.moviesByGenre}/${navigation.getParam("genre")}`; // axios is the library that is used for GET and POST operations. It's very simple.
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
  updateDescription() {
    let self = this;
    let url = `${Config.base}${Config.updateDescription}`;
    let requestBody = {
      id: this.state.editingMovieIndex,
      description: this.state.editDescription,
    }
    axios.post(url, requestBody).then(function() {
      ToastAndroid.show("Description Updated! Refresh the list.", ToastAndroid.SHORT);
      self.setState({
        editingMovieIndex: 0,
        editDescription: "",
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
          data={this.state.movieData.sort((a, b) =>{return b.year - a.year})}
          renderItem={({ item, index }) => (
            <ListItem
              divider
              centerElement={{
                primaryText: item.title,
                secondaryText: item.year.toString()
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
              <Text style={{ fontSize: 20 }}>Update Description</Text>
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
                  multiline={true}
                  placeholder="Description"
                  value={this.state.editDescription}
                  editable={true}
                  onChangeText={text =>
                    this.setState({
                      editDescription: text
                    })
                  }
                />
              </View>
              <View style={styles.addMovieModalOKButtonContainer}>
                <Button
                  type="clear"
                  title="Update Description"
                  onPress={() => this.updateDescription(this.state.editingMovieIndex)}
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
