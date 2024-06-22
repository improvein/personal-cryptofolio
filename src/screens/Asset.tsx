import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AssetInfoBox, AssetTxItem} from '../components';
import DataStorage from '../data/DataStorage';
import PriceOracle from '../data/PriceOracle';
import {colors} from '../utils';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainStackParamList} from '../RouteNav';
import {Transaction} from '../types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  infoContainer: {
    // flex: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // alignItems: 'stretch',
    paddingHorizontal: 15,
    width: '100%',
  },
  listContainer: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  listHeader: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    paddingHorizontal: 15,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  listSectionTitle: {
    flex: 1,
    color: colors.PRIMARY_COLOR_DARKER,
    fontSize: 20,
    alignSelf: 'flex-start',
    textAlign: 'left',
    letterSpacing: 2,
  },
  listSectionAdd: {
    alignSelf: 'flex-end',
    padding: 5,
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
  list: {
    flex: 1,
    width: '100%',
  },
});

interface AssetScreenProps
  extends NativeStackScreenProps<MainStackParamList, 'AssetScreen'> {}

export default function AssetScreen({route, navigation}: AssetScreenProps) {
  const [asset] = useState(route.params.asset);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    // const unsubscribe = navigation.addListener('focus', () => {
    //   if (route.params.refresh) {
    //     setRefreshing(true);
    //     refreshTransactions().then(() => {
    //       setRefreshing(false);
    //     });
    //   }
    // });

    navigation.setParams({onRemoveAsset: removeAsset});
    // load assets from storage
    refreshTransactions();

    // return unsubscribe;
  }, [navigation, refreshTransactions, removeAsset]);

  async function onRefresh() {
    setRefreshing(true);
    await refreshTransactions();
  }

  async function refreshTransactions() {
    let currentPrice = 0;

    // get assets from storage
    const transactions = await DataStorage.getAssetTransactions(asset);
    let transactionsArray = Object.values(transactions);
    // calculate the total cost and sort
    let totalCost = 0.0;

    // if empty then dont bother with complex conversions
    if (transactionsArray.length > 0) {
      // sort by date (descending)
      transactionsArray = transactionsArray.sort((a, b) => {
        if (a.date > b.date) {
          return -1;
        }
        if (a.date < b.date) {
          return 1;
        }
        return 0;
      });
      // calculate total
      transactionsArray.forEach(tx => {
        totalCost += tx.amount * tx.price;
      });
    }

    // fetch and update their market prices
    await PriceOracle.refreshPrices();
    // update the  data to display
    // prices
    const prices = await DataStorage.getPrices();
    const coinPrice = prices[asset.coin.ticker] || null;
    if (coinPrice !== null) {
      currentPrice = coinPrice.price || 0;
    } else {
      currentPrice = 0;
    }
    // update the current price
    navigation.setParams({currentPrice});

    // add the assets to the state
    setTransactions(transactionsArray);
    setTotalCost(totalCost);
    setRefreshing(false);
  }

  function removeAsset() {
    Alert.alert(
      'Remove asset',
      'Are you sure you want to remove the asset from your portfolio?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            /* do nothing */
          },
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            DataStorage.removeAsset(asset.coin.ticker).then(() => {
              navigation.navigate('AssetListScreen', {refresh: true});
            });
          },
        },
      ],
      {cancelable: false},
    );
  }

  function onAddTransaction() {
    navigation.navigate('AssetTxScreen', {
      asset,
      currentPrice: route.params.currentPrice ?? 0,
    });
  }

  function onPressTxItem(tx: Transaction) {
    navigation.navigate('AssetTxScreen', {
      asset,
      transaction: tx,
      currentPrice: route.params.currentPrice ?? 0,
    });
  }

  const marketPrice = asset.amount * (asset.price ?? 0);
  const averagePrice = totalCost / asset.amount;

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <AssetInfoBox title="Holdings" text={asset.amount.toFixed(8)} />
        <AssetInfoBox title="Spent" text={`$ ${totalCost.toFixed(2)}`} />
        <AssetInfoBox
          title="Market value"
          text={`$ ${marketPrice.toFixed(2)}`}
        />
        <AssetInfoBox title="Avg. Buy" text={`$ ${averagePrice.toFixed(2)}`} />
        <AssetInfoBox title="Profit / Loss">
          {`$ ${(marketPrice - totalCost).toFixed(2)}`}
          {marketPrice >= totalCost ? (
            <Icon name="arrow-up-thick" size={15} color={colors.GREEN_DARK} />
          ) : (
            <Icon name="arrow-down-thick" size={15} color={colors.RED} />
          )}
        </AssetInfoBox>
      </View>
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listSectionTitle}>Transactions</Text>
          <TouchableOpacity style={styles.listSectionAdd}>
            <Icon
              onPress={onAddTransaction}
              name="plus-circle-outline"
              size={30}
              color={colors.PRIMARY_COLOR_DARKER}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContentContainer}
          data={transactions}
          keyExtractor={(item: Transaction) => item.date.getTime().toString()}
          renderItem={({item}) => (
            <AssetTxItem transaction={item} onPressItem={onPressTxItem} />
          )}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <Text style={styles.listEmptyContent}>(no transactions)</Text>
          }
        />
      </View>
    </View>
  );
}
