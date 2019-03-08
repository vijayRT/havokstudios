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
const axios = require('axios')
import Config from 'react-native-config'


export default class GetMovies extends Component<{}> {
  constructor() {
    super();
    console.log("Inside constructor")
    this.state = {
      movieData: [],
      showSpinner: true
    }
  }
  componentDidMount() {
    this.getMovies()
  }
  getMovies(){
    let self = this
    let url = `${Config.base}${Config.movies}`
    console.warn(url)
    axios.get(url).then(function(response) {
      console.log(response.status)
      self.setState({
        showSpinner: false,
        movieData: response.data
      })
      ToastAndroid.show('Movies List loaded!', ToastAndroid.SHORT);
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
        <FlatList
          contentContainerStyle={styles.movieList}
          data={this.state.movieData}
          renderItem={({item}) => 
          <ListItem
            divider
            centerElement={{
              primaryText: item.title,
              secondaryText: item.description,
            }}
            onPress={() => this.props.navigation.navigate('getMovieDetails', {
              movieId: item.id
            })}
          />
        }
          keyExtractor={item=>item.id.toString()}
        ></FlatList>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  movieList: {
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  listItem: {
    padding: 10
  }
});


