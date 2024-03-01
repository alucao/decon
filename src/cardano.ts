import { generateKeyPairFromPassword, hexStringToBytes } from "./encryption";
import NinjaConfig from "./ninjaConfig";
const Cardano = await (async () =>
  await require("@emurgo/cardano-serialization-lib-browser"))();
const MessageLib = await (async () =>
  await require("@emurgo/cardano-message-signing-browser"))();

const yaml = require("js-yaml");
let Buffer = require("buffer/").Buffer;

const getStakeAddress = async (api: any): Promise<string> => {
  console.log("START getStakeAddress " + api);
  let rewardAddress = await api.getRewardAddresses();
  let stakeAddressHex = rewardAddress[0];
  let stakeAddress = Cardano.Address.from_bytes(
    Buffer.from(stakeAddressHex, "hex")
  ).to_bech32();
  return stakeAddress;
};

const sendMetadata = async (
  api: any,
  metadataJsonObj: Message | Post | Social,
  _username: string,
  userinfo: string
) => {
  const metadataLabelKey = new NinjaConfig().getCfg().METADATA_LABEL.toString();

  // if it is new user
  if (_username) {
    const stakeAddress = await getStakeAddress(api);
    const secretSignature = await getStakeAddressSignature(api);
    const keyPair = await generateKeyPairFromPassword(
      hexStringToBytes(secretSignature)
    );

    // TODO add strong typing
    (metadataJsonObj as any).from = _username;
    (metadataJsonObj as any).userinfo = userinfo;
    (metadataJsonObj as any).stakeAddr = stakeAddress;
    (metadataJsonObj as any).publicKey = keyPair.publicKey;
  }

  console.log(yaml.load(metadataJsonObj));
  console.log(JSON.stringify(metadataJsonObj));
  let cose = await signMessage(api, yaml.dump(metadataJsonObj));
  let signature = cose.signature;
  let key = cose.key;

  const auxiliaryData = Cardano.AuxiliaryData.new();
  const map = Cardano.MetadataMap.new();

  let signatureChunks = chunkBy64(signature);
  for (let i = 0; i < signatureChunks.length; ++i) {
    map.insert(
      Cardano.TransactionMetadatum.new_text(`s_${i}`),
      Cardano.TransactionMetadatum.new_text(signatureChunks[i])
    );
  }
  let keyChunks = chunkBy64(key);
  for (let i = 0; i < keyChunks.length; ++i) {
    map.insert(
      Cardano.TransactionMetadatum.new_text(`k_${i}`),
      Cardano.TransactionMetadatum.new_text(keyChunks[i])
    );
  }

  const metadatum = Cardano.TransactionMetadatum.new_map(map);
  const generalTransactionMetadata = Cardano.GeneralTransactionMetadata.new();
  generalTransactionMetadata.insert(
    Cardano.BigNum.from_str(metadataLabelKey),
    metadatum
  );
  auxiliaryData.set_metadata(generalTransactionMetadata);

  return await sendTransaction(api, auxiliaryData);
};

const sendTransaction = async (api: any, auxiliaryData: any) => {
  console.log("START createTransaction");

  let protocolParams = {
    linearFee: {
      minFeeA: "44",
      minFeeB: "155381",
    },
    //minUtxo: "34482",
    minUtxo: "4310",
    poolDeposit: "500000000",
    keyDeposit: "2000000",
    maxValSize: 5000,
    maxTxSize: 16384,
    priceMem: 0.0577,
    priceStep: 0.0000721,
    //coinsPerUtxoWord: "34482",
    coinsPerUtxoWord: "4310",
  };

  let txBuilder = Cardano.TransactionBuilder.new(
    Cardano.TransactionBuilderConfigBuilder.new()
      .fee_algo(
        Cardano.LinearFee.new(
          Cardano.BigNum.from_str(protocolParams.linearFee.minFeeA),
          Cardano.BigNum.from_str(protocolParams.linearFee.minFeeB)
        )
      )
      .pool_deposit(Cardano.BigNum.from_str(protocolParams.poolDeposit))
      .key_deposit(Cardano.BigNum.from_str(protocolParams.keyDeposit))
      .coins_per_utxo_word(
        Cardano.BigNum.from_str(protocolParams.coinsPerUtxoWord)
      )
      .max_value_size(protocolParams.maxValSize)
      .max_tx_size(protocolParams.maxTxSize)
      .prefer_pure_change(true)
      .build()
  );

  let changeAddress = await api.getChangeAddress();
  let shelleyChangeAddress = Cardano.Address.from_bytes(
    Buffer.from(changeAddress, "hex")
  );

  let websiteWalletAddress = new NinjaConfig().getCfg().WALLET_ADDRESS;
  let shelleyOutputAddress = Cardano.Address.from_bech32(websiteWalletAddress);

  console.log("Adding output");
  txBuilder.add_output(
    Cardano.TransactionOutput.new(
      shelleyOutputAddress,
      Cardano.Value.new(Cardano.BigNum.from_str("1000000"))
    )
  );
  console.log("Setting aux data");
  txBuilder.set_auxiliary_data(auxiliaryData);
  console.log("Adding inputs");

  let txUnspentOutputs = Cardano.TransactionUnspentOutputs.new();
  const rawUtxos = await api.getUtxos();
  for (let rawUtxo of rawUtxos) {
    let utxo = Cardano.TransactionUnspentOutput.from_bytes(
      Buffer.from(rawUtxo, "hex")
    );
    console.log("Adding utxo", utxo);
    txUnspentOutputs.add(utxo);
  }
  console.log(txUnspentOutputs);
  console.log(txUnspentOutputs.len());
  txBuilder.add_inputs_from(
    txUnspentOutputs,
    Cardano.CoinSelectionStrategyCIP2.LargestFirstMultiAsset
  );
  console.log("Adding change");
  txBuilder.add_change_if_needed(shelleyChangeAddress);
  console.log("Building");
  const txBody = txBuilder.build();

  const transactionWitnessSet = Cardano.TransactionWitnessSet.new();
  const tx = Cardano.Transaction.new(
    txBody,
    Cardano.TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes()),
    auxiliaryData
  );

  console.log("Signing");
  let txVkeyWitnesses = await api.signTx(
    Buffer.from(tx.to_bytes(), "utf8").toString("hex"),
    true
  );

  console.log("Setting witnesses");
  txVkeyWitnesses = Cardano.TransactionWitnessSet.from_bytes(
    Buffer.from(txVkeyWitnesses, "hex")
  );
  transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

  console.log("Creating transaction");
  const signedTx = Cardano.Transaction.new(
    tx.body(),
    transactionWitnessSet,
    tx.auxiliary_data()
  );

  console.log("Submiting");
  const submittedTxHash = await api.submitTx(
    Buffer.from(signedTx.to_bytes(), "utf8").toString("hex")
  );
  console.log(submittedTxHash);

  return submittedTxHash;
};

