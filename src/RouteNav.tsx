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
  Settings,
  PINInput,
  Splash,
  Stats,
} from './screens';
import AssetScreenHeader from './components/AssetScreenHeader';
import {Asset, Coin, Transaction} from './types';
import AssetListScreenHeader from './components/AssetListScreenHeader';

export type MainStackParamList = {
  AssetListScreen: {
    refresh: boolean;
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
    transaction?: Transaction;
    currentPrice: number;
  };
  SettingsScreen: undefined;
  DataImportScreen: undefined;
  StatsScreen: undefined;
};
const MainStack = createNativeStackNavigator<MainStackParamList>();

function MainNav() {
  return (
    <MainStack.Navigator /*initialRouteName="AssetListScreen" */>
      <MainStack.Screen
        name="AssetListScreen"
        component={AssetList}
        options={({navigation, route}) => ({
          // eslint-disable-next-line react/no-unstable-nested-components
          headerTitle: props => (
            <AssetListScreenHeader
              navigation={navigation}
              route={route}
              {...props}
            />
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
          headerTitle: props => (
            <AssetScreenHeader
              navigation={navigation}
              route={route}
              {...props}
            />
          ),
        })}
      />
      <MainStack.Screen name="AssetTxScreen" component={AssetTx} />
      <MainStack.Screen name="SettingsScreen" component={Settings} />
      <MainStack.Screen
        name="DataImportScreen"
        component={DataImport}
        options={{
          title: 'Data import',
        }}
      />
      <MainStack.Screen name="StatsScreen" component={Stats} />
    </MainStack.Navigator>
  );
}

type AuthStackParamList = {
  PINInputScreen: undefined;
};
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
function AuthNav() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="PINInputScreen" component={PINInput} />
    </AuthStack.Navigator>
  );
}

type RootStackParamList = {
  SplashScreen: undefined;
  App: undefined;
  Auth: undefined;
};
const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RouteNav() {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="SplashScreen">
        <RootStack.Screen name="SplashScreen" component={Splash} />
        <RootStack.Screen name="App" component={MainNav} />
        <RootStack.Screen name="Auth" component={AuthNav} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
