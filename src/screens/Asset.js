import React from 'react';
import {
  Alert, Button, Image, StyleSheet, Text, View,
} from 'react-native';
import DataStorage from '../data/DataStorage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
  },
  logo: {
    flex: 0,
    width: 50,
    height: 50,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  headerContent: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
});

export default class AssetAdd extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.asset.coin.name}`,
    headerRight: <Button onPress={navigation.getParam('removeAsset') || (() => {})} title="X" />,
  });

  componentDidMount() {
    this.props.navigation.setParams({ removeAsset: this.removeAsset });
  }

  removeAsset = () => {
    Alert.alert(
      'Remove asset',
      'Are you sure you want to remove the asset from your portfolio?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            const { asset } = this.props.navigation.state.params;
            DataStorage.removeAsset(asset.coin.ticker).then(() => {
              this.props.navigation.navigate('AssetListScreen');
            });
          },
        },
      ],
      { cancelable: false },
    );
  };

  render() {
    const { asset } = this.props.navigation.state.params;
    return (
      <View styles={styles.container}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Image source={asset.coin.logo} style={styles.logoImage} />
          </View>
          <View style={styles.headerContent}>
            <Text>{asset.coin.ticker}</Text>
            <Text>{asset.coin.name}</Text>
          </View>
          <View>
            <Text>{asset.amount}</Text>
          </View>
        </View>
      </View>
    );
  }
}
