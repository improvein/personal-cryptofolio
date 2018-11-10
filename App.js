import React from 'react';
import { createStackNavigator } from 'react-navigation';
import {
  AssetAddList, AssetAddDetail, AssetList, Asset, AssetTx, Settings
} from './src/screens';

const RouteNav = createStackNavigator(
  {
    AssetListScreen: {
      screen: AssetList,
    },
    AssetAddScreen: {
      screen: AssetAddList,
    },
    AssetAddDetailScreen: {
      screen: AssetAddDetail,
    },
    AssetScreen: {
      screen: Asset,
    },
    AssetTxScreen: {
      screen: AssetTx,
    },
    SettingsScreen: {
      screen: Settings,
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
