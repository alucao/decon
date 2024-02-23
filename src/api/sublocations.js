
const db = require('../db/dbConnection');

// get sublocations
async function getSublocations() {
  const database = db.getDb();

  let sublocations = await database.listSublocations();

  let sublocationsDto = sublocations.map(
    ({ sublocation, count }) => 
    ({ 
      name: sublocation, 
      count: count,
    }));

  return sublocationsDto;
}

export { getSublocations }
