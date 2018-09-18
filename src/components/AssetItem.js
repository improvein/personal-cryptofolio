import React from 'react';
import {
  Image, StyleSheet, TouchableOpacity, Text, View,
} from 'react-native';

const styles = StyleSheet.create({
  item: {
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
  itemContent: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
});

class AssetItem extends React.Component {
  /**
   * Press event handler
   */
  onPress = () => {
    this.props.onPressItem(this.props.asset);
  };

  /**
   * Long press event handler
   */
  onLongPress = () => {
    console.log('Long press');
  };

  render() {
    return (
      <TouchableOpacity onPress={this.onPress} onLongPress={this.onLongPress}>
        <View style={styles.item}>
          <View style={styles.logo}>
            <Image source={this.props.asset.coin.logo} style={styles.logoImage} />
          </View>
          <View style={styles.itemContent}>
            <Text>{this.props.asset.coin.ticker}</Text>
            <Text>{this.props.asset.coin.name}</Text>
          </View>
          <View>
            <Text>{this.props.asset.amount}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default AssetItem;
