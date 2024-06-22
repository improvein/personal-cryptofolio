import React, {useEffect} from 'react';
import {Image, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../utils';
import DataStorage from '../data/DataStorage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../RouteNav';

const mainLogoImg = require('../assets/images/main_logo.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    alignSelf: 'center',
  },
});

interface SplashScreenProps
  extends NativeStackScreenProps<RootStackParamList, 'SplashScreen'> {}

export default function Splash({navigation}: SplashScreenProps) {
  useEffect(() => {
    loadSettings();
  });

  async function loadSettings() {
    const settings = await DataStorage.getSettings();
    global.pinProtection = settings.pinProtection || false;
    if (global.pinProtection) {
      // save the PIN hash
      global.pinHash = await DataStorage.getPINHash();
      // get the active PIN (if any)
      const activePin = global.activePin || null;
      // if there is no PIN or the PIN is not enabled
      if (activePin === null || !(await DataStorage.validatePIN(activePin))) {
        navigation.navigate('Auth', {
          screen: 'PINInputScreen',
          params: {authMode: true},
        });
        return;
      }
    }

    // no need for PIN, or PIN ok
    navigation.navigate('App', {screen: 'AssetListScreen', params: {}});
  }

  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={[colors.WHITE, colors.GRAY]}
      style={styles.container}>
      <Image style={styles.logo} source={mainLogoImg} />
    </LinearGradient>
  );
}
