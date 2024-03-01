import { useState, useEffect, useRef } from "react";
import "./message-list.css";

function MessageList({
  messages,
  wallet,
  selectMessageTarget,
  selectUser,
  getEncryptionKey,
  getDecryptedMessage,
}) {
  const [encryptionKey, setEncryptionKey] = useState<KeyPair | null>(null);
  const [decryptedMessages, setDecryptedMessages] = useState<
    Record<string, string>
  >({});

  const hasRun = useRef(false);
  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      getEncryptionKey().then((result) => setEncryptionKey(result));
    }
  }, []);

  useEffect(() => {
    if (!encryptionKey) return;
    messages.forEach((message) => {
      getDecryptedMessage(encryptionKey?.privateKey, message).then(
        (decryptedMessage) => {
          decryptedMessages[message.guid] = decryptedMessage;
          setDecryptedMessages({ ...decryptedMessages });
        }
      );
    });
  }, [encryptionKey, messages]);

  if (!messages || messages.length === 0)
    return <div className="message-list">No messages.</div>;

  if (
    !encryptionKey ||
    !decryptedMessages ||
    messages.some((x) => !decryptedMessages[x.guid])
  )
    return (
      <div className="message-list">
        Messages are encrypted. Sign with your wallet to decrypt private
        messages
      </div>
    );

  return (
    <div className="message-list">
      {messages.map((message) => {
        const decryptedMessageText = decryptedMessages[message.guid];
        console.log("decryptedMessageText");
        console.log(decryptedMessageText);

        return (
          <div className="message" key={message.guid}>
            <span className="message-from">
              <b>From:</b>
              <button
                type="button"
                className="user-button btn btn-link"
                data-bs-toggle="modal"
                data-bs-target="#userModal"
                onClick={() => selectUser(message.from)}
              >
                {message.from}
              </button>
            </span>
            <span className="message-date">
              Date: {new Date(message.ts * 1000).toString()}
            </span>
            <span className="message-text">{decryptedMessageText}</span>
            <button
              type="button"
              className={`message-button btn btn-sm btn-dark mx-2 ${
                wallet ? "" : "disabled"
              }`}
              data-bs-toggle="modal"
              data-bs-target="#createMessageModal"
              onClick={() => selectMessageTarget(message.from)}
            >
              Reply
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default MessageList;
