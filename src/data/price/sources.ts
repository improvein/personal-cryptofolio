import Binance from './Binance';
import Bitfinex from './Bitfinex';
import Bitstamp from './Bitstamp';
import Bittrex from './Bittrex';
import Kraken from './Kraken';

const sources = {
  binance: new Binance(),
  bitfinex: new Bitfinex(),
  bitstamp: new Bitstamp(),
  bittrex: new Bittrex(),
  kraken: new Kraken(),
};

export default sources;
