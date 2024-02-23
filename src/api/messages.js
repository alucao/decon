
const db = require('../db/dbConnection');

// get messages 
async function getMessages(username) {
  const database = db.getDb();

  let messages = await database.listMessages(username);

  let messagesDto = messages.map(
    ({ from, to, message, ts, guid }) =>
    ({
    from: from,
    to: to,
    message: message,
    ts: ts,
    guid: guid
  }));

  return messagesDto;
}

export { getMessages }
