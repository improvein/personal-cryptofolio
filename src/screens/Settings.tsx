import React, {useEffect, useState} from 'react';
import {
  Alert,
  Share,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';
import DataStorage from '../data/DataStorage';
import {colors} from '../utils';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainStackParamList} from '../RouteNav';
import {Settings} from '../types';

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

interface SettingsScreenProps
  extends NativeStackScreenProps<MainStackParamList, 'SettingsScreen'> {}

export default function SettingsScreen({navigation}: SettingsScreenProps) {
  const [settings, setSettings] = useState<Settings>();

  useEffect(() => {
    DataStorage.getSettings().then(storedSettings => {
      // add the settings to the state
      setSettings(storedSettings);
    });
  });

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', payload => {
  //     // check if came with params
  //     if (typeof payload.state.params !== 'undefined') {
  //       // check if came from PIN screen
  //       if (typeof payload.state.params.pin !== 'undefined') {
  //         // save the PIN protection
  //         updateSettings({pinProtection: true}).then(() => {
  //           // set the PIN to the app and update global
  //           DataStorage.updatePIN(payload.state.params.pin).then(() => {
  //             global.pinProtection = true;
  //           });
  //         });
  //       }
  //     }
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  async function updateSettings(newSettings: Settings) {
    try {
      // save them
      await DataStorage.updateSettings(newSettings);
      // update state
      setSettings(newSettings);
    } catch (err) {
      console.warn('Error saving settings.', err);
    }
  }

  function onPinProtection() {
    navigation.navigate('Auth', {
      screen: 'PINInputScreen',
      params: {
        enableBack: true,
        returnScreen: 'SettingsScreen',
      },
    });
  }

  async function onPinProtectionSwitch(value: boolean) {
    if (value) {
      // activate
      // call the standard procedure
      onPinProtection();
    } else {
      // de-activate
      await updateSettings({pinProtection: false});
      global.pinProtection = false;
    }
  }

  async function importData() {
    navigation.navigate('DataImportScreen');
  }

  async function exportData() {
    const rawDataJson = await DataStorage.getRawData();
    Share.share({
      message: rawDataJson,
    });
  }

  function clearData() {
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
      {cancelable: false},
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backArrowContainer}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={30} color={colors.BLACK} />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>
      <View style={styles.contentContainer}>
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={onPinProtection}>
          <Text style={styles.optionText}>PIN protection</Text>
          <Switch
            style={styles.optionButton}
            value={settings?.pinProtection}
            onValueChange={onPinProtectionSwitch}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer} onPress={exportData}>
          <Text style={styles.optionText}>Export data...</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer} onPress={importData}>
          <Text style={styles.optionText}>Import data...</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer} onPress={clearData}>
          <Text style={styles.optionText}>Clear data...</Text>
        </TouchableOpacity>
        <View style={[styles.optionContainer, styles.textContainer]}>
          <Text
            style={
              styles.text
            }>{`App: ${DeviceInfo.getApplicationName()}`}</Text>
          <Text
            style={styles.text}>{`Version: ${DeviceInfo.getVersion()}`}</Text>
          <Text
            style={
              styles.text
            }>{`Bundle ID: ${DeviceInfo.getBundleId()}`}</Text>
        </View>
      </View>
    </View>
  );
}
