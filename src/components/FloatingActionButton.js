import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF0000',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 25,
    position: 'absolute',
    zIndex: 30,
    bottom: 10,
    right: 10,
    width: 50,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    width: 50,
    height: 50,
  },
});

class FAB extends React.Component {
  render() {
    // const textColor = this.props.selected ? "red" : "black"
    return (
      <TouchableOpacity style={styles.button} onPress={this.props.onPress}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
    );
  }
}

export default FAB;
