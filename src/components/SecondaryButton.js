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
    this.state = {};
  }

  render() {
    const themeStyleContainer = {};
    const themeStyleText = {};
    const theme = this.props.theme || 'light';
    if (theme === 'dark') {
      themeStyleContainer.backgroundColor = colors.PRIMARY_COLOR_DARKER;
      themeStyleText.color = colors.WHITE;
    }

    return (
      <TouchableOpacity
        style={[styles.container, themeStyleContainer]}
        onPress={this.props.onPress}
      >
        <Text style={[styles.text, themeStyleText]}>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
}

export default SecondaryButton;
