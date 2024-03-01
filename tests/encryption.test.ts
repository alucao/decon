const {
  generateKeyPairFromPassword,
  encryptMessage,
  decryptMessage,
} = require("../src/encryption");

test("encrypts and decrypts message correctly", async () => {
  const keyPairSrc = await generateKeyPairFromPassword(
    new TextEncoder().encode("herpa")
  );
  const keyPairDst = await generateKeyPairFromPassword(
    new TextEncoder().encode("derpa")
  );

  const message = "hello world";
  const encryptedMessage = await encryptMessage(
    keyPairSrc.publicKey,
    keyPairDst.publicKey,
    message
  );

  const decryptedMessageSrc = await decryptMessage(
    keyPairSrc.privateKey,
    encryptedMessage.srcKey,
    encryptedMessage.iv,
    encryptedMessage.message
  );
  const decryptedMessageDst = await decryptMessage(
    keyPairDst.privateKey,
    encryptedMessage.dstKey,
    encryptedMessage.iv,
    encryptedMessage.message
  );

  expect(decryptedMessageSrc).toBe(message);
  expect(decryptedMessageDst).toBe(message);
});
