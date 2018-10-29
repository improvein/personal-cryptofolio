import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { colors } from '../utils';

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: colors.WHITE,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 5,
    marginRight: 5,
    elevation: 3,
    shadowColor: colors.SHADOW,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  title: {
    fontWeight: 'bold',
  },
  text: {
    fontSize: 15,
    textAlign: 'right',
  },
});

class AssetInfoBox extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.title}</Text>
        <Text style={styles.text}>
          {this.props.text}
          {this.props.children}
        </Text>
      </View>
    );
  }
}

export default AssetInfoBox;
