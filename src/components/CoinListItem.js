import React from 'react';
import {
  Image, StyleSheet, TouchableOpacity, Text, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../utils';

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    height: 60,
    width: '100%',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  logoContianer: {
    width: '15%',
    borderRightColor: colors.BLACK,
    borderRightWidth: 1,
  },
  logo: {
    width: 30,
    height: 30,
  },
  nameContainer: {
    width: '45%',
    paddingLeft: 15,
  },
  names: {
    fontSize: 16,
  },
  selectArrowContainer: {
    width: '40%',
    paddingLeft: 10,
  },
  selectArrow: {
    textAlign: 'right',
    fontSize: 18,
  },
});

class CoinListItem extends React.Component {
  /**
   * Press event handler
   */
  onPress = () => {
    this.props.onPressItem(this.props.coin);
  };

  render() {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={this.onPress}>
        {/* TODO REMOVE THIS CONDITION WHEN ALL COINS HAVE LOGO */}
        <View style={styles.logoContianer}>
          {this.props.coin.logo && <Image source={this.props.coin.logo} style={styles.logo} />}
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.names}>{`${this.props.coin.name}  (${this.props.coin.ticker})`}</Text>
        </View>
        <View style={styles.selectArrowContainer}>
          <Icon style={styles.selectArrow} name="chevron-right" size={30} />
        </View>
      </TouchableOpacity>
    );
  }
}

export default CoinListItem;
