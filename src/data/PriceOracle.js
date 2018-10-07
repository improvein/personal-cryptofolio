import DataStorage from './DataStorage';
import priceSources from './price/sources';

class PriceOracle {
  static priceSources = [{ code: 'bitstamp', name: 'Bitstamp' }, { code: '', name: '(none)' }];

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
    Object.entries(sourcesToUse).forEach((sourceData) => {
      // the .entries function gets me the key and the value of the main array
      const priceSourceCode = sourceData[0];
      const coins = sourceData[1];
      // get the price source
      const source = priceSources[priceSourceCode];
      // call the common "interface" method
      source.getPrices(coins).then((prices) => {
        // now that I have the prices, update the data storage
        const promise = DataStorage.updatePrices(prices);
        fetchPromises.push(promise);
      });
    });

    return Promise.all(fetchPromises);
  };
}

export default PriceOracle;
