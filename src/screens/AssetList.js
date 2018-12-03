import React from 'react';
import {
  FlatList, StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AssetItem, Header, AddCoinButton } from '../components';
import DataStorage from '../data/DataStorage';
import PriceOracle from '../data/PriceOracle';
import { colors } from '../utils';
// import coinsLogos from '../assets';

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
  totalAmount: {
    color: colors.WHITE,
    fontSize: 35,
    alignSelf: 'center',
    letterSpacing: 2,
  },
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

export default class AssetList extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const totalValuation = navigation.getParam('totalValuation', 0);
    return {
      header: (
        <Header title="Personal CryptoFolio">
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('StatsScreen');
            }}
          >
            <Text style={styles.totalAmount}>{`$ ${totalValuation.toFixed(2)}`}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => {
              navigation.navigate('SettingsScreen');
            }}
          >
            <Icon name="settings" size={30} color={colors.WHITE} />
          </TouchableOpacity>
        </Header>
      ),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      assets: [],
      refreshing: false,
    };
  }

  componentDidMount() {
    // load assets from storage
    this.refreshAssets();
  }

  onPressItem = (item) => {
    const { navigate } = this.props.navigation;
    navigate('AssetScreen', { asset: item });
  };

  onRefresh = () => {
    this.setState(
      {
        refreshing: true,
      },
      async () => {
        await this.refreshAssets();
      },
    );
  };

  refreshAssets = async () => {
    const assets = await DataStorage.getAssets();
    let totalValuation = 0;

    // get assets from storage
    const assetsToList = Object.values(assets);
    // fetch and update their market prices
    await PriceOracle.refreshPrices();
    // update the data to display
    const prices = await DataStorage.getPrices();
    for (let index = 0; index < assetsToList.length; index += 1) {
      const { ticker } = assetsToList[index].coin;
      const coinPrice = prices[ticker] || null;
      if (coinPrice !== null) {
        assetsToList[index].price = prices[ticker].price || 0;
        assetsToList[index].variation = prices[ticker].variation || 0;
      } else {
        assetsToList[index].price = 0;
        assetsToList[index].variation = 0;
      }
      assetsToList[index].valuation = assetsToList[index].price * assetsToList[index].amount;
      totalValuation += assetsToList[index].valuation;
    }

    // update the total valuation
    this.props.navigation.setParams({ totalValuation });

    // add the assets to the state
    this.setState(prevState => ({
      ...prevState,
      assets: assetsToList,
      refreshing: false,
    }));
  };

  onDidFocus = (payload) => {
    if (this.props.navigation.getParam('refresh', false)) {
      this.onRefresh();
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={this.onDidFocus} />
        <View style={styles.listContainer}>
          <FlatList
            style={styles.list}
            contentContainerStyle={styles.listContentContainer}
            data={this.state.assets}
            keyExtractor={item => item.coin.ticker}
            renderItem={({ item }) => <AssetItem asset={item} onPressItem={this.onPressItem} />}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            ListEmptyComponent={(
              <Text style={styles.listEmptyContent}>
                {this.state.refreshing ? '(loading...)' : '(no assets)'}
              </Text>
)}
          />
        </View>
        <View style={styles.footerContainer}>
          <AddCoinButton onPress={() => this.props.navigation.navigate('AssetAddScreen')} />
        </View>
      </View>
    );
  }
}
