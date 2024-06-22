import coinsLogos from '../assets';

const coins = [
  {
    ticker: 'BTC',
    name: 'Bitcoin',
    logo: coinsLogos.btc,
    availablePriceSources: [
      'binance',
      'bitfinex',
      'bitstamp',
      'bittrex',
      'kraken',
    ],
  },
  {
    ticker: 'BCH',
    name: 'Bitcoin Cash',
    logo: coinsLogos.bch,
    availablePriceSources: ['bitfinex', 'bitstamp', 'bittrex', 'kraken'],
  },
  {
    ticker: 'ADA',
    name: 'Cardano',
    logo: coinsLogos.ada,
    availablePriceSources: ['binance', 'bittrex', 'kraken'],
  },
  {
    ticker: 'DASH',
    name: 'Dash',
    logo: coinsLogos.dash,
    availablePriceSources: ['bitfinex', 'bittrex', 'kraken'],
  },
  {
    ticker: 'DCR',
    name: 'Decred',
    logo: coinsLogos.dcr,
    availablePriceSources: ['bittrex'],
  },
  {
    ticker: 'EOS',
    name: 'EOS',
    logo: coinsLogos.eos,
    availablePriceSources: ['binance', 'bitfinex', 'bittrex', 'kraken'],
  },
  {
    ticker: 'ETH',
    name: 'Ethereum',
    logo: coinsLogos.eth,
    availablePriceSources: [
      'binance',
      'bitfinex',
      'bitstamp',
      'bittrex',
      'kraken',
    ],
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
    availablePriceSources: [
      'binance',
      'bitfinex',
      'bitstamp',
      'bittrex',
      'kraken',
    ],
  },
  {
    ticker: 'MKR',
    name: 'Maker',
    logo: coinsLogos.mkr,
    availablePriceSources: ['bitfinex'],
  },
  {
    ticker: 'RVN',
    name: 'Ravencoin',
    logo: coinsLogos.rvn,
    availablePriceSources: ['binance', 'bittrex'],
  },
  {
    ticker: 'XMR',
    name: 'Monero',
    logo: coinsLogos.xmr,
    availablePriceSources: ['bitfinex', 'bittrex', 'kraken'],
  },
  {
    ticker: 'XRP',
    name: 'Ripple',
    logo: coinsLogos.xrp,
    availablePriceSources: ['binance', 'bitfinex', 'bittrex', 'kraken'],
  },
  {
    ticker: 'ZEC',
    name: 'ZCash',
    logo: coinsLogos.zec,
    availablePriceSources: ['bitfinex', 'bittrex', 'kraken'],
  },
];

export default coins;
