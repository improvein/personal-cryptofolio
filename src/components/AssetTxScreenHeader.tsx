import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Header} from '../components';
import {MainStackParamList} from '../RouteNav';
import {colors} from '../utils';

interface AssetTxScreenHeaderProps
  extends NativeStackScreenProps<MainStackParamList, 'AssetTxScreen'> {}

const styles = StyleSheet.create({
  headerChildren: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    width: '100%',
  },
  headerChildrenLeft: {
    flex: 1,
    flexDirection: 'column',
  },
  assetName: {
    color: colors.WHITE,
    fontSize: 10,
    textAlign: 'left',
    letterSpacing: 2,
  },
  currentPrice: {
    color: colors.WHITE,
    fontSize: 15,
    textAlign: 'left',
    letterSpacing: 2,
  },
  deleteButton: {
    // alignSelf: 'flex-end',
    // padding: 5,
    position: 'absolute',
    top: -30,
    right: 10,
  },
});

export default function AssetTxScreenHeader({
  navigation,
  route,
}: AssetTxScreenHeaderProps) {
  const currentPrice = route.params.currentPrice ?? 0;
  const isNew = route.params.isNew ?? true;

  return (
    <Header
      title={`${isNew ? 'Add' : 'Edit'} Transaction`}
      enableBackArrow={true}
      onBackArrowPress={() => navigation.goBack()}>
      <View style={styles.headerChildren}>
        <View style={styles.headerChildrenLeft}>
          <Text style={styles.assetName}>{route.params.asset.coin.name}</Text>
          <Text style={styles.currentPrice}>{`$ ${currentPrice.toFixed(
            2,
          )}`}</Text>
        </View>
      </View>
      {isNew ? (
        <View style={styles.deleteButton} />
      ) : (
        <TouchableOpacity style={styles.deleteButton}>
          <Icon
            onPress={route.params.onRemoveTransaction}
            name="delete"
            size={20}
            color={colors.WHITE}
          />
        </TouchableOpacity>
      )}
    </Header>
  );
}
