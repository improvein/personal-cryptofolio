import React from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { FloatingActionButton, AssetItem, Header } from '../components';
import DataStorage from '../data/DataStorage';
import { colors } from '../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    elevation: 1,
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
});

export default class AssetList extends React.Component {
  static navigationOptions = {
    header:
      <Header title="CryptoFolio">
        <Text style={styles.totalAmount}>$ 1,234.00</Text>
        <Text style={styles.totalAmountText}>Total Amount</Text>
      </Header>,
  };

  constructor(props) {
    super(props);
    // on pres event handler
    this.state = {
      assets: [],
    };
  }

  componentWillMount() {
    // load assets from storage
    DataStorage.getAssets().then((assets) => {
      // add the assets to the state
      this.setState(prevState => ({
        ...prevState,
        assets,
      }));
    });
  }

  onPressItem = (item) => {
    const { navigate } = this.props.navigation;
    navigate('AssetScreen', { asset: item });
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={Object.values(this.state.assets)}
          keyExtractor={item => item.coin.ticker}
          renderItem={({ item }) => <AssetItem asset={item} onPressItem={this.onPressItem} />}
        />
        <FloatingActionButton
          text="+"
          onPress={() => {
            navigate('AssetAddScreen');
          }}
        />
      </View>
    );
  }
}
