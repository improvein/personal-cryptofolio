import coinsLogos from '../assets';

const coins = [
  {
    ticker: 'BTC',
    name: 'Bitcoin',
    logo: coinsLogos.btc,
    availablePriceSources: ['binance', 'bitfinex', 'bitstamp'],
  },
  {
    ticker: 'BCH',
    name: 'Bitcoin Cash',
    logo: coinsLogos.bch,
    availablePriceSources: ['bitfinex', 'bitstamp'],
  },
  {
    ticker: 'ADA',
    name: 'Cardano',
    logo: coinsLogos.ada,
    availablePriceSources: ['binance'],
  },
  {
    ticker: 'DASH',
    name: 'Dash',
    logo: coinsLogos.dash,
    availablePriceSources: ['bitfinex'],
  },
  {
    ticker: 'EOS',
    name: 'EOS',
    logo: coinsLogos.eos,
    availablePriceSources: ['binance', 'bitfinex'],
  },
  {
    ticker: 'ETH',
    name: 'Ethereum',
    logo: coinsLogos.eth,
    availablePriceSources: ['binance', 'bitfinex', 'bitstamp'],
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
    availablePriceSources: ['binance', 'bitfinex', 'bitstamp'],
  },
  {
    ticker: 'XMR',
    name: 'Monero',
    logo: coinsLogos.xmr,
    availablePriceSources: ['bitfinex'],
  },
];

export default coins;
