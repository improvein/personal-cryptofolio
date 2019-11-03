import React from 'react';
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { NavigationEvents } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AssetItem, Header, AddCoinButton } from '../components';
import DataStorage from '../data/DataStorage';
import PriceOracle from '../data/PriceOracle';
import { colors } from '../utils';

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

class AssetList extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const totalValuation = navigation.getParam('totalValuation', 0);
    return {
      header: (
        <Header title="Personal CryptoFolio">
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('StatsScreen');
            }}>
            <Text style={styles.totalAmount}>{`$ ${totalValuation.toFixed(2)}`}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => {
              navigation.navigate('SettingsScreen');
            }}>
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
    // load assets from storage (simulate manual refresh action)
    this.onRefresh();
  }

  onAddCoin = () => {
    const { navigation } = this.props;
    navigation.navigate('AssetAddScreen');
  };

  onPressItem = (item) => {
    const { navigation } = this.props;
    navigation.navigate('AssetScreen', { asset: item });
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
    const { navigation } = this.props;

    const assets = await DataStorage.getAssets();
    let totalValuation = 0;

    // get assets from storage
    const assetsToList = Object.values(assets);

    // fetch and update their market prices
    PriceOracle.refreshPrices()
      .then(() => {
        // update the data to display
        return DataStorage.getPrices();
      })
      .then((prices) => {
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
        navigation.setParams({ totalValuation });

        // add the assets to the state
        this.setState({
          assets: assetsToList,
          refreshing: false,
        });
      })
      .catch((error) => {
        console.warn(`Couldn't get prices.`, error);
        this.setState({
          refreshing: false,
        });
      });

    // add the assets to the state
    this.setState({
      assets: assetsToList,
    });
  };

  onDidFocus = (payload) => {
    const { navigation } = this.props;

    if (navigation.getParam('refresh', false)) {
      this.onRefresh();
    }
  };

  render() {
    const { assets, refreshing } = this.state;

    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={this.onDidFocus} />
        <View style={styles.listContainer}>
          <FlatList
            style={styles.list}
            contentContainerStyle={styles.listContentContainer}
            data={assets}
            keyExtractor={(item) => item.coin.ticker}
            renderItem={({ item }) => <AssetItem asset={item} onPressItem={this.onPressItem} />}
            refreshing={refreshing}
            onRefresh={this.onRefresh}
            ListEmptyComponent={
              <Text style={styles.listEmptyContent}>
                {refreshing ? '(loading...)' : '(no assets)'}
              </Text>
            }
          />
        </View>
        <View style={styles.footerContainer}>
          <AddCoinButton onPress={this.onAddCoin} />
        </View>
      </View>
    );
  }
}

AssetList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired,
  }).isRequired,
};

export default AssetList;
