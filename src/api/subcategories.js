
const db = require('../db/dbConnection');

// get subcategories 
async function getSubcategories() {
  const database = db.getDb();

  let subcategories = await database.listSubcategories();

  let subcategoriesDto = subcategories.map(
    ({ subcategory, count }) => 
    ({ 
      name: subcategory, 
      count: count,
    }));

  return subcategoriesDto;
}

export { getSubcategories }
