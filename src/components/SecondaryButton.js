import React, { Component } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../utils';

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: colors.WHITE,
    height: 60,
    marginVertical: 15,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    color: colors.PRIMARY_COLOR_DARKER,
    fontWeight: 'bold',
  },
});

class SecondaryButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
        <Text style={styles.text}>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
}

export default SecondaryButton;
