import React, { Component } from 'react';
import {
  Picker, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DataStorage from '../data/DataStorage';
import { colors } from '../utils';
import { SecondaryButton } from '../components';
import PriceOracle from '../data/PriceOracle';

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
  exchangePicker: {
    width: '100%',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 50,
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
    // get the selected coin from previous screen
    const coin = this.props.navigation.getParam('coin', null);
    // get the available price sources for this coin
    const priceSources = PriceOracle.getSources();
    const availabelPriceSources = priceSources.filter(priceSource => coin.availablePriceSources.includes(priceSource.code));

    // initialize state
    this.state = {
      coin,
      priceSources: availabelPriceSources,
    };
  }

  onAdd = () => {
    const { coin, priceSourceCode } = this.state;
    if (coin !== null && priceSourceCode !== null) {
      DataStorage.addAsset(coin, priceSourceCode).then(() => {
        // go back to the main list
        this.props.navigation.navigate('AssetListScreen', { refresh: true });
      });
    }
  };

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
            <Icon name="arrow-left" size={30} color={colors.WHITE} />
          </TouchableOpacity>
          <Text style={styles.title}>{`${this.state.coin.ticker}/USD`}</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.label}>Price source</Text>
          <Picker
            selectedValue={this.state.priceSourceCode}
            style={styles.exchangePicker}
            onValueChange={itemValue => this.setState(prevState => ({
              ...prevState,
              priceSourceCode: itemValue,
            }))
            }
          >
            <Picker.Item label="(No price)" value="" key="" />
            {this.state.priceSources.map(exchange => (
              <Picker.Item label={exchange.name} value={exchange.code} key={exchange.code} />
            ))}
          </Picker>
          <Text style={styles.amount}>{`1 ${this.state.coin.ticker} /`}</Text>
          <Text style={styles.price}>USD 9,999.99</Text>
        </View>
        <View style={styles.buttonContainer}>
          <SecondaryButton text="DONE" onPress={this.onAdd} />
        </View>
      </LinearGradient>
    );
  }
}

export default AssetAddDetail;
