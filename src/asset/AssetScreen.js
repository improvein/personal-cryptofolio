import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default class AssetAddScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.asset.coin.ticker}`,
  });

  render() {
    return (
      <View styles={styles.container}>
        <Text>This is an asset</Text>
      </View>
    );
  }
}
