import {CoinPrice} from '../../types';
import PriceSource from './PriceSource';

class Binance extends PriceSource {
  apiURL = 'https://api.binance.com/api/v3/ticker/24hr?symbol={currency_pair}';

  async getPrices(coins: string[]): Promise<CoinPrice[]> {
    const fetchPromises: Promise<CoinPrice>[] = [];
    coins.forEach(coinTicker => {
      const fetchPromise = new Promise<CoinPrice>((resolve /* , reject */) => {
        const pair = this.getPair(coinTicker);
        const url = this.apiURL.replace('{currency_pair}', pair);
        fetch(url)
          .then(response => response.json())
          .then(responseJson => {
            const coinPrice: CoinPrice = {
              ticker: coinTicker,
              price: parseFloat(responseJson.lastPrice),
              variation: parseFloat(responseJson.priceChangePercent),
            };
            resolve(coinPrice);
          })
          .catch(error => {
            // couldn't get price for coin
            console.warn(`Couldn't get price for coin: ${coinTicker}`, error);
            // return empty price
            const coinPrice: CoinPrice = {
              ticker: coinTicker,
              price: 0,
              variation: 0,
            };
            resolve(coinPrice);
          });
      }); // end fetch coin price promise

      // add the promise to the promise list
      fetchPromises.push(fetchPromise);
    }); // end coins iteration

    // return a promise that will end with ALL the prices fetched
    return Promise.all(fetchPromises);
  }

  getPair = (coinTicker: string) => {
    const pair = `${coinTicker.toUpperCase()}USDT`;
    return pair;
  };
}

export default Binance;
