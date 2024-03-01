import { BlockfrostApiClient } from "./clients/blockfrost";
import { ApiClient } from "./clients/client";
import { KoiosApiClient } from "./clients/koios";
import NinjaConfig from "../ninjaConfig";
import { getSettings } from "./settings";

const Cardano = await (async () =>
  await require("@emurgo/cardano-serialization-lib-browser"))();
const Message = await (async () =>
  await require("@emurgo/cardano-message-signing-browser"))();

const Buffer = require("buffer/").Buffer;
const yaml = require("js-yaml");
const db = require("../db/dbConnection");

let database = db.getDb();

let apiClient: ApiClient;

function initApiClient(provider, apiKey) {
  console.log(provider);
  console.log(apiKey);
  if (provider == "KOIOS") {
    return new KoiosApiClient(apiKey);
  } else {
    return new BlockfrostApiClient(apiKey);
  }
}

async function updateSettings(isProd, provider, apiKey) {
  await database.insertSettings({
    isProd: isProd,
    provider: provider,
    apiKey: apiKey,
  });
}

async function setSettings(isProd, provider, key) {
  await updateSettings(isProd, provider, key);
  apiClient = initApiClient(provider, key);
}

async function clearDb() {
  await database.clearDatabase();
}

async function processTransaction(txHash, transactionTime, metadataJsonObj) {
  //let metadataJsonObj = JSON.parse(metadataJson);

  // rebuild signature
  let signature = "";
  for (let i = 0; i < 50; i++) {
    let index = `s_${i}`;
    if (!metadataJsonObj[index]) break;
    signature += metadataJsonObj[index];
  }

  // rebuild key
  let key = "";
  for (let i = 0; i < 50; i++) {
    let index = `k_${i}`;
    if (!metadataJsonObj[index]) break;
    key += metadataJsonObj[index];
  }

  const message = Message.COSESign1.from_bytes(
    Buffer.from(Buffer.from(signature, "hex"), "hex")
  );

  const headermap = message.headers().protected().deserialized_headers();
  const address = Cardano.Address.from_bytes(
    headermap.header(Message.Label.new_text("address")).as_bytes()
  );

  let payloadBytes = message.payload();
  let payload = Buffer.from(payloadBytes, "hex");

  let payloadObj = yaml.load(payload.toString("utf-8"));
  console.log(payloadObj);
  let username = payloadObj.from;
  let guid = payloadObj.guid;
  if (!username) {
    console.log("Invalid username");
    return;
  }
  if (!guid) {
    console.log("Invalid guid");
    return;
  }

  // validate guid to prevent replay attacks
  let isGuidAlreadyUsed = await database.findGuid(guid);
  if (isGuidAlreadyUsed) {
    console.log("Guid already used!");
    return;
  }

  // get the stake address associated with the user
  let stakeAddress = "";
  let isFirstTimeUser = false;
  let user = await database.findUserByName(username);
  if (!user) {
    isFirstTimeUser = true;
    stakeAddress = payloadObj.stakeAddr;
    if (!stakeAddress) {
      console.log("Invalid stake address");
      return;
    }
    if (await database.findUserByStakeAddr(stakeAddress)) {
      console.log("Stake address already used");
      return;
    }
  } else {
    stakeAddress = user.stakeAddress;
  }

  if (address.to_bech32() !== stakeAddress) {
    console.log("Signature address doesnt match registered stake address");
    return;
  }

  const coseKey = Message.COSEKey.from_bytes(Buffer.from(key, "hex"));
  const publicKey = Cardano.PublicKey.from_bytes(
    coseKey
      .header(
        Message.Label.new_int(
          Message.Int.new_negative(Message.BigNum.from_str("2"))
        )
      )
      .as_bytes()
  );

  const stakeKeyHash = publicKey.hash();
  const reconstructedAddress = Cardano.RewardAddress.new(
    address.network_id(),
    Cardano.StakeCredential.from_keyhash(stakeKeyHash)
  );
  if (address.to_bech32() !== reconstructedAddress.to_address().to_bech32()) {
    console.log("Signature address doesnt match public key address");
    return;
  }

  const data = message.signed_data().to_bytes();
  const ed25519Sig = Cardano.Ed25519Signature.from_bytes(message.signature());
  if (!publicKey.verify(data, ed25519Sig)) {
    throw new Error(
      `Message integrity check failed (has the message been tampered with?)`
    );
  } else {
    console.log("Message verified!");
  }

  if (isFirstTimeUser) {
    await database.insertUser({
      user: username,
      userinfo: payloadObj.userinfo,
      stakeAddress: stakeAddress,
      publicKey: payloadObj.publicKey,
      ts: transactionTime,
    });
  }
  await database.insertGuid({ guid: guid });

  if (payloadObj.type == "post") {
    handlePost(username, transactionTime, guid, payloadObj);
  } else if (payloadObj.type == "msg") {
    handleMessage(username, transactionTime, guid, payloadObj);
  } else if (payloadObj.type == "social") {
    handleSocial(username, transactionTime, guid, payloadObj);
  } else {
    console.log("Error: Could not determine type of transaction");
    console.log(payloadObj);
  }

  return true;
}

