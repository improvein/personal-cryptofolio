import React from 'react';
import {
  Button, Picker, StyleSheet, Text, View,
} from 'react-native';

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
      selectedCoin: 'btc',
    };
  }

  onConfirm = () => {
    const { navigate } = this.props.navigation;
    console.log('Acepted!');
    navigate('AssetListScreen');
  };

  render() {
    return (
      <View styles={styles.container}>
        <Text>Add a new asset to your portfolio</Text>
        <Picker
          selectedValue={this.state.selectedCoin}
          style={styles.picker}
          onValueChange={itemValue => this.setState({ selectedCoin: itemValue })}
        >
          <Picker.Item label="BTC (Bitcoin)" value="btc" />
          <Picker.Item label="BCH (Bitcoin Cash)" value="bch" />
          <Picker.Item label="ETH (Ethereum)" value="eth" />
          <Picker.Item label="IOTA (IOTA)" value="iota" />
          <Picker.Item label="LTC (Litecoin)" value="ltc" />
          <Picker.Item label="XMR (Monero)" value="xmr" />
        </Picker>
        <Button onPress={this.onConfirm} title="Add" />
      </View>
    );
  }
}
