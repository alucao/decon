const db = require("../db/dbConnection");

// get name
async function getUser(
  username: string | undefined,
  stakeAddress: string | undefined
): Promise<User | null> {
  const database = db.getDb();

  let user;

  if (stakeAddress) user = await database.findUserByStakeAddr(stakeAddress);
  else user = await database.findUserByName(username);

  if (!user) {
    return null;
  }

  let userDto: User = {
    user: user.user,
    userinfo: user.userinfo,
    stakeAddress: user.stakeAddress,
    publicKey: user.publicKey,
    ts: user.ts,
  };

  return userDto;
}

export { getUser };
