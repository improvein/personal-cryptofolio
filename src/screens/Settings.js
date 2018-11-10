import React from 'react';
import {
  Alert, Share, StyleSheet, Text, TouchableOpacity, TextInput, View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
    padding: 10,
    marginHorizontal: 5,
    borderBottomColor: colors.BLACK,
    borderBottomWidth: 1,
  },
  optionText: {
    textAlign: 'left',
    fontSize: 20,
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
    // const assets = await DataStorage.getSettings();
    // // add the settings to the state
    // this.setState(prevState => ({
    //   ...prevState,
    //   coins: stateCoins,
    // }));
  }

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

  render() {
    return (
      <View style={styles.container}>
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
          <TouchableOpacity style={styles.optionContainer} onPress={this.exportData}>
            <Text style={styles.optionText}>Export data...</Text>
          </TouchableOpacity>
          <View style={styles.optionContainer}>
            <Text style={styles.optionText}>Import data...</Text>
          </View>
          <TouchableOpacity style={styles.optionContainer} onPress={this.clearData}>
            <Text style={styles.optionText}>Clear data...</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
