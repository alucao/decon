const { encrypt, decrypt, PrivateKey } = require("eciesjs");

const crypto =
  typeof window !== "undefined" ? window.crypto : require("crypto");
const subtle = crypto.subtle;
import { Buffer } from "buffer";

// create a random symmetric key
// encrypt the symmetric key with the public key from the source
// encrypt the symmetric key with the public key from the destination
// encrypt the message with the symmetric key
// return { key_src, key_dst, iv, message }
async function encryptMessage(
  publicKeyHexSrc: string,
  publicKeyHexDst: string,
  message: string
): Promise<EncryptedMessage> {
  if (!publicKeyHexSrc) throw new Error("publicKeyHexSrc is required");
  if (!publicKeyHexDst) throw new Error("publicKeyHexDst is required");
  if (!message) throw new Error("message is required");

  const symmetricKey = await generateSymmetricKey();
  const symmetricKeyHex = await getHexFromKey(symmetricKey);

  const iv = generateRandomBytes(12);
  const encryptedMessage = await encryptWithSymmetricKey(
    message,
    symmetricKey,
    iv
  );

  const data = Buffer.from(symmetricKeyHex);
  const encryptedSymmetricKeySrc: Buffer = encrypt(publicKeyHexSrc, data);
  const encryptedSymmetricKeyDst: Buffer = encrypt(publicKeyHexDst, data);

  return {
    srcKey: encryptedSymmetricKeySrc.toString("hex"),
    dstKey: encryptedSymmetricKeyDst.toString("hex"),
    iv: getHex(iv),
    message: getHex(encryptedMessage),
  };
}

// decrypt the symmetric key with the private key
// decrypt the message with the symmetric key
async function decryptMessage(
  privateKey: string,
  encryptedSymmetricKey: string,
  iv: string,
  message: string
): Promise<string> {
  if (!privateKey) throw new Error("privateKey is required");
  if (!encryptedSymmetricKey)
    throw new Error("encryptedSymmetricKey is required");
  if (!iv) throw new Error("iv is required");
  if (!message) throw new Error("message is required");

  const decryptedSymmetricKeyHex = decrypt(
    privateKey,
    Buffer.from(encryptedSymmetricKey, "hex")
  );
  const decryptedSymmetricKey = await importSymmetricKeyFromHex(
    decryptedSymmetricKeyHex.toString()
  );
  const decryptedMessage = await decryptWithSymmetricKey(
    Buffer.from(message, "hex"),
    Buffer.from(iv, "hex"),
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

  const encryptedData = await subtle.encrypt(algorithm, key, textBytes);
  return encryptedData;
}

async function decryptWithSymmetricKey(
  ciphertext: ArrayBuffer,
  iv: ArrayBuffer,
  key: CryptoKey
): Promise<string> {
  const algorithm = { name: "AES-GCM", iv };
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
  return await subtle.generateKey(algorithm, true, ["encrypt", "decrypt"]);
}

async function generateKeyPairFromPassword(
  passwordBytes: Uint8Array
): Promise<KeyPair> {
  const salt = Uint8Array.from({ length: 16 }, () => 0);
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordBytes,
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

export {
  hexStringToBytes,
  generateKeyPairFromPassword,
  encryptMessage,
  decryptMessage,
};
