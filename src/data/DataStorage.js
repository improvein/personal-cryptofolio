import { AsyncStorage } from 'react-native';
import coinsLogos from '../assets';

const DATA_ASSETS = '@Data:assets';
const DATA_ASSET_HIST = '@Data:assethist_';
const DATA_PRICES = '@Data:prices';
const DATA_PRICES_FETCHTIME = '@Data:prices_fetchtime';

class DataStorage {
  /**
   * Clears all internally stored data
   */
  static clearData = async () => {
    try {
      await AsyncStorage.removeItem(DATA_ASSETS);
      await AsyncStorage.removeItem(DATA_ASSET_HIST);
      await AsyncStorage.removeItem(DATA_PRICES);
      await AsyncStorage.removeItem(DATA_PRICES_FETCHTIME);
    } catch (error) {
      // Error saving data
      throw error;
    }
  };

  /**
   * Get the available assets.
   * Hard-coded data.
   * @returns List of assets
   */
  static getCoins = async () => {
    const coins = [
      {
        ticker: 'BTC',
        name: 'Bitcoin',
        logo: coinsLogos.btc,
        availablePriceSources: ['binance', 'bitfinex', 'bitstamp'],
      },
      {
        ticker: 'BCH',
        name: 'Bitcoin Cash',
        logo: coinsLogos.bch,
        availablePriceSources: ['bitfinex', 'bitstamp'],
      },
      {
        ticker: 'ADA',
        name: 'Cardano',
        logo: coinsLogos.ada,
        availablePriceSources: ['binance'],
      },
      {
        ticker: 'DASH',
        name: 'Dash',
        logo: coinsLogos.dash,
        availablePriceSources: ['bitfinex'],
      },
      {
        ticker: 'EOS',
        name: 'EOS',
        logo: coinsLogos.eos,
        availablePriceSources: ['binance', 'bitfinex'],
      },
      {
        ticker: 'ETH',
        name: 'Ethereum',
        logo: coinsLogos.eth,
        availablePriceSources: ['binance', 'bitfinex', 'bitstamp'],
      },
      {
        ticker: 'IOTA',
        name: 'IOTA',
        logo: coinsLogos.iota,
        availablePriceSources: ['binance', 'bitfinex'],
      },
      {
        ticker: 'LTC',
        name: 'Litecoin',
        logo: coinsLogos.ltc,
        availablePriceSources: ['binance', 'bitfinex', 'bitstamp'],
      },
      {
        ticker: 'XMR',
        name: 'Monero',
        logo: coinsLogos.xmr,
        availablePriceSources: ['bitfinex'],
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
   * Get the asset transactions in the portfolio
   * @param {object} asset Asset to get the history from
   * @returns List of asset transactions history
   */
  static getAssetTransactions = async (asset) => {
    const { ticker } = asset.coin;
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
   * @param {object} asset
   * @param {float} amount
   * @param {float} price
   * @param {Date} date
   */
  static addAssetTransaction = async (asset, amount, price, date) => {
    const { ticker } = asset.coin;
    const transactions = await DataStorage.getAssetTransactions(asset);
    // initialize new tx and add it
    const tx = {
      amount,
      price,
      date,
    };
    transactions.push(tx);
    // update asset amount
    // calculate amount
    const calculatedAmount = transactions
      .map(trans => trans.amount)
      .reduce((accum, current) => accum + current);
    const updatedAsset = asset;
    updatedAsset.amount = calculatedAmount;
    try {
      // store updated transactions and asset
      await AsyncStorage.setItem(DATA_ASSET_HIST + ticker, JSON.stringify(transactions));
      await DataStorage.updateAsset(updatedAsset);
      return tx;
    } catch (error) {
      // Error saving data
      throw error;
    }
  };

  /**
   * Add an asset to the portfolio
   * @param {object} coin
   * @param {string} priceSourceCode
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
      return assets[coin.ticker];
    } catch (error) {
      // Error saving data
      throw error;
    }
  };

  /**
   * Update an asset on the portfolio
   * @param {object} asset
   */
  static updateAsset = async (asset) => {
    const assets = await DataStorage.getAssets();
    // initialize new asset
    assets[asset.coin.ticker] = asset;
    try {
      // store updated assets
      await AsyncStorage.setItem(DATA_ASSETS, JSON.stringify(assets));
      return asset;
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
      // re,pve asset and it's transactions
      await AsyncStorage.setItem(DATA_ASSETS, JSON.stringify(assets));
      await AsyncStorage.removeItem(DATA_ASSET_HIST + ticker);
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
      prices[priceData.ticker] = {
        price: priceData.price,
        variation: priceData.variation,
      };
    });
    try {
      // store updated prices
      await AsyncStorage.setItem(DATA_PRICES, JSON.stringify(prices));
    } catch (error) {
      // Error saving data
      throw error;
    }
  };

  static getPricesLastFetchTime = async () => {
    let returnedValue = null;
    try {
      returnedValue = (await AsyncStorage.getItem(DATA_PRICES_FETCHTIME)) || '2009-01-03T00:00:01';
      returnedValue = Date.parse(returnedValue);
    } catch (error) {
      throw error;
    }
    return returnedValue;
  };

  /**
   * Saves the new last fetch time
   * @param {Date} fetchTime new fetch time
   */
  static setPricesLastFetchTime = async (fetchTime) => {
    try {
      // store updated prices
      await AsyncStorage.setItem(DATA_PRICES_FETCHTIME, fetchTime.toISOString());
    } catch (error) {
      // Error saving data
      throw error;
    }
  };
}

export default DataStorage;
