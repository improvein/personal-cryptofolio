import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View, Text} from 'react-native';
import {AssetItem, AddCoinButton} from '../components';
import DataStorage from '../data/DataStorage';
import PriceOracle from '../data/PriceOracle';
import {colors} from '../utils';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainStackParamList} from '../RouteNav';
import {Asset} from '../types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  listContainer: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  headerChildren: {},

  settingsButton: {
    // alignSelf: 'flex-end',
    position: 'absolute',
    top: -40,
    right: 10,
  },
  listContentContainer: {
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 0,
  },
  listEmptyContent: {
    fontSize: 20,
    alignSelf: 'center',
    marginTop: 30,
  },
  footerContainer: {
    paddingTop: 10,
    paddingBottom: 20,
    width: '90%',
    alignSelf: 'center',
  },
});

interface AssetListProps
  extends NativeStackScreenProps<MainStackParamList, 'AssetListScreen'> {}

export default function AssetList({navigation, route}: AssetListProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const refreshAssets = useCallback(async () => {
    const storedAssets = await DataStorage.getAssets();
    let totalValuation = 0;

    // get assets from storage
    const assetsToList = Object.values(storedAssets);

    // fetch and update their market prices
    PriceOracle.refreshPrices()
      .then(() => {
        // update the data to display
        return DataStorage.getPrices();
      })
      .then(prices => {
        for (let index = 0; index < assetsToList.length; index += 1) {
          const {ticker} = assetsToList[index].coin;
          const coinPrice = prices[ticker] || null;
          if (coinPrice !== null) {
            assetsToList[index].price = prices[ticker].price || 0;
            assetsToList[index].variation = prices[ticker].variation || 0;
          } else {
            assetsToList[index].price = 0;
            assetsToList[index].variation = 0;
          }
          assetsToList[index].valuation =
            (assetsToList[index].price ?? 0) * assetsToList[index].amount;
          totalValuation += assetsToList[index].valuation ?? 0;
        }

        // update the total valuation
        navigation.setParams({totalValuation});

        // add the assets to the state
        setAssets(assetsToList);
        setRefreshing(false);
      })
      .catch(error => {
        console.warn("Couldn't get prices.", error);
        setRefreshing(false);
      });

    // add the assets to the state
    setAssets(assetsToList);
  }, [navigation]);

  function onAddCoin() {
    navigation.navigate('AssetAddListScreen');
  }

  function onPressItem(item: Asset) {
    navigation.navigate('AssetScreen', {asset: item});
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshAssets();
  }, [refreshAssets]);

  useEffect(() => {
    // load assets from storage (simulate manual refresh action)
    onRefresh();
  }, [onRefresh]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params.refresh) {
        onRefresh();
      }
    });

    return unsubscribe;
  }, [navigation, onRefresh, route.params.refresh]);

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContentContainer}
          data={assets}
          keyExtractor={item => item.coin.ticker}
          renderItem={({item}) => (
            <AssetItem asset={item} onPressItem={onPressItem} />
          )}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <Text style={styles.listEmptyContent}>
              {refreshing ? '(loading...)' : '(no assets)'}
            </Text>
          }
        />
      </View>
      <View style={styles.footerContainer}>
        <AddCoinButton onPress={onAddCoin} />
      </View>
    </View>
  );
}
