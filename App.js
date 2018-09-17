import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { AssetAddScreen, AssetListScreen, AssetScreen } from './src/asset';

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
  render() {
    return <RouteNav />;
  }
}
