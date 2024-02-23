
const db = require('../db/dbConnection');

const defaultCategories = [
  {category: 'Electronics', count: 0},
  {category: 'Fashion', count: 0},
  {category: 'Health & Beauty', count: 0},
  {category: 'Home & Garden', count: 0},
  {category: 'Sports', count: 0},
  {category: 'Collectibles and Art', count: 0},
  {category: 'Industrial equipment', count: 0},
  {category: 'Motors', count: 0}
];

// get categories 
async function getCategories() {
  const database = db.getDb();

  let categories = await database.listCategories();
  categories = categories.concat(defaultCategories.filter(x => categories.every(y => x.category != y.category)));
  categories = categories.slice(0, 20);

  let categoriesDto = categories.map(
    ({ category, count }) => 
    ({ 
      name: category, 
      count: count,
    }));

  return categoriesDto;
}

export { getCategories }
