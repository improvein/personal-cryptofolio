import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {MainStackParamList} from '../RouteNav';
import Header from './Header';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {colors} from '../utils';

const styles = StyleSheet.create({
  totalAmount: {
    color: colors.WHITE,
    fontSize: 35,
    alignSelf: 'center',
    letterSpacing: 2,
  },
  settingsButton: {
    // alignSelf: 'flex-end',
    position: 'absolute',
    top: -40,
    right: 10,
  },
});

interface AssetListScreenHeaderProps
  extends NativeStackScreenProps<MainStackParamList, 'AssetListScreen'> {}

export default function AssetListScreenHeader({
  navigation,
  route,
}: AssetListScreenHeaderProps) {
  const totalValuation = route.params.totalValuation ?? 0;

  return (
    <Header title="Personal CryptoFolio">
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('StatsScreen');
        }}>
        <Text style={styles.totalAmount}>{`$ ${totalValuation.toFixed(
          2,
        )}`}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => {
          navigation.navigate('SettingsScreen');
        }}>
        <Icon name="settings" size={30} color={colors.WHITE} />
      </TouchableOpacity>
    </Header>
  );
}
