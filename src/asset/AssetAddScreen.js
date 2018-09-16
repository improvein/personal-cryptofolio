import React from 'react';
import {
  Button, Picker, StyleSheet, Text, View,
} from 'react-native';
import DataStorage from '../data/DataStorage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  picker: {
    width: '100%',
  },
});

export default class AssetAddScreen extends React.Component {
  static navigationOptions = {
    title: 'Add Asset',
  };

  constructor(props) {
    super(props);
    // on pres event handler
    this.state = {
      selectedCoin: null,
      coins: [],
    };
  }

  componentWillMount() {
    DataStorage.getCoins().then((coins) => {
      const stateCoins = [];
      coins.forEach((coin) => {
        stateCoins.push(coin);
      });
      // add the coins to the state
      this.setState(prevState => ({
        ...prevState,
        coins: stateCoins,
      }));
    });
  }

  onConfirm = () => {
    const coinToAdd = this.state.selectedCoin;
    if (coinToAdd !== null) {
      DataStorage.addAsset(coinToAdd).then(() => {
        console.log(`Asset added ${coinToAdd.ticker}`);
      });

      // go back to the list
      const { navigate } = this.props.navigation;
      navigate('AssetListScreen');
    }
  };

  render() {
    return (
      <View styles={styles.container}>
        <Text>Add a new asset to your portfolio</Text>
        <Picker
          selectedValue={this.state.selectedCoin}
          style={styles.picker}
          onValueChange={itemValue => this.setState(prevState => ({
            ...prevState,
            selectedCoin: itemValue,
          }))
          }
        >
          {this.state.coins.map(coin => (
            <Picker.Item
              label={`${coin.ticker.toUpperCase()} - ${coin.name}`}
              value={coin}
              key={coin.ticker}
            />
          ))}
        </Picker>
        <Button onPress={this.onConfirm} title="Add" />
      </View>
    );
  }
}
