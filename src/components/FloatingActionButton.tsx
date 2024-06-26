import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  GestureResponderEvent,
} from 'react-native';

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF0000',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    position: 'absolute',
    right: 20,
    bottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 35,
  },
});

interface FABProps {
  text: string;
  onPress: (event: GestureResponderEvent) => void;
}

export default function FAB({text, onPress}: FABProps) {
  // const textColor = this.props.selected ? "red" : "black"
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}
