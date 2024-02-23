import './user-modal.css';
import React from 'react';

function UserModal({ user, wallet, selectMessageTarget }) {
  
  return (
    <div className="modal fade" id="userModal" data-bs-backdrop="static" tabIndex={-1} aria-labelledby="userModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="userModalLabel">User</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            { !user || !user.user ? 
            <div>User not found</div>
            :
            <div>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">User name</label>
                <input type="text" className="form-control" id="username"
                  value={user.user} disabled />
              </div>
              <div className="mb-3">
                <label htmlFor="created" className="form-label">Created</label>
                <input type="text" className="form-control" id="created"
                  value={new Date(user.ts*1000).toDateString().substring(4)} disabled />
              </div>
              <div className="mb-3">
                <label htmlFor="userinfo" className="form-label">User info</label>
                <textarea className="form-control" id="userinfo" rows={10}
                  value={user.userinfo} disabled />
              </div>
            </div>
            }
            <hr/>
         </div>
          <div className="modal-footer">
            <button type="button" className={`user-message-button btn btn-dark mx-2 ${wallet ? '' : 'disabled'}`} disabled={!wallet}
              data-bs-toggle="modal" data-bs-target="#createMessageModal" onClick={() => selectMessageTarget(user.user)}>
              Message User
            </button>
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserModal;
