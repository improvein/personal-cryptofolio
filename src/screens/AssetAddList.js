import React from 'react';
import {
  TextInput, StyleSheet, Text, View, FlatList, Image, TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DataStorage from '../data/DataStorage';
import { colors } from '../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 30,
    width: '95%',
    alignSelf: 'center',
  },
  contentContainer: {
    flex: 1,
    width: '95%',
    alignSelf: 'center',
  },
  input: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: colors.WHITE,
    marginVertical: 20,
    height: 40,
    borderRadius: 8,
    paddingLeft: 10,
  },
  itemContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    height: 60,
    width: '100%',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  logoContianer: {
    width: '15%',
    borderRightColor: colors.BLACK,
    borderRightWidth: 1,
  },
  logo: {
    width: 30,
    height: 30,
  },
  nameContainer: {
    width: '45%',
    paddingLeft: 15,
  },
  names: {
    fontSize: 16,
  },
  proceContainer: {
    width: '40%',
    paddingLeft: 10,
  },
  price: {
    textAlign: 'right',
    fontSize: 18,
  },
});

export default class AssetAddList extends React.Component {
  static navigationOptions = {
    title: 'Add Asset List',
    header: null,
  };

  constructor(props) {
    super(props);
    // on pres event handler
    this.state = {
      selectedCoin: null,
      coins: [],
    };
  }

  componentDidMount() {
    DataStorage.getCoins().then((coins) => {
      const stateCoins = [];
      coins.forEach((coin) => {
        stateCoins.push(coin);
      });
      // add the coins to the state
      this.setState(prevState => ({
        ...prevState,
        coins: stateCoins,
      }));
    });
  }

  renderCoinItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => this.props.navigation.navigate('AssetAddDetailScreen', { coin: item })}
    >
      {/* TODO REMOVE THIS CONDITION WHEN ALL COINS HAVE LOGO */}
      <View style={styles.logoContianer}>
        {item.logo
          && <Image source={item.logo} style={styles.logo} />
        }
      </View>
      <View style={styles.nameContainer}>
        <Text style={styles.names}>
          {item.name}
          :
          {item.ticker}
        </Text>
      </View>
      <View style={styles.proceContainer}>
        <Text style={styles.price}>$7,225.00</Text>
      </View>
    </TouchableOpacity>
  );

  // onTap = () => {
  //   const coinToAdd = this.state.selectedCoin;
  //   if (coinToAdd !== null) {
  //     DataStorage.addAsset(coinToAdd).then(() => {
  //       console.log(`Asset added ${coinToAdd.ticker}`);
  //     });

  //     // go back to the list
  //     const { navigate } = this.props.navigation;
  //     navigate('AssetListScreen');
  //   }
  // };

  render() {
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={[colors.PRIMARY_COLOR_LIGHTER, colors.PRIMARY_COLOR_DARKER]}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Text>Back arrow</Text>
          </TouchableOpacity>
          <TextInput style={styles.input} placeholder="Name of the currency..." />
        </View>
        <View style={styles.contentContainer}>
          <FlatList
            keyExtractor={item => item.ticker}
            data={this.state.coins}
            renderItem={this.renderCoinItem}
          />
        </View>
      </LinearGradient>
    );
  }
}
