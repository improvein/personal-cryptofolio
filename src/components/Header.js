import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { screen, colors } from '../utils';

const styles = StyleSheet.create({
  container: {
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

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={[colors.PRIMARY_COLOR_LIGHTER, colors.PRIMARY_COLOR_DARKER]}
        style={styles.container}
      >
        {this.props.enableBackArrow && (
          <TouchableOpacity style={styles.backArrowContainer} onPress={this.props.onBackArrowPress}>
            <Icon name="arrow-left" size={30} color={colors.WHITE} />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>{this.props.title}</Text>
        <View style={styles.contentContainer}>{this.props.children}</View>
      </LinearGradient>
    );
  }
}

export default Header;
