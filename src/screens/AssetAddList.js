import React from 'react';
import {
  FlatList, StyleSheet, Text, TouchableOpacity, TextInput, View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CoinListItem } from '../components';
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
  title: {
    fontSize: 25,
    color: colors.WHITE,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
  },
  backArrowContainer: {
    position: 'absolute',
    top: 10,
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
        filteredCoins: stateCoins,
      }));
    });
  }

  onSelectCoin = (item) => {
    // this.setState({ selectedCoin: item });
    this.props.navigation.navigate('AssetAddDetailScreen', { coin: item });
  };

  onSearchTextChange = (text) => {
    // filter the coins
    const filteredCoins = this.state.coins.filter((coin) => {
      const fullSearchString = `${coin.ticker.toLowerCase()} ${coin.name.toLowerCase()}`;
      return fullSearchString.includes(text.toLowerCase());
    });
    // reset the state
    this.setState({
      filteredCoins,
    });
  };

  render() {
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={[colors.PRIMARY_COLOR_LIGHTER, colors.PRIMARY_COLOR_DARKER]}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backArrowContainer}
            onPress={() => this.props.navigation.goBack()}
          >
            <Icon name="arrow-left" size={30} color={colors.WHITE} />
          </TouchableOpacity>
          <Text style={styles.title}>Select coin</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Filter coins..."
            underlineColorAndroid="transparent"
            returnKeyType="search"
            onChangeText={this.onSearchTextChange}
          />
        </View>
        <View style={styles.contentContainer}>
          <FlatList
            keyExtractor={item => item.ticker}
            data={this.state.filteredCoins}
            renderItem={({ item }) => <CoinListItem coin={item} onPressItem={this.onSelectCoin} />}
          />
        </View>
      </LinearGradient>
    );
  }
}
