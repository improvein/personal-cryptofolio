class Bitfinex {
  apiURL = 'https://api.bitfinex.com/v1/pubticker/{currency_pair}/';

  getPrices = async (coins) => {
    const fetchPromises = [];
    coins.forEach((coinTicker) => {
      const fetchPromise = new Promise((resolve /* , reject */) => {
        const pair = this.getPair(coinTicker);
        const url = this.apiURL.replace('{currency_pair}', pair);
        fetch(url)
          .then((response) => response.json())
          .then((responseJson) => {
            const coinPrice = {
              ticker: coinTicker,
              price: parseFloat(responseJson.last_price),
              variation: 0, // (responseJson.last / responseJson.open - 1) * 100,
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
    let ticker = coinTicker;
    // consider special cases
    if (ticker === 'IOTA') {
      ticker = 'IOT';
    }
    if (ticker === 'DASH') {
      ticker = 'DSH';
    }

    const pair = `${ticker.toLowerCase()}usd`;
    return pair;
  };
}

export default Bitfinex;
