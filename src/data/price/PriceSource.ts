import {CoinPrice} from '../../types';

export default abstract class PriceSource {
  public abstract getPrices(coins: string[]): Promise<CoinPrice[]>;
  public abstract getPair(coinTicker: string): string;

  public normalizeTicker(coinTicker: string) {
    return coinTicker.toUpperCase();
  }
}
