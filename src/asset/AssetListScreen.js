import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import AssetItem from './AssetItem';
import FAB from '../components/FloatingActionButton';
import coins from '../assets';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default class AssetListScreen extends React.Component {
  static navigationOptions = {
    title: 'Assets',
  };

  // constructor(props) {
  //   super(props);
  // }

  onPressItem = (item) => {
    console.log(`Item pressed: ${item.ticker}`);
  };

  render() {
    const { navigate } = this.props.navigation;
    const assetsData = [
      {
        id: 1,
        ticker: 'BTC',
        name: 'Bitcoin',
        logo: coins.btc,
      },
      {
        id: 2,
        ticker: 'ETH',
        name: 'Ethereum',
        logo: coins.eth,
      },
      { id: 3, ticker: 'XMR', name: 'Monero' },
    ];

    return (
      <View styles={styles.container}>
        <FlatList
          data={assetsData}
          keyExtractor={item => item.ticker}
          renderItem={({ item }) => <AssetItem asset={item} onPressItem={this.onPressItem} />}
        />
        <FAB
          onPress={() => {
            navigate('AssetAddScreen');
          }}
        />
      </View>
    );
  }
}
