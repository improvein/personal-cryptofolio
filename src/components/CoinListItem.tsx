import React from 'react';
import {Image, StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../utils';
import {Coin} from '../types';

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

interface CoinListItemProps {
  coin: Coin;
  onPressItem: (coin: Coin) => void;
}

export default function CoinListItem({coin, onPressItem}: CoinListItemProps) {
  /**
   * Press event handler
   */
  function onPress() {
    onPressItem(coin);
  }

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View style={styles.logoContianer}>
        {coin.logo && <Image source={coin.logo} style={styles.logo} />}
      </View>
      <View style={styles.nameContainer}>
        <Text style={styles.names}>{`${coin.name}  (${coin.ticker})`}</Text>
      </View>
      <View style={styles.selectArrowContainer}>
        <Icon style={styles.selectArrow} name="chevron-right" size={30} />
      </View>
    </TouchableOpacity>
  );
}
