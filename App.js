import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { AssetAdd, AssetList, Asset } from './src/screens';

const RouteNav = createStackNavigator(
  {
    AssetListScreen: {
      screen: AssetList,
    },
    AssetAddScreen: {
      screen: AssetAdd,
    },
    AssetScreen: {
      screen: Asset,
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
