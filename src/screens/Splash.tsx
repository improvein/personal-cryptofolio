import React from 'react';
import {Image, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../utils';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainStackParamList} from '../RouteNav';

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
  extends NativeStackScreenProps<MainStackParamList, 'SplashScreen'> {}

export default function Splash({}: SplashScreenProps) {
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
