
const db = require('../db/dbConnection');

// get name
async function getUser(username, stakeAddress) {
  const database = db.getDb();
  
  let user;

  if (stakeAddress)
    user = await database.findUserByStakeAddr(stakeAddress);
  else
    user = await database.findUserByName(username);

  if (!user) {
    return {};
  }

  let userDto = {
    user: user.user,
    userinfo: user.userinfo,
    stakeAddress: user.stakeAddress,
    ts: user.ts
  }

  return userDto;
}

export { getUser }
