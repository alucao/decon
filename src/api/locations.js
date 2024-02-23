
const db = require('../db/dbConnection');

// get locations
async function getLocations() {
  const database = db.getDb();

  let locations = await database.listLocations();

  let locationsDto = locations.map(
    ({ location, count }) => 
    ({ 
      name: location, 
      count: count,
    }));

  return locationsDto;
}

export { getLocations }
