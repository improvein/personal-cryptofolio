import AsyncStorage from '@react-native-community/async-storage';
import sha256 from 'crypto-js/sha256';
import coins from './coins';

const DATA_ASSETS = '@Data:assets';
const DATA_ASSET_HIST = '@Data:assethist_';
const DATA_PRICES = '@Data:prices';
const DATA_PRICES_FETCHTIME = '@Data:prices_fetchtime';
const DATA_SETTINGS = '@Data:settings';
const DATA_PIN_HASH = '@Data:pin_hash';

class DataStorage {
  /**
   * Clears all internally stored data
   */
  static clearData = async () => {
    await AsyncStorage.removeItem(DATA_SETTINGS);
    await AsyncStorage.removeItem(DATA_PIN_HASH);
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
   * Import data into the internal storage, replacing existing data.
   * @param {string|object} data Data to import
   */
  static importData = async (data) => {
    // prepare new data
    let assets = data;
    if (typeof assets === 'string') {
      assets = JSON.parse(assets);
    }

    // clear existing data
    await DataStorage.clearData();

    // separate transactions from asset objects
    const transactions = {};
    const tickers = Object.keys(assets);
    tickers.forEach((ticker) => {
      // save the transactions for later import, and remove it from the object
      transactions[ticker] = assets[ticker].transactions;
      delete assets[ticker].transactions;
    });
    // now save and import
    // assets
    await AsyncStorage.setItem(DATA_ASSETS, JSON.stringify(assets));
    // transactions
    const txPromises = [];
    tickers.forEach((ticker) => {
      txPromises.push(
        AsyncStorage.setItem(DATA_ASSET_HIST + ticker, JSON.stringify(transactions[ticker])),
      );
    });
    await Promise.all(txPromises);
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

    returnedValue = (await AsyncStorage.getItem(DATA_ASSETS)) || '{}';
    returnedValue = JSON.parse(returnedValue);

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

    returnedValue = (await AsyncStorage.getItem(DATA_ASSET_HIST + ticker)) || '{}';
    returnedValue = JSON.parse(returnedValue);

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
      .map((trans) => trans.amount)
      .reduce((accum, current) => accum + current);
    const updatedAsset = asset;
    updatedAsset.amount = calculatedAmount;

    // store updated transactions and asset
    await AsyncStorage.setItem(DATA_ASSET_HIST + ticker, JSON.stringify(transactions));
    await DataStorage.updateAsset(updatedAsset);
    return tx;
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
      .map((trans) => trans.amount)
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

    // store updated assets
    await AsyncStorage.setItem(DATA_ASSETS, JSON.stringify(assets));
    return assets[coin.ticker];
  };

  /**
   * Update an asset on the portfolio
   * @param {object} asset
   */
  static updateAsset = async (asset) => {
    const assets = await DataStorage.getAssets();
    // initialize new asset
    assets[asset.coin.ticker] = asset;

    // store updated assets
    await AsyncStorage.setItem(DATA_ASSETS, JSON.stringify(assets));
    return asset;
  };

  static removeAsset = async (ticker) => {
    const assets = await DataStorage.getAssets();
    // clear the asset
    delete assets[ticker];

    // re,pve asset and it's transactions
    await AsyncStorage.setItem(DATA_ASSETS, JSON.stringify(assets));
    await AsyncStorage.removeItem(DATA_ASSET_HIST + ticker);
  };

  // #region Prices  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  /**
   * Get the prices locally stored
   * @returns Coin prices from price sources
   */
  static getPrices = async () => {
    let returnedValue = null;
    returnedValue = (await AsyncStorage.getItem(DATA_PRICES)) || '{}';
    returnedValue = JSON.parse(returnedValue);
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

    // store updated prices
    await AsyncStorage.setItem(DATA_PRICES, JSON.stringify(prices));
  };

  static getPricesLastFetchTime = async () => {
    let returnedValue = null;

    returnedValue = (await AsyncStorage.getItem(DATA_PRICES_FETCHTIME)) || '2009-01-03T00:00:01';
    returnedValue = Date.parse(returnedValue);
    return returnedValue;
  };

  /**
   * Saves the new last fetch time
   * @param {Date} fetchTime new fetch time
   */
  static setPricesLastFetchTime = async (fetchTime) => {
    // store updated prices
    await AsyncStorage.setItem(DATA_PRICES_FETCHTIME, fetchTime.toISOString());
  };

  // #endregion Prices  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

  // #region Settings  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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

  // #endregion Settings  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

  // #region PIN  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  /**
   * Update the PIN for storage and other purposes
   * Also saves a verification of the PIN
   */
  static updatePIN = async (pin) => {
    const hashedPin = sha256(pin);
    try {
      // store updated settings
      await AsyncStorage.setItem(DATA_PIN_HASH, hashedPin.toString());
    } catch (error) {
      // Error saving data
      throw error;
    }
  };

  /**
   * Validates if the given PIN corresponds to the one stored
   * @todo: move this function to a more suitable place
   */
  static getPINHash = async () => {
    let storedHashedPin = '';
    try {
      storedHashedPin = (await AsyncStorage.getItem(DATA_PIN_HASH)) || '';
    } catch (error) {
      throw error;
    }
    return storedHashedPin;
  };

  /**
   * Validates if the given PIN corresponds to the one stored
   * @todo: move this function to a more suitable place
   */
  static validatePIN = async (pin) => {
    let storedHashedPin = '';
    try {
      storedHashedPin = (await AsyncStorage.getItem(DATA_PIN_HASH)) || '';
    } catch (error) {
      throw error;
    }

    // calculate the hash of the PIN
    const hashedHex = sha256(pin).toString();
    return hashedHex === storedHashedPin;
  };

  // #endregion PIN  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
}

export default DataStorage;
