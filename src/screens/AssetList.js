import React from 'react';
import {
  FlatList, StyleSheet, View, Text,
} from 'react-native';
import { AssetItem, Header, AddCoinButton } from '../components';
import DataStorage from '../data/DataStorage';
import { colors } from '../utils';
// import coinsLogos from '../assets';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  contentContainerStyle: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  totalAmount: {
    color: colors.WHITE,
    fontSize: 40,
    alignSelf: 'center',
    letterSpacing: 2,
  },
  totalAmountText: {
    fontSize: 20,
    color: colors.WHITE,
    alignSelf: 'center',
  },
  listContentContainer: {
    width: '100%',
    alignItems: 'center',
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
  static navigationOptions = {
    header: (
      <Header title="CryptoFolio">
        <Text style={styles.totalAmount}>$ 1,234.00</Text>
        <Text style={styles.totalAmountText}>Total Amount</Text>
      </Header>
    ),
  };

  constructor(props) {
    super(props);
    // on pres event handler
    this.state = {
      assets: [],
      refreshing: false,
    };
  }

  componentDidMount() {
    // load assets from storage
    this.retrieveAssets();
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
      () => {
        this.retrieveAssets();
      },
    );
  };

  retrieveAssets() {
    DataStorage.getAssets().then((assets) => {
      // add the assets to the state
      // first take only the actual assets (values)
      const assetsToList = Object.values(assets);
      this.setState(prevState => ({
        ...prevState,
        assets: assetsToList,
        refreshing: false,
      }));
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainerStyle}>
          <FlatList
            style={styles.list}
            contentContainerStyle={styles.listContentContainer}
            data={this.state.assets}
            keyExtractor={item => item.coin.ticker}
            renderItem={({ item }) => <AssetItem asset={item} onPressItem={this.onPressItem} />}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        </View>
        <View style={styles.footerContainer}>
          <AddCoinButton onPress={() => this.props.navigation.navigate('AssetAddScreen')} />
        </View>
      </View>
    );
  }
}
