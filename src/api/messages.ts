const db = require("../db/dbConnection");

// get messages
async function getMessages(username: string): Promise<Message[]> {
  const database = db.getDb();

  let messages: DbMessage[] = await database.listMessages(username);

  let messagesDto = messages.map(
    ({ from, to, message, ts, guid, srcKey, dstKey, iv }) => ({
      from,
      to,
      srcKey,
      dstKey,
      iv,
      message,
      ts,
      guid,
    })
  );

  return messagesDto;
}

export { getMessages };
