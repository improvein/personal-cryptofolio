import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import screen from '../utils/screen';

const styles = StyleSheet.create({
  container: {
    height: screen.hp(20),
    backgroundColor: 'black',
  },
});

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text> textInComponent </Text>
      </View>
    );
  }
}

export default Header;
