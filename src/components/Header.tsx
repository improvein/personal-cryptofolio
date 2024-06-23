import React, {PropsWithChildren} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {screen, colors} from '../utils';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: screen.hp(20),
    backgroundColor: colors.PRIMARY_COLOR,
    paddingTop: 20,
  },
  headerTitle: {
    color: colors.WHITE,
    fontSize: 25,
    alignSelf: 'center',
    paddingVertical: screen.hp(0.5),
  },
  backArrowContainer: {
    position: 'absolute',
    top: 10,
    left: 5,
  },
  contentContainer: {
    flex: 1,
    paddingVertical: screen.hp(1),
  },
});

interface HeaderProps extends PropsWithChildren {
  title: string;
  enableBackArrow?: boolean;
  onBackArrowPress?: (event: GestureResponderEvent) => void;
}

export default function Header({
  title,
  children,
  enableBackArrow,
  onBackArrowPress,
}: HeaderProps) {
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      colors={[colors.PRIMARY_COLOR_LIGHTER, colors.PRIMARY_COLOR_DARKER]}
      style={styles.container}>
      {enableBackArrow && (
        <TouchableOpacity
          style={styles.backArrowContainer}
          onPress={onBackArrowPress}>
          <Icon name="arrow-left" size={30} color={colors.WHITE} />
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.contentContainer}>{children}</View>
    </LinearGradient>
  );
}
