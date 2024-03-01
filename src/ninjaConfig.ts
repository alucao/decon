interface Cfg {
  FOLLOW_TRANSACTION_URL: string;
  WALLET_ADDRESS: string;
  KOIOS_KEY: string;
  KOIOS_URL: string;
  BLOCKFROST_KEY: string;
  BLOCKFROST_URL: string;
  METADATA_LABEL: number;
  POLLING_INTERVAL: number;
  STAKE_ADDRESS_SIGNATURE_SECRET: string;
}

class NinjaConfig {
  private static _instance: NinjaConfig;
  private static _config: Cfg;

  constructor() {
    if (NinjaConfig._instance) {
      return NinjaConfig._instance;
    }
    NinjaConfig._instance = this;
  }

  setCfg(config: Cfg) {
    NinjaConfig._config = config;
  }
  getCfg(): Cfg {
    return NinjaConfig._config;
  }
}

export default NinjaConfig;
