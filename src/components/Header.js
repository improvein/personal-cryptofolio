import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { screen, colors } from '../utils';

const styles = StyleSheet.create({
  container: {
    height: screen.hp(25),
    backgroundColor: colors.PRIMARY_COLOR,
    paddingTop: 30,
  },
  headerTitle: {
    color: colors.WHITE,
    fontSize: 25,
    alignSelf: 'center',
    paddingVertical: screen.hp(1),
  },
  contentContainer: {
    flex: 1,
    paddingVertical: screen.hp(2),
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
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={[colors.PRIMARY_COLOR_LIGHTER, colors.PRIMARY_COLOR_DARKER]}
        style={styles.container}
      >
        <Text style={styles.headerTitle}>
          {this.props.title}
        </Text>
        <View style={styles.contentContainer}>
          {this.props.children}
        </View>
      </LinearGradient>
    );
  }
}

export default Header;
