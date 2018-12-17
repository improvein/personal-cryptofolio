import React from 'react';
import {
  Alert, FlatList, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AssetInfoBox, AssetTxItem, Header } from '../components';
import DataStorage from '../data/DataStorage';
import PriceOracle from '../data/PriceOracle';
import { colors } from '../utils';

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

export default class Asset extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const currentPrice = navigation.getParam('currentPrice', 0);

    const priceSources = PriceOracle.getSources();
    // get the Price Source name, if it exists
    let priceSourceName = '(no price)';
    priceSources.forEach((priceSource) => {
      if (priceSource.code === navigation.state.params.asset.priceSourceCode) {
        priceSourceName = priceSource.name;
      }
    });

    return {
      header: (
        <Header
          title={`${navigation.state.params.asset.coin.name} (${
            navigation.state.params.asset.coin.ticker
          })`}
          enableBackArrow="true"
          onBackArrowPress={() => navigation.goBack()}
        >
          <View style={styles.headerChildren}>
            <View style={styles.headerPrice}>
              <Text style={styles.currentPrice}>{`$ ${currentPrice.toFixed(2)}`}</Text>
              <Text style={styles.priceSource}>{priceSourceName}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.deleteButton}>
            <Icon
              onPress={navigation.getParam('onRemoveAsset') || (() => {})}
              name="delete"
              size={20}
              color={colors.WHITE}
            />
          </TouchableOpacity>
        </Header>
      ),
    };
  };

  constructor(props) {
    super(props);

    const asset = this.props.navigation.getParam('asset');

    // on pres event handler
    this.state = {
      asset,
      totalCost: 0,
      transactions: [],
      refreshing: false,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ onRemoveAsset: this.removeAsset });
    // load assets from storage
    this.refreshTransactions();
  }

  onRefresh = () => {
    this.setState(
      {
        refreshing: true,
      },
      async () => {
        await this.refreshTransactions();
      },
    );
  };

  refreshTransactions = async () => {
    let currentPrice = 0;

    // get assets from storage
    const transactions = await DataStorage.getAssetTransactions(this.state.asset);
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
      transactionsArray.forEach((tx) => {
        totalCost += tx.amount * tx.price;
      });
    }

    // fetch and update their market prices
    await PriceOracle.refreshPrices();
    // update the  data to display
    // prices
    const prices = await DataStorage.getPrices();
    const coinPrice = prices[this.state.asset.coin.ticker] || null;
    if (coinPrice !== null) {
      currentPrice = coinPrice.price || 0;
    } else {
      currentPrice = 0;
    }
    // update the current price
    this.props.navigation.setParams({ currentPrice });

    // add the assets to the state
    this.setState(prevState => ({
      ...prevState,
      transactions: transactionsArray,
      totalCost,
      refreshing: false,
    }));
  };

  removeAsset = () => {
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
            const { asset } = this.props.navigation.state.params;
            DataStorage.removeAsset(asset.coin.ticker).then(() => {
              this.props.navigation.navigate('AssetListScreen', { refresh: true });
            });
          },
        },
      ],
      { cancelable: false },
    );
  };

  onAddTransaction = () => {
    const { navigation } = this.props;
    navigation.navigate('AssetTxScreen', {
      asset: this.state.asset,
      currentPrice: navigation.getParam('currentPrice', 0),
    });
  };

  onPressTxItem = (tx) => {
    const { navigation } = this.props;
    navigation.navigate('AssetTxScreen', {
      asset: this.state.asset,
      transaction: tx,
      currentPrice: navigation.getParam('currentPrice', 0),
    });
  };

  onDidFocus = (payload) => {
    if (this.props.navigation.getParam('refresh', false)) {
      this.onRefresh();
    }
  };

  render() {
    const { asset } = this.props.navigation.state.params;
    const { totalCost } = this.state;
    const marketPrice = asset.amount * asset.price;

    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={this.onDidFocus} />
        <View style={styles.infoContainer}>
          <AssetInfoBox title="Holdings" text={asset.amount.toFixed(8)} />
          <AssetInfoBox
            title={totalCost >= 0 ? 'Income' : 'Cost'}
            text={`$ ${totalCost.toFixed(2)}`}
          />
          <AssetInfoBox title="Market value" text={`$ ${marketPrice.toFixed(2)}`} />
          <AssetInfoBox title="Profit / Loss">
            {`$ ${(marketPrice - totalCost).toFixed(2)}`}
            {marketPrice >= totalCost ? (
              <Icon name="arrow-up-thick" size={15} color={colors.GREEN} />
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
                onPress={this.onAddTransaction}
                name="plus-circle-outline"
                size={30}
                color={colors.PRIMARY_COLOR_DARKER}
              />
            </TouchableOpacity>
          </View>

          <FlatList
            style={styles.list}
            contentContainerStyle={styles.listContentContainer}
            data={this.state.transactions}
            keyExtractor={item => item.date}
            renderItem={({ item }) => (
              <AssetTxItem transaction={item} onPressItem={this.onPressTxItem} />
            )}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            ListEmptyComponent={<Text style={styles.listEmptyContent}>(no transactions)</Text>}
          />
        </View>
      </View>
    );
  }
}
