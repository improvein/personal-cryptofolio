import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DataStorage from '../data/DataStorage';
import {colors} from '../utils';
import {SecondaryButton} from '../components';
import PriceOracle from '../data/PriceOracle';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainStackParamList} from '../RouteNav';
import {Coin, PriceSourceEntry} from '../types';

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
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    color: colors.WHITE,
  },
  exchangePicker: {
    width: '100%',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 50,
    color: colors.WHITE,
  },
  amount: {
    fontSize: 20,
    color: colors.WHITE,
    marginBottom: 15,
  },
  price: {
    fontSize: 45,
    color: colors.WHITE,
    marginBottom: 100,
  },
  buttonContainer: {
    width: '90%',
    alignSelf: 'center',
  },
});

interface AssetAddDetailProps
  extends NativeStackScreenProps<MainStackParamList, 'AssetAddDetailScreen'> {}

export default function AssetAddDetail({
  navigation,
  route,
}: AssetAddDetailProps) {
  const [coin] = useState<Coin>(route.params.coin);
  const [price, setPrice] = useState<number>(0);
  const [priceSources, setPriceSources] = useState<PriceSourceEntry[]>([]);
  const [priceSourceCode, setPriceSourceCode] = useState<string>();

  useEffect(() => {
    // get the available price sources for this coin
    const priceSourcesAvailable = PriceOracle.getSources();
    const availabelPriceSourcesForAsset = priceSourcesAvailable.filter(
      priceSource => coin.availablePriceSources.includes(priceSource.code),
    );

    // initialize state
    setPriceSources(availabelPriceSourcesForAsset);
  }, [coin.availablePriceSources]);

  function onAdd() {
    if (coin && priceSourceCode) {
      DataStorage.addAsset(coin, priceSourceCode).then(() => {
        // go back to the main list
        navigation.navigate('AssetListScreen', {refresh: true});
      });
    }
  }

  async function onPriceSourceChange(itemValue: string) {
    let updatedPrice = 0;
    if (itemValue !== '') {
      // fetch and update the price
      updatedPrice = await PriceOracle.fetchPrice(itemValue, coin.ticker);
    }

    // update the state
    setPriceSourceCode(itemValue);
    setPrice(updatedPrice);
  }

  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      colors={[colors.PRIMARY_COLOR_LIGHTER, colors.PRIMARY_COLOR_DARKER]}
      style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backArrowContainer}>
          <Icon name="arrow-left" size={30} color={colors.WHITE} />
        </TouchableOpacity>
        <Text style={styles.title}>{`${coin.ticker}/USD`}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.label}>Price source</Text>
        <Picker
          selectedValue={priceSourceCode}
          style={styles.exchangePicker}
          onValueChange={onPriceSourceChange}>
          <Picker.Item label="(No price)" value="" key="" />
          {priceSources.map(exchange => (
            <Picker.Item
              label={exchange.name}
              value={exchange.code}
              key={exchange.code}
            />
          ))}
        </Picker>
        <Text style={styles.amount}>{`1 ${coin.ticker} /`}</Text>
        <Text style={styles.price}>{`USD ${price.toFixed(0)}`}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <SecondaryButton text="DONE" onPress={onAdd} />
      </View>
    </LinearGradient>
  );
}
