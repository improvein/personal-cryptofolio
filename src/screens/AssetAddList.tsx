import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CoinListItem} from '../components';
import DataStorage from '../data/DataStorage';
import {colors} from '../utils';
import {Coin} from '../types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainStackParamList} from '../RouteNav';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 30,
    width: '95%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 25,
    color: colors.WHITE,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
  },
  backArrowContainer: {
    position: 'absolute',
    top: 35,
  },
  contentContainer: {
    flex: 1,
    width: '95%',
    alignSelf: 'center',
  },
  searchInput: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: colors.WHITE,
    marginVertical: 20,
    height: 40,
    borderRadius: 8,
    paddingLeft: 10,
  },
});

interface AssetAddListProps
  extends NativeStackScreenProps<MainStackParamList, 'AssetAddListScreen'> {}

export default function AssetAddListScreen({navigation}: AssetAddListProps) {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>();

  useEffect(() => {
    DataStorage.getAssets().then(assets => {
      const excludedTickers = Object.keys(assets);

      DataStorage.getCoins().then(storedCoins => {
        // remove the excluded tickets from the initial coins list
        storedCoins = storedCoins.filter(
          coin => !excludedTickers.includes(coin.ticker),
        );

        // prepare the initial coins to show (stateCoins)
        const stateCoins: Coin[] = [];
        storedCoins.forEach(coin => {
          stateCoins.push(coin);
        });

        // add the coins to the state
        setCoins(stateCoins);
        setFilteredCoins(stateCoins);
      });
    });
  }, []);

  function onSelectCoin(item: Coin) {
    navigation.navigate('AssetAddDetailScreen', {coin: item});
  }

  function onSearchTextChange(text: string) {
    // filter the coins
    const newFilteredCoins = coins.filter(coin => {
      const fullSearchString = `${coin.ticker.toLowerCase()} ${coin.name.toLowerCase()}`;
      return fullSearchString.includes(text.toLowerCase());
    });
    // reset the state
    setFilteredCoins(newFilteredCoins);
  }

  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      colors={[colors.PRIMARY_COLOR_LIGHTER, colors.PRIMARY_COLOR_DARKER]}
      style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backArrowContainer}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={30} color={colors.WHITE} />
        </TouchableOpacity>
        <Text style={styles.title}>Select coin</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Filter coins..."
          underlineColorAndroid="transparent"
          returnKeyType="search"
          onChangeText={onSearchTextChange}
        />
      </View>
      <View style={styles.contentContainer}>
        <FlatList
          keyExtractor={item => item.ticker}
          data={filteredCoins}
          renderItem={({item}) => (
            <CoinListItem coin={item} onPressItem={onSelectCoin} />
          )}
        />
      </View>
    </LinearGradient>
  );
}
