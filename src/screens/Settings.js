import React from 'react';
import {
  Alert, Share, StyleSheet, Switch, Text, TouchableOpacity, View,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';
import DataStorage from '../data/DataStorage';
import { colors } from '../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    width: '95%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 25,
    color: colors.BLACK,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
  },
  backArrowContainer: {
    position: 'absolute',
    top: 20,
  },
  contentContainer: {
    flex: 1,
  },
  optionContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderBottomColor: colors.BLACK,
    borderBottomWidth: 1,
  },
  optionText: {
    textAlign: 'left',
    alignSelf: 'flex-start',
    fontSize: 20,
  },
  optionButton: {
    alignSelf: 'flex-end',
  },
  textContainer: {
    flexDirection: 'column',
  },
  text: {
    fontSize: 12,
  },
});

export default class Settings extends React.Component {
  static navigationOptions = {
    title: 'Settings',
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  async componentDidMount() {
    const settings = await DataStorage.getSettings();
    // add the settings to the state
    this.setState(prevState => ({
      ...prevState,
      ...settings,
    }));
  }

  updateSettings = async (newSettings) => {
    try {
      // save them
      await DataStorage.updateSettings(newSettings);
      // update state
      this.setState(newSettings);
    } catch (err) {
      console.warn('Error saving settings.', err);
    }
  };

  onPinProtection = () => {
    this.props.navigation.navigate('PINInputScreen', {
      enableBack: true,
      returnScreen: 'SettingsScreen',
    });
  };

  onPinProtectionSwitch = async (value) => {
    if (value) {
      // activate
      // call the standard procedure
      this.onPinProtection();
    } else {
      // de-activate
      await this.updateSettings({ pinProtection: false });
      global.pinProtection = false;
    }
  };

  importData = async () => {
    this.props.navigation.navigate('DataImportScreen');
  };

  exportData = async () => {
    const rawDataJson = await DataStorage.getRawData();
    Share.share({
      message: rawDataJson,
    });
  };

  clearData = () => {
    Alert.alert(
      'Clear data',
      'Are you sure you want to clear ALL data from your portfolio?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            await DataStorage.clearData();
          },
        },
      ],
      { cancelable: false },
    );
  };

  onDidFocus = async (payload) => {
    // check if came with params
    if (typeof payload.state.params !== 'undefined') {
      // check if came from PIN screen
      if (typeof payload.state.params.pin !== 'undefined') {
        // save the PIN protection
        await this.updateSettings({ pinProtection: true });
        // set the PIN to the app and update global
        await DataStorage.updatePIN(payload.state.params.pin);
        global.pinProtection = true;
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={this.onDidFocus} />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backArrowContainer}
            onPress={() => this.props.navigation.goBack()}
          >
            <Icon name="arrow-left" size={30} color={colors.BLACK} />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
        </View>
        <View style={styles.contentContainer}>
          <TouchableOpacity style={styles.optionContainer} onPress={this.onPinProtection}>
            <Text style={styles.optionText}>PIN protection</Text>
            <Switch
              style={styles.optionButton}
              value={this.state.pinProtection}
              onValueChange={this.onPinProtectionSwitch}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionContainer} onPress={this.exportData}>
            <Text style={styles.optionText}>Export data...</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionContainer} onPress={this.importData}>
            <Text style={styles.optionText}>Import data...</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionContainer} onPress={this.clearData}>
            <Text style={styles.optionText}>Clear data...</Text>
          </TouchableOpacity>
          <View style={[styles.optionContainer, styles.textContainer]}>
            <Text style={styles.text}>{`App: ${DeviceInfo.getApplicationName()}`}</Text>
            <Text style={styles.text}>{`Version: ${DeviceInfo.getVersion()}`}</Text>
            <Text style={styles.text}>{`Bundle ID: ${DeviceInfo.getBundleId()}`}</Text>
          </View>
        </View>
      </View>
    );
  }
}
