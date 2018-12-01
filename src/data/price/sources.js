import Binance from './Binance';
import Bitfinex from './Bitfinex';
import Bitstamp from './Bitstamp';
import Kraken from './Kraken';

const sources = {
  binance: new Binance(),
  bitfinex: new Bitfinex(),
  bitstamp: new Bitstamp(),
  kraken: new Kraken(),
};

export default sources;
