
const db = require('../db/dbConnection');

const defaultCategories = [
  {category: 'Socials', count: 0},
  {category: 'Markets', count: 0},
  {category: 'Opsec', count: 0},
  {category: 'Conspiracies', count: 0},
  {category: 'Cryptocurrencies', count: 0},
  {category: 'Monero', count: 0},
  {category: 'Occult', count: 0},
  {category: 'Random', count: 0}
];

async function getSocialCategories() {
  const database = db.getDb();

  let categories = await database.listSocialCategories();
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

export { getSocialCategories }
