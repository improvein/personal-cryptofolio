import React from 'react';
import {
  Image, StyleSheet, TouchableOpacity, Text, View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../utils';

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: colors.WHITE,
    marginBottom: 0,
    width: '95%',
    shadowColor: colors.SHADOW,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  contentContainer: {
    padding: 15,
    flexDirection: 'row',
    // height: 80,
  },
  logoContainer: {
    width: '16%',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  logoImage: {
    width: 30,
    height: 30,
  },
  portfolioDataContainer: {
    width: '40%',
    paddingLeft: 15,
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderLeftColor: 'black',
    borderLeftWidth: 1,
  },
  coinDataContainer: {
    width: '45%',
    alignItems: 'flex-end',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  mainText: {
    fontSize: 20,
  },
  secondaryText: {
    fontSize: 12,
  },
});

class AssetTxItem extends React.Component {
  /**
   * Press event handler
   */
  onPress = () => {
    this.props.onPressItem(this.props.transaction);
  };

  /**
   * Long press event handler
   */
  onLongPress = () => {
    console.log('Long press');
  };

  render() {
    const { transaction } = this.props;
    const gradientColors = [colors.WHITE];

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.onPress}
        onLongPress={this.onLongPress}
      >
        <LinearGradient start={{ x: 0.9, y: 0.4 }} end={{ x: 1, y: 1 }} colors={gradientColors}>
          <View style={styles.contentContainer}>
            <View style={styles.logoContainer}>
              {/* TODO TAKE OUT THIS VALIDATION WHEN ALL COINS HAVE LOGO */}
              {transaction.coin
                && transaction.coin.logo && (
                  <Image source={transaction.coin.logo} style={styles.logoImage} />
              )}
              <Text>{transaction.coin.ticker}</Text>
            </View>
            <View style={styles.portfolioDataContainer}>
              <Text style={styles.mainText}>{`$ ${transaction.valuation.toFixed(2)}`}</Text>
              <Text style={styles.secondaryText}>{transaction.amount}</Text>
            </View>
            <View style={styles.coinDataContainer}>
              <Text style={styles.mainText}>{`$ ${transaction.price}`}</Text>
              <Text style={styles.secondaryText}>{`${transaction.variation.toFixed(2)} %`}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

export default AssetTxItem;
