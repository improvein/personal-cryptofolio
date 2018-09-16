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
      console.log('Loading the coins.');
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

  loadCoins = () => {
    const coinPickerItems = [];
    this.state.coins.forEach((coin) => {
      const itemDescription = `${coin.ticker.toUpperCase()} - ${coin.name}`;
      coinPickerItems.push(
        <Picker.Item key={coin.picker} label={itemDescription} value={coin} />,
      );
    });

    return coinPickerItems;
  };

  onConfirm = () => {
    const { navigate } = this.props.navigation;
    console.log('Selected coin', this.state.selectedCoin);
    navigate('AssetListScreen');
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
          {this.loadCoins()}
        </Picker>
        <Button onPress={this.onConfirm} title="Add" />
      </View>
    );
  }
}
