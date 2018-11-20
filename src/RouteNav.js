import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import {
  AssetAddList,
  AssetAddDetail,
  AssetList,
  Asset,
  AssetTx,
  Settings,
  PINInput,
  Splash,
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
