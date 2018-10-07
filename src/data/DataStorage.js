import { AsyncStorage } from 'react-native';
import coinsLogos from '../assets';

const DATA_ASSETS = '@Data:assets';
const DATA_ASSET_HIST = '@Data:assethist_';
const DATA_PRICES = '@Data:prices';

class DataStorage {
  /**
   * Get the available assets
   * @returns List of assets
   */
  static getCoins = async () => {
    const coins = [
      {
        ticker: 'BTC',
        name: 'Bitcoin',
        logo: coinsLogos.btc,
      },
      {
        ticker: 'BCH',
        name: 'Bitcoin Cash',
        logo: coinsLogos.bch,
      },
      {
        ticker: 'ADA',
        name: 'Cardano',
        logo: coinsLogos.ada,
      },
      { ticker: 'EOS', name: 'EOS' },
      {
        ticker: 'ETH',
        name: 'Ethereum',
        logo: coinsLogos.eth,
      },
      { ticker: 'IOTA', name: 'IOTA' },
      {
        ticker: 'LTC',
        name: 'Litecoin',
        logo: coinsLogos.ltc,
      },
      {
        ticker: 'XMR',
        name: 'Monero',
        logo: coinsLogos.xmr,
      },
    ];
    return coins;
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
  static addAsset = async (coin, priceSourceCode) => {
    const assets = await DataStorage.getAssets();
    // initialize new asset
    assets[coin.ticker] = {
      coin,
      amount: 0,
      priceSourceCode,
    };
    try {
      // store updated assets
      await AsyncStorage.setItem(DATA_ASSETS, JSON.stringify(assets));
    } catch (error) {
      // Error saving data
      throw error;
    }
  };

  static removeAsset = async (ticker) => {
    const assets = await DataStorage.getAssets();
    // clear the asset
    delete assets[ticker];
    try {
      // store updated assets
      await AsyncStorage.setItem(DATA_ASSETS, JSON.stringify(assets));
    } catch (error) {
      // Error saving data
      throw error;
    }
  };

  /**
   * Get the prices locally stored
   * @returns Coin prices from price sources
   */
  static getPrices = async () => {
    let returnedValue = null;
    try {
      returnedValue = (await AsyncStorage.getItem(DATA_PRICES)) || '{}';
      returnedValue = JSON.parse(returnedValue);
    } catch (error) {
      throw error;
    }
    return returnedValue;
  };

  static updatePrices = async (newPrices) => {
    const prices = await DataStorage.getPrices();
    newPrices.forEach((priceData) => {
      prices[priceData.ticker] = priceData.price;
    });
    try {
      // store updated prices
      await AsyncStorage.setItem(DATA_PRICES, JSON.stringify(prices));
    } catch (error) {
      // Error saving data
      throw error;
    }
  };
}

export default DataStorage;
