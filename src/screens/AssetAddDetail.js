import React, { Component } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../utils';
import { SecondaryButton } from '../components';

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
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    color: colors.WHITE,
  },
  amount: {
    fontSize: 20,
    color: colors.WHITE,
    marginBottom: 15,
  },
  price: {
    fontSize: 45,
    color: colors.WHITE,
    marginBottom: 100,
  },
  buttonContainer: {
    width: '90%',
    alignSelf: 'center',
  },
});

class AssetAddDetail extends Component {
  static navigationOptions = {
    title: 'Add Asset Detail',
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={[colors.PRIMARY_COLOR_LIGHTER, colors.PRIMARY_COLOR_DARKER]}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={styles.backArrowContainer}
          >
            <Text>Back arrow</Text>
          </TouchableOpacity>
          <Text style={styles.title}>BTC/USD</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.label}>Price Source</Text>
          <Text style={{ fontSize: 40, color: colors.WHITE, marginTop: 20, marginBottom: 50 }}>ACA VA EL PICKER</Text>
          <Text style={styles.amount}>1 BTC /</Text>
          <Text style={styles.price}>U$D 7,500.00</Text>
        </View>
        <View style={styles.buttonContainer}>
          <SecondaryButton text="DONE" onPress={() => this.props.navigation.navigate('AssetListScreen')} />
        </View>
      </LinearGradient>
    );
  }
}

export default AssetAddDetail;
