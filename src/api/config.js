
const db = require('../db/dbConnection');

// get config
async function getConfig() {

  const database = db.getDb();

  let settings = await database.findSettings();
  let isProd = !settings || settings.isProd;

  let config = isProd ? {
    FOLLOW_TRANSACTION_URL: "https://cardanoscan.io/transaction/",
    WALLET_ADDRESS: "addr1qxhz3awnfyy5frmusy56ryrjjv53fdeygtdt8x6tupvykpnt2zdd2zgwjlww68p93x66xtertaqtctk5lpx9n6jugq4sjwn0u0",
    KOIOS_URL: "https://api.koios.rest/api/v1",
    KOIOS_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyIjoic3Rha2UxdTk0NHB4azRweThmMGg4ZHJzamNuZGRyOXUzNDdzOXU5bTIwc256ZWFmd3lxMmN4M2s5NjUiLCJleHAiOjE3MzgxMDAwNDMsInRpZXIiOjEsInByb2pJRCI6ImNhcmRhbm8ifQ.EhUGSZsofThIZL30uwkZKnJ4O3AghqRXwcoRTiL88TA",
    BLOCKFROST_URL: "https://cardano-mainnet.blockfrost.io/api/v0",
    BLOCKFROST_KEY: "mainnetN08Xw3dFGIrTiXdK6AfE8FGMXJwqEU3E",
    METADATA_LABEL: 987,
    POLLING_INTERVAL: 10000,
  } : 
  {
    FOLLOW_TRANSACTION_URL: "https://preprod.cardanoscan.io/transaction/",
    WALLET_ADDRESS: "addr_test1qrztg7gawfx52upqqjty6zz868mmyzlp620xhvhqfh35rxrxjm6xyw8p6zs69fzxg93l5674a8j3w0v44c38dzdvtn9qlkqf4x",
    KOIOS_URL: "https://preprod.koios.rest/api/v1",
    KOIOS_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyIjoic3Rha2UxdTk0NHB4azRweThmMGg4ZHJzamNuZGRyOXUzNDdzOXU5bTIwc256ZWFmd3lxMmN4M2s5NjUiLCJleHAiOjE3MzgxMDAwNDMsInRpZXIiOjEsInByb2pJRCI6ImNhcmRhbm8ifQ.EhUGSZsofThIZL30uwkZKnJ4O3AghqRXwcoRTiL88TA",
    BLOCKFROST_URL: "https://cardano-preprod.blockfrost.io/api/v0",
    BLOCKFROST_KEY: "preprodn0MIxSnJ4Qg4CmmXdstYgHeXth1DuAH7",
    METADATA_LABEL: 987,
    POLLING_INTERVAL: 10000,
  }

  console.log(config)
  return config;
}

export { getConfig }
