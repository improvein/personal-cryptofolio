import { AsyncStorage } from 'react-native';
import coins from './coins';

const DATA_ASSETS = '@Data:assets';
const DATA_ASSET_HIST = '@Data:assethist_';
const DATA_PRICES = '@Data:prices';
const DATA_PRICES_FETCHTIME = '@Data:prices_fetchtime';
const DATA_SETTINGS = '@Data:settings';

class DataStorage {
  /**
   * Clears all internally stored data
   */
  static clearData = async () => {
    try {
      await AsyncStorage.removeItem(DATA_SETTINGS);
      await AsyncStorage.removeItem(DATA_ASSETS);
      await AsyncStorage.removeItem(DATA_PRICES);
      await AsyncStorage.removeItem(DATA_PRICES_FETCHTIME);
      // remove transactions
      const keys = await AsyncStorage.getAllKeys();
      for (let k = 0; k < keys.length; k += 1) {
        const key = keys[k];
        if (key.includes(DATA_ASSET_HIST)) {
          await AsyncStorage.removeItem(key);
        }
      }
    } catch (error) {
      // Error saving data
      throw error;
    }
  };

  static getRawData = async () => {
    let assetsJson = (await AsyncStorage.getItem(DATA_ASSETS)) || '{}';
    const assets = JSON.parse(assetsJson);

    // get each asset's transactions and attach them to it
    const tickers = Object.keys(assets);
    for (let t = 0; t < tickers.length; t += 1) {
      const ticker = tickers[t];
      const txsJson = (await AsyncStorage.getItem(DATA_ASSET_HIST + ticker)) || '{}';
      // attach the txs to the asset
      assets[ticker].transactions = JSON.parse(txsJson);
    }
    // convert to string to export
    assetsJson = JSON.stringify(assets);
    return assetsJson;
  };

  /**
   * Get the available assets.
   * Hard-coded data.
   * @returns List of assets
   */
  static getCoins = async () => coins;

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
      returnedValue = (await AsyncStorage.getItem(DATA_ASSET_HIST + ticker)) || '{}';
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
   * @param {string} notes
   */
  static saveAssetTransaction = async (asset, amount, price, date, notes) => {
    const { ticker } = asset.coin;
    const transactions = await DataStorage.getAssetTransactions(asset);

    // initialize new tx and add it
    let dateStr = date;
    if (typeof dateStr !== 'string') {
      dateStr = dateStr.toISOString();
    }
    const tx = {
      date,
      amount,
      price,
      notes,
    };
    transactions[dateStr] = tx;

    // update asset amount
    // calculate amount
    const transactionsArray = Object.values(transactions);
    const calculatedAmount = transactionsArray
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

  static removeAssetTransaction = async (asset, txDate) => {
    const { ticker } = asset.coin;
    const transactions = await DataStorage.getAssetTransactions(asset);
    let dateStr = txDate;
    if (typeof dateStr !== 'string') {
      dateStr = dateStr.toISOString();
    }
    // clear the asset
    delete transactions[dateStr];

    // update asset amount
    // calculate amount
    const transactionsArray = Object.values(transactions);
    const calculatedAmount = transactionsArray
      .map(trans => trans.amount)
      .reduce((accum, current) => accum + current);
    const updatedAsset = asset;
    updatedAsset.amount = calculatedAmount;
    try {
      // store updated transactions and asset
      await AsyncStorage.setItem(DATA_ASSET_HIST + ticker, JSON.stringify(transactions));
      await DataStorage.updateAsset(updatedAsset);
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

  /**
   * Get the app settings
   */
  static getSettings = async () => {
    let returnedValue = null;
    try {
      returnedValue = (await AsyncStorage.getItem(DATA_SETTINGS)) || '{}';
      returnedValue = JSON.parse(returnedValue);
    } catch (error) {
      throw error;
    }
    return returnedValue;
  };

  static updateSettings = async (newSettings) => {
    let settings = await DataStorage.getSettings();
    // merge with old settings
    settings = { ...settings, ...newSettings };
    try {
      // store updated settings
      await AsyncStorage.setItem(DATA_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      // Error saving data
      throw error;
    }
  };
}

export default DataStorage;
