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

class AssetItem extends React.Component {
  /**
   * Press event handler
   */
  onPress = () => {
    this.props.onPressItem(this.props.asset);
  };

  /**
   * Long press event handler
   */
  onLongPress = () => {
    console.log('Long press');
  };

  render() {
    const { asset } = this.props;
    const gradientColors = [colors.WHITE];
    if (asset.variation >= 0) {
      gradientColors.push(colors.GREEN);
    } else {
      gradientColors.push(colors.RED);
    }

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
              {asset.coin
                && asset.coin.logo && <Image source={asset.coin.logo} style={styles.logoImage} />}
              <Text>{asset.coin.ticker}</Text>
            </View>
            <View style={styles.portfolioDataContainer}>
              <Text style={styles.mainText}>{`$ ${asset.valuation.toFixed(2)}`}</Text>
              <Text style={styles.secondaryText}>{asset.amount}</Text>
            </View>
            <View style={styles.coinDataContainer}>
              <Text style={styles.mainText}>{`$ ${asset.price}`}</Text>
              <Text style={styles.secondaryText}>{`${asset.variation.toFixed(2)} %`}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

export default AssetItem;
