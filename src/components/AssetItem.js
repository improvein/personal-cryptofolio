import React from 'react';
import {
  Image, StyleSheet, TouchableOpacity, Text, View,
} from 'react-native';
import { colors } from '../utils';

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: colors.WHITE,
  },
  contentContainer: {
    padding: 15,
    flexDirection: 'row',
  },
  logoContainer: {
    width: '20%',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  logoImage: {
    width: 50,
    height: 50,
  },
  personalDataContainer: {
    width: '40%',
    paddingLeft: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderLeftColor: 'black',
    borderLeftWidth: 1,
  },
  coinDataContinar: {
    width: '40%',
    alignItems: 'flex-end',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  mainText: {
    fontSize: 28,
  },
  secondaryText: {
    fontSize: 20,
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
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.onPress}
        onLongPress={this.onLongPress}
      >
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Image source={asset.coin.logo} style={styles.logoImage} />
            <Text>BTC</Text>
          </View>
          <View style={styles.personalDataContainer}>
            <Text style={styles.mainText}>$980.00</Text>
            <Text style={styles.secondaryText}>2.00</Text>
          </View>
          <View style={styles.coinDataContinar}>
            <Text style={styles.mainText}>$7,520.00</Text>
            <Text style={styles.secondaryText}>% 5.00</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default AssetItem;
