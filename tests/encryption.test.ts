const { generateKeyPairFromPassword, encryptMessage, decryptMessage } = require('../src/encryption');

test('encrypts and decrypts message correctly', async () => {
    const keyPairSrc = await generateKeyPairFromPassword("herpa");
    const keyPairDst = await generateKeyPairFromPassword("derpa");
  
    const message = "hello world";
    const encryptedMessage = await encryptMessage(keyPairSrc.publicKey, keyPairDst.publicKey, message);
   
    const decryptedMessageSrc = await decryptMessage(keyPairSrc.privateKey, encryptedMessage.keySrc, encryptedMessage.iv, encryptedMessage.message);
    const decryptedMessageDst = await decryptMessage(keyPairDst.privateKey, encryptedMessage.keyDst, encryptedMessage.iv, encryptedMessage.message);

    expect(decryptedMessageSrc).toBe(message);
    expect(decryptedMessageDst).toBe(message);
});
