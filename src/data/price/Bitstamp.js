class Bitstamp {
  apiURL = 'https://www.bitstamp.net/api/v2/ticker/{currency_pair}/';

  getPrices = async (coins) => {
    const fetchPromises = [];
    coins.forEach((coinTicker) => {
      const fetchPromise = new Promise((resolve, reject) => {
        const pair = `${coinTicker.toLowerCase()}usd`;
        const url = this.apiURL.replace('{currency_pair}', pair);
        fetch(url)
          .then(response => response.json())
          .then((responseJson) => {
            const coinPrice = {
              ticker: coinTicker,
              price: responseJson.last,
            };
            resolve(coinPrice);
          })
          .catch((error) => {
            reject(error);
          });
      }); // end fetch coin price promise

      // add the promise to the promise list
      fetchPromises.push(fetchPromise);
    }); // end coins iteration

    // return a promise that will end with ALL the prices fetched
    return Promise.all(fetchPromises);
  };

  //   getPrices = async (coins) => {
  //     const fetchPromises = [];
  //     coins.forEach((coinTicker) => {
  //       const fetchPromise = new Promise((resolve, reject) => {
  //         const pair = `${coinTicker.toLowerCase()}usd`;
  //         const url = this.apiURL.replace('{currency_pair}', pair);
  //         // call the API
  //         http
  //           .get(url, (res) => {
  //             res.setEncoding('utf8');
  //             let body = '';
  //             res.on('data', (data) => {
  //               body += data;
  //             });
  //             res.on('end', () => {
  //               // I have the price data
  //               body = JSON.parse(body);
  //               const coinPrice = {
  //                 ticker: coinTicker,
  //                 price: body.last,
  //               };
  //               resolve(coinPrice);
  //             });
  //           })
  //           .on('error', (err) => {
  //             reject(err);
  //           });
  //       }); // end fetch coin price promise

  //       // add the promise to the promise list
  //       fetchPromises.push(fetchPromise);
  //     }); // end coins iteration

  //     // return a promise that will end with ALL the prices fetched
  //     return Promise.all(fetchPromises);
  //   };
}

export default Bitstamp;
