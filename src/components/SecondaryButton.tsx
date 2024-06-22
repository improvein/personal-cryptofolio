import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import {colors} from '../utils';

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

interface SecondaryButtonProps {
  theme?: 'dark' | 'light';
  text: string;
  onPress: (event: GestureResponderEvent) => void;
}

export default function SecondaryButton({
  theme = 'light',
  text,
  onPress,
}: SecondaryButtonProps) {
  const themeStyleContainer: any = {};
  const themeStyleText: any = {};
  if (theme === 'dark') {
    themeStyleContainer.backgroundColor = colors.PRIMARY_COLOR_DARKER;
    themeStyleText.color = colors.WHITE;
  }

  return (
    <TouchableOpacity
      style={[styles.container, themeStyleContainer]}
      onPress={onPress}>
      <Text style={[styles.text, themeStyleText]}>{text}</Text>
    </TouchableOpacity>
  );
}
