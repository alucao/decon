import NinjaConfig from '../ninjaConfig';

const db = require('../db/dbConnection');

// get name
async function getSettings() {
  const database = db.getDb();
  
  const dbSettings = await database.findSettings();

  console.log(dbSettings)
  let settings = {
    isProd: dbSettings?.isProd ?? true,
    provider: dbSettings?.provider ?? "KOIOS",
    apiKey: dbSettings?.apiKey ?? new NinjaConfig().getCfg().KOIOS_KEY,
  }
  console.log(settings)

  return settings
}

export { getSettings }
