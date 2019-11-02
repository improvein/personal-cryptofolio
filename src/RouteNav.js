import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {
  AssetAddList,
  AssetAddDetail,
  AssetList,
  Asset,
  AssetTx,
  DataImport,
  Settings,
  PINInput,
  Splash,
  Stats,
} from './screens';

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
    DataImportScreen: {
      screen: DataImport,
    },
    StatsScreen: {
      screen: Stats,
    },
  },
  // {
  //   initialRouteName: 'AssetListScreen',
  // },
);
const AuthStack = createStackNavigator({
  PINInputScreen: {
    screen: PINInput,
  },
});

const MainNavigator = createSwitchNavigator(
  {
    SplashScreen: Splash,
    App: RouteNav,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'SplashScreen',
  },
);

const AppNavContainer = createAppContainer(MainNavigator);

export default AppNavContainer;
