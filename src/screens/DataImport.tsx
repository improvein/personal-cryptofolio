import React, {useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SecondaryButton} from '../components';
import DataStorage from '../data/DataStorage';
import {colors} from '../utils';
import {MainStackParamList} from '../RouteNav';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

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
    padding: 20,
  },
  optionText: {
    color: colors.BLACK,
    textAlign: 'left',
    alignSelf: 'flex-start',
    fontSize: 20,
  },
  optionLabel: {
    textAlign: 'left',
    alignSelf: 'flex-start',
    fontSize: 20,
    color: colors.BLACK,
  },
  dataTextContainer: {
    flex: 1,
    width: '100%',
    marginVertical: 5,
  },
  dataText: {
    flex: 1,
    fontSize: 12,
    textAlign: 'left',
    textAlignVertical: 'top',
    padding: 5,
    borderWidth: 1,
    color: colors.BLACK,
    borderColor: colors.PRIMARY_COLOR_DARKER,
    borderRadius: 8,
  },
  buttonContainer: {
    width: '100%',
    alignSelf: 'center',
  },
});

interface DataImportProps
  extends NativeStackScreenProps<MainStackParamList, 'DataImportScreen'> {}

export default function DataImport({navigation}: DataImportProps) {
  const [dataJson, setDataJson] = useState<string>('');

  async function onImport() {
    Alert.alert(
      'Import data',
      'The data you will import will replace all existing data. Are you sure you want to continue?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await DataStorage.importData(dataJson);
              navigation.navigate('SettingsScreen', {});
            } catch (err) {
              console.error('There was an error importing the data.', err);
            }
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
        <Text style={styles.title}>Data import</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.optionText}>Select file... (disabled)</Text>
        <Text style={styles.optionLabel}>Paste the JSON data</Text>
        <View style={styles.dataTextContainer}>
          <TextInput
            style={styles.dataText}
            multiline
            underlineColorAndroid="transparent"
            onChangeText={text => setDataJson(text)}
            value={dataJson}
          />
        </View>
        <View style={styles.buttonContainer}>
          <SecondaryButton theme="dark" text="IMPORT" onPress={onImport} />
        </View>
      </View>
    </View>
  );
}
