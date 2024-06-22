const adaLogo = require('./images/coin_ada.png');
const btcLogo = require('./images/coin_btc.png');
const bchLogo = require('./images/coin_bch.png');
const dashLogo = require('./images/coin_dash.png');
const dcrLogo = require('./images/coin_dcr.png');
const eosLogo = require('./images/coin_eos.png');
const ethLogo = require('./images/coin_eth.png');
const iotaLogo = require('./images/coin_iota.png');
const ltcLogo = require('./images/coin_ltc.png');
const mkrLogo = require('./images/coin_mkr.png');
const rvnLogo = require('./images/coin_rvn.png');
const xmrLogo = require('./images/coin_xmr.png');
const xrpLogo = require('./images/coin_xrp.png');
const zecLogo = require('./images/coin_zec.png');

const coinsLogos: {[ticker: string]: any} = {
  ada: adaLogo,
  btc: btcLogo,
  bch: bchLogo,
  dash: dashLogo,
  dcr: dcrLogo,
  eos: eosLogo,
  eth: ethLogo,
  iota: iotaLogo,
  ltc: ltcLogo,
  mkr: mkrLogo,
  rvn: rvnLogo,
  xmr: xmrLogo,
  xrp: xrpLogo,
  zec: zecLogo,
};

export default coinsLogos;
