import { AsyncStorage } from 'react-native';
import coinsLogos from '../assets';

const DATA_COINS = '@Data:coins';
const DATA_ASSETS = '@Data:assets';
const DATA_ASSET_HIST = '@Data:assethist_';

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
      returnedValue = (await AsyncStorage.getItem(DATA_ASSETS)) || '{}';
      returnedValue = JSON.parse(returnedValue);
    } catch (error) {
      throw error;
    }
    return returnedValue;
  };

  /**
   * Get the assets in the portfolio
   * @param {object} asset Asset to get the history from
   * @returns List of asset transactions history
   */
  static getAssetHistory = async (asset) => {
    const { ticker } = asset;
    let returnedValue = null;
    try {
      returnedValue = (await AsyncStorage.getItem(DATA_ASSET_HIST + ticker)) || '[]';
      returnedValue = JSON.parse(returnedValue);
    } catch (error) {
      throw error;
    }
    return returnedValue;
  };

  /**
   * Add an asset to the portfolio
   * @param {object} coin
   */
  static addAsset = async (coin) => {
    const assets = await DataStorage.getAssets();
    console.log('Existing assets: ', assets);
    // initialize new asset
    assets[coin.ticker] = {
      coin,
      amount: 0,
    };
    try {
      // store asset
      console.log('To save: ', assets);
      await AsyncStorage.setItem(DATA_ASSETS, JSON.stringify(assets));
    } catch (error) {
      // Error saving data
      throw error;
    }
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
