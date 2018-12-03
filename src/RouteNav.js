import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
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

// export default RouteNav;
export default createSwitchNavigator(
  {
    SplashScreen: Splash,
    App: RouteNav,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'SplashScreen',
  },
);
