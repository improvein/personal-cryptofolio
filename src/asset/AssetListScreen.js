import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { AssetItem } from './index';
import { FloatingActionButton } from '../components';
import DataStorage from '../data/DataStorage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    elevation: 1,
  },
});

export default class AssetListScreen extends React.Component {
  static navigationOptions = {
    title: 'Assets',
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
