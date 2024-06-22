import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Header} from '../components';
import PriceOracle from '../data/PriceOracle';
import {colors} from '../utils';
import {MainStackParamList} from '../RouteNav';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  headerChildren: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    width: '100%',
  },
  headerPrice: {
    flex: 1,
    flexDirection: 'column',
  },
  currentPrice: {
    color: colors.WHITE,
    fontSize: 28,
    textAlign: 'left',
    letterSpacing: 2,
  },
  priceSource: {
    color: colors.WHITE,
    fontSize: 10,
    textAlign: 'left',
    letterSpacing: 2,
  },
  deleteButton: {
    // alignSelf: 'flex-end',
    // padding: 5,
    position: 'absolute',
    top: -30,
    right: 10,
  },
});

interface AssetScreenHeaderProps
  extends NativeStackScreenProps<MainStackParamList, 'AssetScreen'> {}

export default function AssetScreenHeader({
  navigation,
  route,
}: AssetScreenHeaderProps) {
  const currentPrice = route.params.currentPrice ?? 0;

  const priceSources = PriceOracle.getSources();
  // get the Price Source name, if it exists
  let priceSourceName = '(no price)';
  priceSources.forEach(priceSource => {
    if (priceSource.code === route.params.asset.priceSourceCode) {
      priceSourceName = priceSource.name;
    }
  });
  return (
    <Header
      title={`${route.params.asset.coin.name} (${route.params.asset.coin.ticker})`}
      enableBackArrow={true}
      onBackArrowPress={() => navigation.goBack()}>
      <View style={styles.headerChildren}>
        <View style={styles.headerPrice}>
          <Text style={styles.currentPrice}>{`$ ${currentPrice.toFixed(
            2,
          )}`}</Text>
          <Text style={styles.priceSource}>{priceSourceName}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.deleteButton}>
        <Icon
          onPress={route.params.onRemoveAsset || (() => {})}
          name="delete"
          size={20}
          color={colors.WHITE}
        />
      </TouchableOpacity>
    </Header>
  );
}
