import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../utils';

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

export default class PINInput extends React.Component {
  static navigationOptions = {
    title: 'Enter PIN',
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      pin: '',
    };
  }

  onPressKey = (key) => {
    this.setState(prevState => ({
      pin: prevState.pin + key,
    }));
  };

  onConfirm = () => {
    const returnScreen = this.props.navigation.getParam('returnScreen', 'AssetListScreen');
    this.props.navigation.navigate(returnScreen, { pin: this.state.pin });
  };

  onClear = () => {
    this.setState({
      pin: '',
    });
  };

  renderKeyPad = key => (
    <TouchableOpacity style={styles.keypadNumber} onPress={() => this.onPressKey(key)} key={key}>
      <Text style={styles.keypadNumberText}>{key}</Text>
    </TouchableOpacity>
  );

  render() {
    const enableBack = this.props.navigation.getParam('enableBack', false);

    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={[colors.PRIMARY_COLOR_LIGHTER, colors.PRIMARY_COLOR_DARKER]}
        style={styles.container}
      >
        <View style={styles.header}>
          {enableBack && (
            <TouchableOpacity
              style={styles.backArrowContainer}
              onPress={() => this.props.navigation.goBack()}
            >
              <Icon name="arrow-left" size={30} color={colors.WHITE} />
            </TouchableOpacity>
          )}
          <Text style={styles.title}>Enter PIN</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.enteredPin}>{'*'.repeat(this.state.pin.length)}</Text>
          <View style={styles.keypad}>
            <View style={styles.keypadRow}>
              {['1', '2', '3'].map(key => this.renderKeyPad(key))}
            </View>
            <View style={styles.keypadRow}>
              {['4', '5', '6'].map(key => this.renderKeyPad(key))}
            </View>
            <View style={styles.keypadRow}>
              {['7', '8', '9'].map(key => this.renderKeyPad(key))}
            </View>
            <View style={styles.keypadRow}>
              <TouchableOpacity style={styles.keypadNumber} onPress={this.onClear} key="clear">
                <Text style={styles.keypadNumberText}>
                  <Icon name="close" size={25} />
                </Text>
              </TouchableOpacity>
              {this.renderKeyPad('0')}
              <TouchableOpacity style={styles.keypadNumber} onPress={this.onConfirm} key="confirm">
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
}
