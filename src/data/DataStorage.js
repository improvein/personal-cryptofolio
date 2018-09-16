import { AsyncStorage } from 'react-native';
import coinsLogos from '../assets';

const DATA_COINS = '@Data:assets';
const DATA_ASSETS = '@Data:assets';

class DataStorage {
  /**
   * Get the available assets
   * @returns List of assets
   */
  static getCoins = async () => {
    let returnedValue = null;
    try {
      returnedValue = (await AsyncStorage.getItem(DATA_COINS)) || '[]';
      returnedValue = JSON.parse(returnedValue);
    } catch (error) {
      console.error('Getting coins', error);
      throw error;
    }
    return returnedValue;
  };

  /**
   * Get the assets in the portfolio
   * @returns List of assets
   */
  static getAssets = async () => {
    let returnedValue = null;
    try {
      returnedValue = await AsyncStorage.getItem(DATA_ASSETS);
      if (returnedValue !== null) {
        returnedValue = JSON.parse(returnedValue);
      } else {
        returnedValue = [];
      }
    } catch (error) {
      throw error;
    }
    return returnedValue;
  };

  /**
   * Add an asset to the portfolio
   * @param {object} coin
   */
  static addAsset = (coin) => {
    const assets = DataStorage.getAssets();
    // initialize new asset
    assets[coin.ticker] = {
      coin,
      amount: 0,
    };
    // store asset
    const storedData = async () => {
      try {
        await AsyncStorage.setItem(DATA_ASSETS, JSON.stringify(assets));
      } catch (error) {
        // Error saving data
        throw error;
      }
    };

    return storedData;
  };

  /**
   * Initialize data for the app
   */
  static initialize = () => {
    // --- initialize coins
    DataStorage.getCoins().then((coinsFound) => {
      if (coinsFound === null || coinsFound.length === 0) {
        const coins = [
          {
            ticker: 'BTC',
            name: 'Bitcoin',
            logo: coinsLogos.btc,
          },
          { ticker: 'BCH', name: 'Bitcoin Cash' },
          {
            ticker: 'ETH',
            name: 'Ethereum',
            logo: coinsLogos.eth,
          },
          { ticker: 'IOTA', name: 'IOTA' },
          { ticker: 'LTC', name: 'Litecoin' },
          { ticker: 'XMR', name: 'Monero' },
        ];
        // save default coins
        const storedData = async () => {
          try {
            await AsyncStorage.setItem(DATA_COINS, JSON.stringify(coins));
          } catch (error) {
            // Error saving data
            throw error;
          }
        };
        storedData().then(() => console.log('Coins saved'));
      }
    });
  };
}

export default DataStorage;
