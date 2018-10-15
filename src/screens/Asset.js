import React from 'react';
import {
  Alert, FlatList, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
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
  currentPrice: {
    flex: 1,
    color: colors.WHITE,
    fontSize: 30,
    textAlign: 'left',
    letterSpacing: 2,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  infoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    width: '100%',
  },
  listSectionContainer: {
    padding: 10,
  },
  listSectionHeader: {
    flexDirection: 'row',
    width: '100%',
  },
  listSectionTitle: {
    flex: 1,
    color: colors.PRIMARY_COLOR_DARKER,
    fontSize: 20,
    textAlign: 'left',
    letterSpacing: 2,
  },
  listSectionAdd: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  listContainer: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
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
  },
});

export default class Asset extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const currentPrice = navigation.getParam('currentPrice', 0);
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
            <Text style={styles.currentPrice}>{`$ ${currentPrice.toFixed(2)}`}</Text>
            <TouchableOpacity style={styles.deleteButton}>
              <Icon
                onPress={navigation.getParam('onRemoveAsset') || (() => {})}
                name="delete"
                size={20}
                color={colors.WHITE}
              />
            </TouchableOpacity>
          </View>
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
      transactions,
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
              this.props.navigation.navigate('AssetListScreen');
            });
          },
        },
      ],
      { cancelable: false },
    );
  };

  render() {
    const { asset } = this.props.navigation.state.params;
    return (
      <View styles={styles.container}>
        <View style={styles.infoContainer}>
          <AssetInfoBox title="Holdings" text={asset.amount} />
          <AssetInfoBox title="Net cost" text={0} />
          <AssetInfoBox title="Market value" text={asset.amount * asset.price} />
          <AssetInfoBox title="Profit / Loss" text={0} />
        </View>
        <View style={styles.listSectionContainer}>
          <View style={styles.listSectionHeader}>
            <Text style={styles.listSectionTitle}>Transactions</Text>
            <TouchableOpacity style={styles.listSectionAdd}>
              <Icon
                onPress={() => {}}
                name="plus-circle-outline"
                size={30}
                color={colors.PRIMARY_COLOR_DARKER}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.listContainer}>
            <FlatList
              style={styles.list}
              contentContainerStyle={styles.listContentContainer}
              data={this.state.transactions}
              keyExtractor={item => item.date}
              renderItem={({ item }) => (
                <AssetTxItem transaction={item} onPressItem={this.onPressItem} />
              )}
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
              ListEmptyComponent={<Text style={styles.listEmptyContent}>(no transactions)</Text>}
            />
          </View>
        </View>
      </View>
    );
  }
}
