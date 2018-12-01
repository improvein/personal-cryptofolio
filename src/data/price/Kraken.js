class Bitfinex {
  apiURL = 'https://api.kraken.com/0/public/Ticker?pair={currency_pairs}';

  getPrices = async (coins) => {
    const currencyPairs = [];
    coins.forEach((coinTicker) => {
      currencyPairs.push(this.getPair(coinTicker));
    }); // end coins iteration

    const promise = new Promise((resolve /* , reject */) => {
      const tickers = currencyPairs.join(',');
      const url = this.apiURL.replace('{currency_pairs}', tickers);
      fetch(url)
        .then(response => response.json())
        .then((responseJson) => {
          const coinPrices = [];
          // Kraken sometimes use similar tickers/pairs so we need to find matches
          const resultPairs = Object.keys(responseJson.result);
          resultPairs.forEach((resultPair) => {
            // find to which ticker the result ticker matches
            coins.forEach((coinTicker) => {
              if (resultPair.includes(this.normalizeTicker(coinTicker))) {
                const resultPairInfo = responseJson.result[resultPair];
                const lastTradePrice = parseFloat(resultPairInfo.c[0]);

                coinPrices.push({
                  ticker: coinTicker,
                  price: lastTradePrice,
                  variation: (lastTradePrice / parseFloat(resultPairInfo.o) - 1) * 100,
                });
              }
            });
          });

          resolve(coinPrices);
        })
        .catch((error) => {
          // couldn't get price for coin
          console.warn(`Couldn't get price for coins: ${tickers}`, error);

          // return empty prices
          const coinPrices = [];
          coins.forEach((coinTicker) => {
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
  };

  getPair = (coinTicker) => {
    const ticker = this.normalizeTicker(coinTicker);

    const pair = `${ticker}USD`;
    return pair;
  };

  normalizeTicker = (coinTicker) => {
    let ticker = coinTicker.toUpperCase();
    // consider special cases
    if (ticker === 'BTC') {
      ticker = 'XBT';
    }

    return ticker;
  };
}

export default Bitfinex;
