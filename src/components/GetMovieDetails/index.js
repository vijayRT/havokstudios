/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, Platform, ToastAndroid} from 'react-native';
import {ListItem, Toolbar} from 'react-native-material-ui'
import Spinner from 'react-native-loading-spinner-overlay';
import Config from 'react-native-config'
const axios = require('axios')




export default class GetMovies extends Component<{}> {
  constructor() {
    super();
    console.log("Inside constructor")
    this.state = {
      showSpinner: true,
      movieData: []
    }
    
  }

  componentDidMount() {
    this.getMovies()
  }
  getMovies(){
    let self = this
    const { navigation } = this.props;
    let url = `${Config.base}${Config.movieDetails}/${navigation.getParam('movieId')}`;
    axios.get(url).then(function(response) {
      console.log(response.status)
      self.setState({
        showSpinner: false,
        movieData: response.data
      })
      ToastAndroid.show('Movie Data loaded!', ToastAndroid.SHORT);
      console.log(response.data.length)
    })
    .catch(function(error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
      });
  }
  render() {
    return (
     
      <View style={styles.container}>
       <Spinner
          visible={this.state.showSpinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <Text style={styles.textStyle}>Title: {this.state.movieData.title}</Text>
        <Text style={styles.textStyle}>Description: {this.state.movieData.description}</Text>
        <Text style={styles.textStyle}>Genre: {this.state.movieData.genre}</Text>
        <Text style={styles.textStyle}>Year: {this.state.movieData.year}</Text>
        <Text style={styles.textStyle}>Rating: {this.state.movieData.rating}</Text>
        <Text style={styles.textStyle}>Length: {this.state.movieData.length}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  movieList: {
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  listItem: {
    padding: 10
  },
  textStyle: {
    fontSize: 25
  }
});


