import './create-message-modal.css';
import React, { useState } from 'react';

function CreateMessageModal({ username, to, createMessage }) {

  const [formData, setFormData] = useState<any>({});

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.id;

    formData[name] = value;
    setFormData(formData);
  }

  return (
    <div className="modal fade" id="createMessageModal" data-bs-backdrop="static" tabIndex={-1} aria-labelledby="createMessageModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="createMessageModalLabel">Send a message</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {
              username ?
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">User name</label>
                  <input type="text" className="form-control" id="username" placeholder={username} disabled />
                </div>
                :
                <div>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">User name</label>
                    <input type="text" className="form-control" id="username" placeholder="username"
                onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="userinfo" className="form-label">User info</label>
                    <textarea className="form-control" id="userinfo" rows={10} placeholder="Include a description about yourself here.&#10;You might want to include contact information and a PGP key for secure communication.&#10;Remember that anyone can see your description and it will be stored in the blockchain forever!"
                onChange={handleInputChange} />
                  </div>
                </div>
            }            

            <hr/>

            <div className="mb-3">
              <label htmlFor="to" className="form-label">To</label>
              <input type="text" className="form-control" id="to" placeholder={to} disabled />
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea className="form-control" id="message" rows={10} placeholder="Write your message here.&#10;Encrypt your message with PGP!&#10;Remember that anyone can read your message and it will be stored in the blockchain forever!"
                onChange={handleInputChange} />
            </div>

         </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-dark" data-bs-dismiss="modal" 
              onClick={() => createMessage(formData.username, formData.userinfo, to, formData.message)}>Post</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateMessageModal;
