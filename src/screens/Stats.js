import React from 'react';
import {
  FlatList, StyleSheet, Text, TouchableOpacity, TextInput, View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CoinListItem } from '../components';
import DataStorage from '../data/DataStorage';
import { colors } from '../utils';
import PriceOracle from '../data/PriceOracle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 30,
    width: '95%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 25,
    color: colors.WHITE,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
  },
  backArrowContainer: {
    position: 'absolute',
    top: 35,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    padding: 20,
  },
  statRow: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    width: '100%',
    marginBottom: 10,
  },
  statRowLabel: {
    flex: 1,
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    fontSize: 20,
  },
  statRowValue: {
    alignSelf: 'flex-end',
    fontSize: 20,
  },
});

export default class Stats extends React.Component {
  static navigationOptions = {
    title: 'Portfolio Stats',
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      valuation: 0,
      cost: 0,
    };
  }

  async componentDidMount() {
    await this.refreshStats();
  }

  refreshStats = async () => {
    const assets = await DataStorage.getAssets();
    let totalValuation = 0;
    let totalCost = 0;

    // get assets from storage
    const assetsToList = Object.values(assets);
    // fetch and update their market prices
    await PriceOracle.refreshPrices();
    // update the data to display
    const prices = await DataStorage.getPrices();
    for (let index = 0; index < assetsToList.length; index += 1) {
      const asset = assetsToList[index];
      const { ticker } = asset.coin;
      const coinPrice = prices[ticker] || null;
      let price = 0;
      if (coinPrice !== null) {
        price = prices[ticker].price || 0;
      } else {
        price = 0;
      }
      const assetValuation = price * asset.amount;
      totalValuation += assetValuation;
      // now fetch transactions to see the cost
      const transactions = await DataStorage.getAssetTransactions(asset);
      Object.values(transactions).forEach((tx) => {
        totalCost += tx.price * tx.amount;
      });
    }

    // add the assets to the state
    this.setState(prevState => ({
      ...prevState,
      refreshing: false,
      valuation: totalValuation,
      cost: totalCost,
    }));
  };

  render() {
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={[colors.PRIMARY_COLOR_LIGHTER, colors.PRIMARY_COLOR_DARKER]}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backArrowContainer}
            onPress={() => this.props.navigation.goBack()}
          >
            <Icon name="arrow-left" size={30} color={colors.WHITE} />
          </TouchableOpacity>
          <Text style={styles.title}>Portfolio Stats</Text>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.statRow}>
            <Text style={styles.statRowLabel}>Total valuation</Text>
            <Text style={styles.statRowValue}>{`$ ${this.state.valuation.toFixed(2)}`}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statRowLabel}>Total cost</Text>
            <Text style={styles.statRowValue}>{`$ ${this.state.cost.toFixed(2)}`}</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }
}
