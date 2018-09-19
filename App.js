import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { AssetAddList, AssetList, Asset } from './src/screens';

const RouteNav = createStackNavigator(
  {
    AssetListScreen: {
      screen: AssetList,
    },
    AssetAddScreen: {
      screen: AssetAddList,
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
