import {CoinPrice} from '../../types';
import PriceSource from './PriceSource';

class Bitfinex extends PriceSource {
  apiURL = 'https://api.kraken.com/0/public/Ticker?pair={currency_pairs}';

  public async getPrices(coins: string[]): Promise<CoinPrice[]> {
    const currencyPairs: string[] = [];
    coins.forEach(coinTicker => {
      currencyPairs.push(this.getPair(coinTicker));
    }); // end coins iteration

    const promise = new Promise<CoinPrice[]>((resolve /* , reject */) => {
      const tickers = currencyPairs.join(',');
      const url = this.apiURL.replace('{currency_pairs}', tickers);
      fetch(url)
        .then(response => response.json())
        .then(responseJson => {
          const coinPrices: CoinPrice[] = [];
          // Kraken sometimes use similar tickers/pairs so we need to find matches
          const resultPairs = Object.keys(responseJson.result);
          resultPairs.forEach(resultPair => {
            // find to which ticker the result ticker matches
            coins.forEach(coinTicker => {
              if (resultPair.includes(this.normalizeTicker(coinTicker))) {
                const resultPairInfo = responseJson.result[resultPair];
                const lastTradePrice = parseFloat(resultPairInfo.c[0]);

                coinPrices.push({
                  ticker: coinTicker,
                  price: lastTradePrice,
                  variation:
                    (lastTradePrice / parseFloat(resultPairInfo.o) - 1) * 100,
                });
              }
            });
          });

          resolve(coinPrices);
        })
        .catch(error => {
          // couldn't get price for coin
          console.warn(`Couldn't get price for coins: ${tickers}`, error);

          // return empty prices
          const coinPrices: CoinPrice[] = [];
          coins.forEach(coinTicker => {
            coinPrices.push({
              ticker: coinTicker,
              price: 0,
              variation: 0,
            });
          }); // end coins iteration
          resolve(coinPrices);
        });
    });

    return promise;
  }

  getPair(coinTicker: string) {
    const ticker = this.normalizeTicker(coinTicker);

    const pair = `${ticker}USD`;
    return pair;
  }

  normalizeTicker = (coinTicker: string) => {
    let ticker = coinTicker.toUpperCase();
    // consider special cases
    if (ticker === 'BTC') {
      ticker = 'XBT';
    }

    return ticker;
  };
}

export default Bitfinex;
