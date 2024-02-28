const { encrypt, decrypt, PrivateKey } = require("eciesjs");

interface KeyPair {
  publicKey: string;
  privateKey: string;
}

interface EncryptedMessage {
  keySrc: string;
  keyDst: string;
  iv: string;
  message: string;
}

// create a random symmetric key
// encrypt the symmetric key with the public key from the source
// encrypt the symmetric key with the public key from the destination
// encrypt the message with the symmetric key
// return { key_src, key_dst, iv, message }
async function encryptMessage(publicKeyHexSrc: string, publicKeyHexDst: string, message: string): Promise<EncryptedMessage> {
  const symmetricKey = await generateSymmetricKey();
  const symmetricKeyHex = await getHexFromKey(symmetricKey);

  const iv = generateRandomBytes(12);
  const encryptedMessage = await encryptWithSymmetricKey(
    message,
    symmetricKey,
    iv
  );
  console.log("encryptedMessage");
  console.log(getHex(encryptedMessage));

  const data = Buffer.from(symmetricKeyHex);
  const encryptedSymmetricKeySrc: Buffer = encrypt(publicKeyHexSrc, data);
  console.log("encryptedSymmetricKeySrc");
  console.log(encryptedSymmetricKeySrc.toString("hex"));
  const encryptedSymmetricKeyDst: Buffer = encrypt(publicKeyHexDst, data);
  console.log("encryptedSymmetricKeyDst");
  console.log(encryptedSymmetricKeyDst.toString("hex"));

  return {
    keySrc: encryptedSymmetricKeySrc.toString("hex"),
    keyDst: encryptedSymmetricKeyDst.toString("hex"),
    iv: getHex(iv),
    message: getHex(encryptedMessage),
  }
}

async function decryptMessage(privateKey: string, encryptedSymmetricKey:string, iv: string, message: string): Promise<string> {
  // decrypt the symmetric key with the private key
  // decrypt the message with the symmetric key
  const decryptedSymmetricKeyHex = decrypt(privateKey, Buffer.from(encryptedSymmetricKey, 'hex'));
  const decryptedSymmetricKey = await importSymmetricKeyFromHex(decryptedSymmetricKeyHex.toString());
  const decryptedMessage = await decryptWithSymmetricKey(
    Buffer.from(message, 'hex'),
    Buffer.from(iv, 'hex'),
    decryptedSymmetricKey
  );  
  return decryptedMessage;
}

function generateRandomBytes(size: number): Uint8Array {
  const randomValues = new Uint8Array(size);
  crypto.getRandomValues(randomValues);
  return randomValues;
}

async function encryptWithSymmetricKey(
  text: string,
  key: CryptoKey,
  iv: Uint8Array
): Promise<ArrayBuffer> {
  const textBytes = new TextEncoder().encode(text);
  const algorithm = { name: "AES-GCM", iv: iv };

  const crypto = require("crypto"); // window.crypto || window.webkitCrypto;
  const subtle = crypto.subtle;
  const encryptedData = await subtle.encrypt(algorithm, key, textBytes);
  return encryptedData;
}

async function decryptWithSymmetricKey(
  ciphertext: ArrayBuffer,
  iv: ArrayBuffer,
  key: CryptoKey
): Promise<string> {
  const algorithm = { name: "AES-GCM", iv };
  const crypto = require("crypto"); // window.crypto || window.webkitCrypto;
  const subtle = crypto.subtle;
  const decryptedData = await subtle.decrypt(algorithm, key, ciphertext);
  return new TextDecoder().decode(decryptedData); // Convert to string
}

async function getHexFromKey(key: CryptoKey): Promise<string> {
  const rawKeyData = await crypto.subtle.exportKey("raw", key);
  return getHex(rawKeyData);
}

function getHex(arrayBuffer: ArrayBuffer): string {
  const bytes = new Uint8Array(arrayBuffer);
  return bytes.reduce(
    (hex, byte) => hex + byte.toString(16).padStart(2, "0"),
    ""
  );
}

async function importSymmetricKeyFromHex(hexKey: string): Promise<CryptoKey> {
  const keyData = hexStringToBytes(hexKey);
  const importedKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );
  return importedKey;
}

function hexStringToBytes(hexString: string): Uint8Array {
  const bytes = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
  }
  return bytes;
}
async function generateSymmetricKey() {
  const algorithm = { name: "AES-GCM", length: 256 };
  const crypto = require("crypto"); // window.crypto;
  const subtle = crypto.subtle;
  return await subtle.generateKey(algorithm, true, ["encrypt", "decrypt"]);
}

async function generateKeyPairFromPassword(password: string): Promise<KeyPair> {
  const passwordBuffer = new TextEncoder().encode(password);
  const salt = Uint8Array.from({ length: 16 }, () => 0);
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: salt,
      iterations: 610000,
    },
    keyMaterial,
    32 * 8
  );
  const derivedBitsHex = Array.from(new Uint8Array(derivedBits))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  const privateKey = PrivateKey.fromHex(derivedBitsHex);
  const publicKey = privateKey.publicKey;

  return {
    publicKey: publicKey.toHex(),
    privateKey: privateKey.toHex(),
  };
}

export  { generateKeyPairFromPassword, encryptMessage, decryptMessage };
