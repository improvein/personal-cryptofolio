import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  AssetAddListScreen,
  AssetAddDetail,
  AssetList,
  AssetScreen,
  AssetTx,
  DataImport,
  SettingsScreen,
  PINInput,
  Splash,
  Stats,
} from './screens';
import AssetScreenHeader from './components/AssetScreenHeader';
import {Asset, Coin, Transaction} from './types';
import AssetListScreenHeader from './components/AssetListScreenHeader';
import AssetTxScreenHeader from './components/AssetTxScreenHeader';
import {isPINAccessGranted} from './utils/security';

export type MainStackParamList = {
  SplashScreen: undefined;
  // App screens
  AssetListScreen: {
    refresh?: boolean;
    totalValuation?: number;
  };
  AssetAddListScreen: undefined;
  AssetAddDetailScreen: {
    coin: Coin;
  };
  AssetScreen: {
    refresh?: boolean;
    asset: Asset;
    currentPrice?: number;
    onRemoveAsset?: () => void;
  };
  AssetTxScreen: {
    asset: Asset;
    currentPrice: number;
    transaction?: Transaction;
    isNew?: boolean;
    onRemoveTransaction?: () => void;
  };
  SettingsScreen: undefined;
  DataImportScreen: undefined;
  StatsScreen: undefined;

  // Security
  PINInputScreen: {
    authMode?: boolean;
    enableBack?: boolean;
  };
};
const MainStack = createNativeStackNavigator<MainStackParamList>();

function AppNavigator() {
  const [isAccessGranted, setIsAccessGranted] = React.useState<boolean>(false);

  React.useEffect(() => {
    isPINAccessGranted().then(result => {
      setIsAccessGranted(result);
    });
  }, []);

  if (global.isCheckingAuth) {
    return <MainStack.Screen name="SplashScreen" component={Splash} />;
  }
  return (
    <MainStack.Navigator
      screenOptions={{
        headerBackButtonMenuEnabled: false,
        headerBackVisible: false,
        headerBackTitleVisible: false,
        headerLeft: undefined,
      }}>
      {isAccessGranted ? (
        <>
          <MainStack.Screen
            name="AssetListScreen"
            component={AssetList}
            options={({navigation, route}) => ({
              // eslint-disable-next-line react/no-unstable-nested-components
              header: () => (
                <AssetListScreenHeader navigation={navigation} route={route} />
              ),
            })}
          />
          <MainStack.Screen
            name="AssetAddListScreen"
            component={AssetAddListScreen}
            options={{
              title: 'Add Asset List',
            }}
          />
          <MainStack.Screen
            name="AssetAddDetailScreen"
            component={AssetAddDetail}
            options={{
              title: 'Add Asset Detail',
            }}
          />
          <MainStack.Screen
            name="AssetScreen"
            component={AssetScreen}
            options={({navigation, route}) => ({
              // eslint-disable-next-line react/no-unstable-nested-components
              header: () => (
                <AssetScreenHeader navigation={navigation} route={route} />
              ),
            })}
          />
          <MainStack.Screen
            name="AssetTxScreen"
            component={AssetTx}
            options={({navigation, route}) => ({
              // eslint-disable-next-line react/no-unstable-nested-components
              header: () => (
                <AssetTxScreenHeader navigation={navigation} route={route} />
              ),
            })}
          />
          <MainStack.Screen
            name="SettingsScreen"
            component={SettingsScreen}
            options={{
              title: 'Settings',
              headerShown: false,
            }}
          />
          <MainStack.Screen
            name="DataImportScreen"
            component={DataImport}
            options={{
              title: 'Data import',
            }}
          />
          <MainStack.Screen
            name="StatsScreen"
            component={Stats}
            options={{
              headerShown: false,
            }}
          />
        </>
      ) : (
        <MainStack.Screen
          name="PINInputScreen"
          component={PINInput}
          options={{title: 'Enter PIN'}}
          initialParams={{enableBack: false}}
        />
      )}
    </MainStack.Navigator>
  );
}

export default function RouteNavContainer() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