// secret used to generate the private key for private messages
export const getStakeAddressSignature = async (api: any) => {
  const cached_signature = new NinjaConfig().getCfg()
    .STAKE_ADDRESS_SIGNATURE_SECRET;
  if (cached_signature) {
    console.log("cached signature found");
    return cached_signature;
  }

  const rewardAddress = await api.getRewardAddresses();
  const stakeAddressHex = rewardAddress[0];
  const stakeAddress = Cardano.Address.from_bytes(
    Buffer.from(stakeAddressHex, "hex")
  );
  const messageText = `This signature is required to decrypt private messages for ${stakeAddress.to_bech32()}`;
  console.log(messageText);
  const cose = await api.signData(
    stakeAddressHex,
    Buffer.from(messageText).toString("hex")
  );
  let signature = cose.signature;
  console.log("signature", signature);

  new NinjaConfig().getCfg().STAKE_ADDRESS_SIGNATURE_SECRET = signature;

  return signature;
};

const signMessage = async (api: any, json: any) => {
  const rewardAddress = await api.getRewardAddresses();
  const stakeAddressHex = rewardAddress[0];
  console.log("rewardAddress", rewardAddress);
  const cose = await api.signData(
    stakeAddressHex,
    Buffer.from(json).toString("hex")
  );
  console.log("cose", cose);

  let key = cose.key;
  let signature = cose.signature;

  const message = MessageLib.COSESign1.from_bytes(
    Buffer.from(Buffer.from(signature, "hex"), "hex")
  );
  console.log("message", message);

  const headermap = message.headers().protected().deserialized_headers();
  const address = Cardano.Address.from_bytes(
    headermap.header(MessageLib.Label.new_text("address")).as_bytes()
  );
  const coseKey = MessageLib.COSEKey.from_bytes(Buffer.from(key, "hex"));
  const publicKey = Cardano.PublicKey.from_bytes(
    coseKey
      .header(
        MessageLib.Label.new_int(
          MessageLib.Int.new_negative(MessageLib.BigNum.from_str("2"))
        )
      )
      .as_bytes()
  );
  console.log(
    "publicKey: " + Buffer.from(publicKey.as_bytes()).toString("hex")
  );

  let stakeAddress = Cardano.Address.from_bytes(
    Buffer.from(stakeAddressHex, "hex")
  );
  if (address.to_bech32() !== stakeAddress.to_bech32()) {
    console.log(
      "Signature address does not match stake address",
      address,
      stakeAddress
    );
    return;
  }

  let payloadBytes = message.payload();
  let payload = Buffer.from(payloadBytes, "hex");
  console.log("payload", payload.toString("utf-8"));

  const data = message.signed_data().to_bytes();
  const ed25519Sig = Cardano.Ed25519Signature.from_bytes(message.signature());
  if (!publicKey.verify(data, ed25519Sig)) {
    throw new Error(
      `Message integrity check failed (has the message been tampered with?)`
    );
  } else {
    console.log("Message verified!");
  }

  return cose;
};

const chunkBy64 = (str: string) => {
  let size = 64;
  const numChunks = Math.ceil(str.length / size);
  const chunks = new Array(numChunks);

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size);
  }
  return chunks;
};

export { getStakeAddress, sendMetadata };
