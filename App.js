import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import AssetAddScreen from './src/asset/AssetAddScreen';
import AssetListScreen from './src/asset/AssetListScreen';

const RouteNav = createStackNavigator(
  {
    AssetListScreen: {
      screen: AssetListScreen,
    },
    AssetAddScreen: {
      screen: AssetAddScreen,
    },
  },
  {
    initialRouteName: 'AssetListScreen',
  },
);

export default class App extends React.Component {
  render() {
    return <RouteNav />;
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center"
//   }
// })
