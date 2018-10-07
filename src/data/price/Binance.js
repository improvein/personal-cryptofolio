class Binance {
  apiURL = 'https://api.binance.com/api/v1/ticker/24hr?symbol={currency_pair}';

  getPrices = async (coins) => {
    const fetchPromises = [];
    coins.forEach((coinTicker) => {
      const fetchPromise = new Promise((resolve /* , reject */) => {
        const pair = this.getPair(coinTicker);
        const url = this.apiURL.replace('{currency_pair}', pair);
        fetch(url)
          .then(response => response.json())
          .then((responseJson) => {
            const coinPrice = {
              ticker: coinTicker,
              price: parseFloat(responseJson.lastPrice),
              variation: parseFloat(responseJson.priceChangePercent),
            };
            resolve(coinPrice);
          })
          .catch((error) => {
            // couldn't get price for coin
            console.warn(`Couldn't get price for coin: ${coinTicker}`, error);
            // return empty price
            const coinPrice = {
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
  };

  getPair = (coinTicker) => {
    const pair = `${coinTicker.toUpperCase()}USDT`;
    return pair;
  };
}

export default Binance;
