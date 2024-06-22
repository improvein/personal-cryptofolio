import React from 'react';
import {Image, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../utils';
import DataStorage from '../data/DataStorage';

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

export default class Splash extends React.Component {
  // static navigationOptions = {
  //   title: null,
  //   header: null,
  // };
  constructor(props) {
    super(props);
    this.loadSettings();
  }

  loadSettings = async () => {
    const settings = await DataStorage.getSettings();
    global.pinProtection = settings.pinProtection || false;
    if (global.pinProtection) {
      // save the PIN hash
      global.pinHash = await DataStorage.getPINHash();
      // get the active PIN (if any)
      const activePin = global.activePin || null;
      // if there is no PIN or the PIN is not enabled
      if (
        activePin === null ||
        !(await DataStorage.validatePIN(this.state.pin))
      ) {
        this.props.navigation.navigate('PINInputScreen', {authMode: true});
        return;
      }
    }

    // no need for PIN, or PIN ok
    this.props.navigation.navigate('AssetListScreen');
  };

  render() {
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
}
