import {AvailablePriceSourceCodes, PriceSourceEntry} from '../types';
import DataStorage from './DataStorage';
import priceSources from './price/sources';

class PriceOracle {
  /** interval to fech in seconds */
  static fetchInterval = 20;

  /** Source for Prices */
  static priceSources: PriceSourceEntry[] = [
    {code: 'binance', name: 'Binance'},
    {code: 'bitfinex', name: 'Bitfinex'},
    {code: 'bitstamp', name: 'Bitstamp'},
    {code: 'bittrex', name: 'Bittrex'},
    {code: 'kraken', name: 'Kraken'},
  ];

  /**
   * Returns all the available price sources
   */
  static getSources = (): PriceSourceEntry[] => {
    const sources = PriceOracle.priceSources.map(source => ({
      code: source.code,
      name: source.name,
    }));
    return sources;
  };

  /**
   * Refresh the prices of the assets in the portfolio.
   * The results will be saved in the storage.
   */
  static refreshPrices = async () => {
    // get the time for the last price fetch
    const lastFetch = await DataStorage.getPricesLastFetchTime();
    const secondsPassed = (new Date().getTime() - lastFetch) / 1000;
    if (secondsPassed >= PriceOracle.fetchInterval) {
      const assets = await DataStorage.getAssets();

      // find which sources to use, and for which coins
      const sourcesToUse: {[code: string]: any[]} = {};
      Object.values(assets).forEach(asset => {
        let priceSourceCode = '';
        if (!(priceSourceCode in asset)) {
          priceSourceCode = asset.priceSourceCode || '';
        }
        if (priceSourceCode !== '') {
          // if the exchange wasn't added to the list yet, add it now
          if (!(priceSourceCode in sourcesToUse)) {
            // initialize the array of coins
            sourcesToUse[priceSourceCode] = [];
          }
          // add the coin to the list to check
          sourcesToUse[priceSourceCode].push(asset.coin.ticker);
        }
      });

      // now fetch the prices from all the sources
      const fetchPromises = [];
      const sourcesEntries = Object.entries(sourcesToUse);
      for (let index = 0; index < sourcesEntries.length; index += 1) {
        const sourceData = sourcesEntries[index];

        // the .entries function gets me the key and the value of the main array
        const priceSourceCode = sourceData[0];
        const coins = sourceData[1];
        // get the price source
        const source =
          priceSources[priceSourceCode as AvailablePriceSourceCodes];

        // call the common "interface" method
        const prices = await source.getPrices(coins);
        // now that I have the prices, update the data storage
        const promise = DataStorage.updatePrices(prices);
        fetchPromises.push(promise);
      }

      // final promise that updates the fetch time for prices
      const promise = DataStorage.setPricesLastFetchTime(new Date());
      fetchPromises.push(promise);

      return Promise.all(fetchPromises);
    }
    // not going to fetch new prices
    // return OK
    return Promise.resolve();
  };

  /**
   * Fetch the price for a specific ticker
   */
  static fetchPrice = async (priceSourceCode: string, ticker: string) => {
    let resultPrice = 0;

    // get the time for the last price fetch
    const lastFetch = await DataStorage.getPricesLastFetchTime();
    const secondsPassed = (new Date().getTime() - lastFetch) / 1000;
    if (secondsPassed >= PriceOracle.fetchInterval) {
      // get the price source
      const source = priceSources[priceSourceCode as AvailablePriceSourceCodes];
      // call the common "interface" method
      const prices = await source.getPrices([ticker]);
      resultPrice = prices[0].price || 0;

      // now that I have the prices, update the data storage
      await DataStorage.updatePrices(prices);
      // updates the fetch time for prices
      await DataStorage.setPricesLastFetchTime(new Date());
    } else {
      const prices = await DataStorage.getPrices();
      if (Object.keys(prices).includes(ticker)) {
        resultPrice = prices[ticker].price || 0;
      }
    }

    return resultPrice;
  };
}

export default PriceOracle;
