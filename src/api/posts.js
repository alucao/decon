
const db = require('../db/dbConnection');

// get posts 
async function getPosts(query) {
  const database = db.getDb();

  let posts;
  if (!query) {
    posts = await database.listPosts();
  }
  else {
    posts = await database.listPosts(query);
  }

  let postsDto = posts.map(
    ({ from, ts, guid, title, price, description, category, subcategory, location, sublocation }) => 
    ({ 
      from: from, 
      ts: ts,
      guid: guid,
      title: title,
      price: price,
      description: description,
      category: category,
      subcategory: subcategory,
      location: location,
      sublocation: sublocation
    }));

  return postsDto;
}

export { getPosts }
