import coinsLogos from '../assets';

const coins = [
  {
    ticker: 'BTC',
    name: 'Bitcoin',
    logo: coinsLogos.btc,
    availablePriceSources: ['binance', 'bitfinex', 'bitstamp', 'kraken'],
  },
  {
    ticker: 'BCH',
    name: 'Bitcoin Cash',
    logo: coinsLogos.bch,
    availablePriceSources: ['bitfinex', 'bitstamp', 'kraken'],
  },
  {
    ticker: 'ADA',
    name: 'Cardano',
    logo: coinsLogos.ada,
    availablePriceSources: ['binance', 'kraken'],
  },
  {
    ticker: 'DASH',
    name: 'Dash',
    logo: coinsLogos.dash,
    availablePriceSources: ['bitfinex', 'kraken'],
  },
  {
    ticker: 'EOS',
    name: 'EOS',
    logo: coinsLogos.eos,
    availablePriceSources: ['binance', 'bitfinex', 'kraken'],
  },
  {
    ticker: 'ETH',
    name: 'Ethereum',
    logo: coinsLogos.eth,
    availablePriceSources: ['binance', 'bitfinex', 'bitstamp', 'kraken'],
  },
  {
    ticker: 'IOTA',
    name: 'IOTA',
    logo: coinsLogos.iota,
    availablePriceSources: ['binance', 'bitfinex'],
  },
  {
    ticker: 'LTC',
    name: 'Litecoin',
    logo: coinsLogos.ltc,
    availablePriceSources: ['binance', 'bitfinex', 'bitstamp', 'kraken'],
  },
  {
    ticker: 'XMR',
    name: 'Monero',
    logo: coinsLogos.xmr,
    availablePriceSources: ['bitfinex', 'kraken'],
  },
  {
    ticker: 'XRP',
    name: 'Ripple',
    logo: coinsLogos.xrp,
    availablePriceSources: ['binance', 'bitfinex', 'kraken'],
  },
  {
    ticker: 'ZEC',
    name: 'ZCash',
    logo: coinsLogos.zec,
    availablePriceSources: ['bitfinex', 'kraken'],
  },
];

export default coins;
