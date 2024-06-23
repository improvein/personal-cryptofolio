import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../utils';
import DataStorage from '../data/DataStorage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainStackParamList} from '../RouteNav';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 30,
    width: '95%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 25,
    color: colors.WHITE,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
  },
  backArrowContainer: {
    position: 'absolute',
    top: 35,
  },
  contentContainer: {
    flex: 1,
    width: '95%',
    alignSelf: 'center',
  },
  enteredPin: {
    width: '90%',
    alignSelf: 'center',
    textAlign: 'center',
    backgroundColor: colors.WHITE,
    fontSize: 20,
    marginVertical: 10,
    height: 40,
    borderRadius: 8,
    padding: 10,
  },
  errorMessage: {
    width: '90%',
    alignSelf: 'center',
    textAlign: 'center',
    color: colors.RED,
    fontSize: 15,
    marginVertical: 5,
    height: 30,
    padding: 5,
  },
  keypad: {
    flex: 1,
    justifyContent: 'center',
  },
  keypadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keypadNumber: {
    backgroundColor: colors.WHITE,
    width: 60,
    height: 60,
    borderRadius: 60,
    padding: 10,
    margin: 10,
    justifyContent: 'center',
  },
  keypadNumberText: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 25,
  },
});

interface PINInputScreenProps
  extends NativeStackScreenProps<MainStackParamList, 'PINInputScreen'> {}

export default function PINInput({navigation, route}: PINInputScreenProps) {
  const [pin, setPin] = useState<string>('');
  const [valid, setIsValid] = useState<boolean>(true);

  function onPressKey(key: string) {
    setPin(pin + key);
  }

  async function onConfirm() {
    const authMode = route.params.authMode;

    // if authMode then update global
    if (authMode) {
      // need to validate
      if (!(await DataStorage.validatePIN(pin))) {
        setIsValid(false);
        return;
      }
      // validation went OK
      global.activePin = pin;
    } else {
      navigation.navigate('SettingsScreen', {newPin: pin});
    }

    // global.isAccessGranted = true;
  }

  function onClear() {
    setPin('');
  }

  function renderKeyPad(key: string) {
    return (
      <TouchableOpacity
        style={styles.keypadNumber}
        onPress={() => onPressKey(key)}
        key={key}>
        <Text style={styles.keypadNumberText}>{key}</Text>
      </TouchableOpacity>
    );
  }

  const enableBack = route.params.enableBack;

  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      colors={[colors.PRIMARY_COLOR_LIGHTER, colors.PRIMARY_COLOR_DARKER]}
      style={styles.container}>
      <View style={styles.header}>
        {enableBack && (
          <TouchableOpacity
            style={styles.backArrowContainer}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={30} color={colors.WHITE} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>
          {route.params.authMode ? 'Enter PIN' : 'Setup your PIN'}
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.enteredPin}>
          {route.params.authMode ? '*'.repeat(pin.length) : pin}
        </Text>
        {valid || <Text style={styles.errorMessage}>Invalid PIN</Text>}
        <View style={styles.keypad}>
          <View style={styles.keypadRow}>
            {['1', '2', '3'].map(key => renderKeyPad(key))}
          </View>
          <View style={styles.keypadRow}>
            {['4', '5', '6'].map(key => renderKeyPad(key))}
          </View>
          <View style={styles.keypadRow}>
            {['7', '8', '9'].map(key => renderKeyPad(key))}
          </View>
          <View style={styles.keypadRow}>
            <TouchableOpacity
              style={styles.keypadNumber}
              onPress={onClear}
              key="clear">
              <Text style={styles.keypadNumberText}>
                <Icon name="close" size={25} />
              </Text>
            </TouchableOpacity>
            {renderKeyPad('0')}
            <TouchableOpacity
              style={styles.keypadNumber}
              onPress={onConfirm}
              key="confirm">
              <Text style={styles.keypadNumberText}>
                <Icon name="check" size={25} />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
