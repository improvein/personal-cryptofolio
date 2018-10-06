import React from 'react';
import {
  TextInput, StyleSheet, View, FlatList, TouchableOpacity,
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

  onSelectCoin = (item) => {
    // this.setState({ selectedCoin: item });
    this.props.navigation.navigate('AssetAddDetailScreen', { coin: item });
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
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon name="arrow-left" size={30} color={colors.WHITE} />
          </TouchableOpacity>
          <TextInput style={styles.input} placeholder="Name of the coin..." />
        </View>
        <View style={styles.contentContainer}>
          <FlatList
            keyExtractor={item => item.ticker}
            data={this.state.coins}
            renderItem={({ item }) => <CoinListItem coin={item} onPressItem={this.onSelectCoin} />}
          />
        </View>
      </LinearGradient>
    );
  }
}