async function handlePost(username, transactionTime, guid, payloadObj) {
  // TODO validate fields
  await database.insertPost({
    from: username,
    ts: transactionTime,
    guid: guid,
    title: payloadObj.title,
    price: payloadObj.price,
    description: payloadObj.description,
    category: payloadObj.category,
    subcategory: payloadObj.subcategory,
    location: payloadObj.location,
    sublocation: payloadObj.sublocation,
  });

  if (payloadObj.category)
    await database.incrementCategory({ category: payloadObj.category });
  if (payloadObj.subcategory)
    await database.incrementSubcategory({
      subcategory: payloadObj.subcategory,
    });
  if (payloadObj.location)
    await database.incrementLocation({ location: payloadObj.location });
  if (payloadObj.sublocation)
    await database.incrementSublocation({
      sublocation: payloadObj.sublocation,
    });
}

async function handleSocial(username, transactionTime, guid, payloadObj) {
  // TODO validate fields
  let social: any = {
    from: username,
    ts: transactionTime,
    guid: guid,
    content: payloadObj.content,
  };

  if (!payloadObj.parent) {
    // it is a new thread
    social.title = payloadObj.title;
    social.category = payloadObj.category;
  } else {
    // it is a reply
    social.parent = payloadObj.parent;
  }

  await database.insertSocial(social);

  if (social.category)
    await database.incrementSocialCategory({ category: payloadObj.category });
}

async function handleMessage(username, transactionTime, guid, payloadObj) {
  // TODO validate fields
  console.log("Handling message...");
  console.log(payloadObj);
  await database.insertMessage({
    from: username,
    ts: transactionTime,
    guid: guid,
    to: payloadObj.to,
    srcKey: payloadObj.srcKey,
    dstKey: payloadObj.dstKey,
    iv: payloadObj.iv,
    message: payloadObj.message,
  });
}

async function populateDb(lastBlock) {
  const metadataLabel = new NinjaConfig().getCfg().METADATA_LABEL;

  let lastTransaction = {
    hash: "",
    block: lastBlock ?? 1,
    ts: 123,
    metadata: null,
  };

  if (!apiClient) {
    let settings = await getSettings();
    apiClient = initApiClient(settings.provider, settings.apiKey);
  }
  let transactions = await apiClient.getTransactions(lastTransaction);

  for (let transaction of transactions) {
    // check if tx_hash already processed
    let isAlreadyProcessed = await database.findTransaction(transaction.hash);
    if (isAlreadyProcessed) continue;

    console.log(`Processing tx ${transaction.hash}...`);

    // process json metadata
    console.log("Processing: ", transaction.hash);
    try {
      await processTransaction(
        transaction.hash,
        transaction.ts,
        transaction.metadata[metadataLabel]
      );
    } catch (exception) {
      console.log(
        `Failed processing transaction ${transaction.hash}: ${exception}`
      );
    }

    // register tx_hash to our db, so it is skipped next time
    database.insertTransaction({ transactionId: transaction.hash });
  }

  lastBlock = Math.max(lastBlock, ...transactions.map((tx) => tx.block));
  console.log(lastBlock);
  return lastBlock;
}

export { populateDb, setSettings, clearDb };
