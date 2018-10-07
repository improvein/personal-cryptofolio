import Binance from './Binance';
import Bitfinex from './Bitfinex';
import Bitstamp from './Bitstamp';

const sources = {
  binance: new Binance(),
  bitfinex: new Bitfinex(),
  bitstamp: new Bitstamp(),
};

export default sources;
