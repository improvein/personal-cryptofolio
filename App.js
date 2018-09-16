import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { AssetAddScreen, AssetListScreen, AssetScreen } from './src/asset';
import DataStorage from './src/data/DataStorage';

const RouteNav = createStackNavigator(
  {
    AssetListScreen: {
      screen: AssetListScreen,
    },
    AssetAddScreen: {
      screen: AssetAddScreen,
    },
    AssetScreen: {
      screen: AssetScreen,
    },
  },
  {
    initialRouteName: 'AssetListScreen',
  },
);

export default class App extends React.Component {
  componentDidMount() {
    // initialize storage
    DataStorage.initialize();
  }

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
