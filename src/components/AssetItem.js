import React from 'react';
import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import coinLogos from '../assets';
import { colors } from '../utils';

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: colors.WHITE,
    margin: 5,
    width: '95%',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: colors.SHADOW,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  contentContainer: {
    flexDirection: 'row',
    padding: 15,
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
    const { onPressItem, asset } = this.props;
    onPressItem(asset);
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

    let logoImage = null;
    if (asset.coin.ticker) {
      logoImage = coinLogos[asset.coin.ticker.toLowerCase()];
    }

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.onPress}
        onLongPress={this.onLongPress}>
        <LinearGradient start={{ x: 0.9, y: 0.4 }} end={{ x: 1, y: 1 }} colors={gradientColors}>
          <View style={styles.contentContainer}>
            <View style={styles.logoContainer}>
              {logoImage && <Image source={logoImage} style={styles.logoImage} />}
              <Text>{asset.coin.ticker}</Text>
            </View>
            <View style={styles.portfolioDataContainer}>
              <Text style={styles.mainText}>{`$ ${
                asset.valuation !== undefined ? asset.valuation.toFixed(2) : '-'
              }`}</Text>
              <Text style={styles.secondaryText}>{asset.amount.toFixed(8)}</Text>
            </View>
            <View style={styles.coinDataContainer}>
              <Text style={styles.mainText}>{`$ ${asset.price ? asset.price : '-'}`}</Text>
              <Text style={styles.secondaryText}>{`${
                asset.variation !== undefined ? asset.variation.toFixed(2) : '-'
              } %`}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

AssetItem.propTypes = {
  asset: PropTypes.object.isRequired,
  onPressItem: PropTypes.func,
};

AssetItem.defaultProps = {
  onPressItem: () => {},
};

export default AssetItem;
