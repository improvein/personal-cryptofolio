import React from 'react';
import { createStackNavigator } from 'react-navigation';
import {
  AssetAddList,
  AssetAddDetail,
  AssetList,
  Asset,
  AssetTx,
  Settings,
  PINInput,
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
    PINInputScreen: {
      screen: PINInput,
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
