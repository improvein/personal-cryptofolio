export type AvailablePriceSourceCodes =
  | 'binance'
  | 'bitfinex'
  | 'bitstamp'
  | 'bittrex'
  | 'kraken';

export interface Coin {
  ticker: string;
  name: string;
  logo: any;
  availablePriceSources: string[];
}

export interface Asset {
  coin: Coin;
  amount: number;
  priceSourceCode: string;
  price?: number;
  variation?: number;
  valuation?: number;
}

export interface Transaction {
  date: Date;
  price: number;
  amount: number;
  notes?: string;
}

export interface CoinPrice {
  ticker: string;
  price: number;
  variation: number;
}

export interface PriceSourceEntry {
  code: string;
  name: string;
}

export interface Settings {
  pinProtection: boolean;
}
