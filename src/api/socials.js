
const db = require('../db/dbConnection');

// get socials 
async function getSocials(query) {
  const database = db.getDb();

  let socials;
  if (!query) {
    socials = await database.listSocials();
  }
  else {
    socials = await database.listSocials(query);
  }

  let socialsDto = socials.map(
    ({ from, ts, guid, parent, title, content, category }) => 
    ({ 
      from: from, 
      ts: ts,
      guid: guid,
      parent: parent,
      title: title,
      content: content,
      category: category,
    }));

  return socialsDto;
}

export { getSocials }
