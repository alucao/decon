import './message-list.css';

function MessageList({ messages, wallet, selectMessageTarget, selectUser }) {

  console.log(messages);

  if (!messages || messages.length === 0)
    return <div className="message-list">No messages.</div>

  return (
    <div className="message-list">
      {
        messages.map((message) => {
          return <div className="message" key={message.guid}>
            <span className="message-from">
              <b>From:</b>
              <button type="button" className="user-button btn btn-link" 
                data-bs-toggle="modal" data-bs-target="#userModal" onClick={() => selectUser(message.from)} >
                {message.from}
              </button>
            </span>
            <span className="message-date">Date: {new Date(message.ts*1000).toString()}</span>
            <span className="message-text">{message.message}</span>
            <button type="button" className={`message-button btn btn-sm btn-dark mx-2 ${wallet ? '' : 'disabled'}`} 
              data-bs-toggle="modal" data-bs-target="#createMessageModal" onClick={() => selectMessageTarget(message.from)}>
              Reply
            </button>
          </div>
        })
      }
    </div>
  );
}

export default MessageList;
