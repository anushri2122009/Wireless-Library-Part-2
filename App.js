import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BookT_Screen from './screens/BookT_Screen';
import SearchScreen from './screens/SearchScreen';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';

export default class App extends React.Component{
  render(){
    return(
      <AppContainer/>
    )
  }
}

const TabNavigator = createBottomTabNavigator({
  Transaction:{screen:BookT_Screen},
  Search:{screen:SearchScreen}
})

const AppContainer = createAppContainer(TabNavigator);
