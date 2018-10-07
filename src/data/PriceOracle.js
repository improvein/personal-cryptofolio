import DataStorage from './DataStorage';
import priceSources from './price/sources';

class PriceOracle {
  /** interval to fech in seconds */
  static fetchInterval = 60;

  /** Source for Prices */
  static priceSources = [{ code: 'bitstamp', name: 'Bitstamp' }];

  /**
   * Returns all the available price sources
   */
  static getSources = () => {
    const sources = PriceOracle.priceSources.map(source => ({
      code: source.code,
      name: source.name,
    }));
    return sources;
  };

  static refreshPrices = async () => {
    // get the time for the last price fetch
    const lastFetch = await DataStorage.getPricesLastFetchTime();
    const secondsPassed = (new Date() - lastFetch) / 1000;
    if (secondsPassed >= PriceOracle.fetchInterval) {
      const assets = await DataStorage.getAssets();

      // find which sources to use, and for which coins
      const sourcesToUse = {};
      Object.values(assets).forEach((asset) => {
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
      /* eslint-disable no-await-in-loop */
      for (let index = 0; index < sourcesEntries.length; index += 1) {
        const sourceData = sourcesEntries[index];

        // the .entries function gets me the key and the value of the main array
        const priceSourceCode = sourceData[0];
        const coins = sourceData[1];
        // get the price source
        const source = priceSources[priceSourceCode];

        // call the common "interface" method
        const prices = await source.getPrices(coins);
        // now that I have the prices, update the data storage
        const promise = DataStorage.updatePrices(prices);
        fetchPromises.push(promise);
      }
      /* eslint-enable no-await-in-loop */

      // final promise that updates the fetch time for prices
      const promise = DataStorage.setPricesLastFetchTime(new Date());
      fetchPromises.push(promise);

      return Promise.all(fetchPromises);
    }
    // not going to fetch new prices
    // return OK
    return Promise.resolve();
  };
}

export default PriceOracle;
