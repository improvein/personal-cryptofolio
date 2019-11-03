import React, { Component } from 'react';
import {
  Text, StyleSheet, TouchableOpacity, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../utils';

const styles = StyleSheet.create({
  container: {
    borderColor: colors.PRIMARY_COLOR_DARKER,
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 8,
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.SHADOW,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  buttonText: {
    color: colors.PRIMARY_COLOR_DARKER,
    fontSize: 20,
  },
  plusContainer: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: colors.PRIMARY_COLOR_DARKER,
    borderRadius: 20,
    borderStyle: 'solid',
    marginRight: 25,
  },
  plus: {
    color: colors.PRIMARY_COLOR_DARKER,
    fontSize: 40,
    position: 'absolute',
    top: -8,
    left: -2,
  },
});

class componentName extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
        <Icon name="plus-circle-outline" size={40} color={colors.PRIMARY_COLOR_DARKER} />
        <Text style={styles.buttonText}> ADD ASSET </Text>
      </TouchableOpacity>
    );
  }
}

export default componentName;
