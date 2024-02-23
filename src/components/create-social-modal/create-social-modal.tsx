import './create-social-modal.css';
import React, { useState } from 'react';

function CreateSocialModal({ username, parent, createSocial, socialcategories}) {

  const [formData, setFormData] = useState<any>({});

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.id;

    formData[name] = value;
    setFormData(formData);
  }

  return (
    <div className="modal fade" id="createSocialModal" data-bs-backdrop="static" tabIndex={-1} aria-labelledby="createSocialModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="createSocialModalLabel">Post social</h5>
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

            {parent ? <></> :
              (<div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input type="text" className="form-control" id="title" placeholder="Post title"
                  onChange={handleInputChange} />
              </div>)
            }
            <div className="mb-3">
              <label htmlFor="content" className="form-label">Content</label>
              <textarea className="form-control" id="content" rows={10} placeholder="Your message"
                onChange={handleInputChange} />
            </div>

            {parent ? <></> :
              (<div className="mb-3">
                <label htmlFor="socialcategory" className="form-label">Category</label>
                <input className="form-control" list="socialcategoryOptions" id="socialcategory" placeholder="Type an existing category or a new one"
                  onChange={handleInputChange} />
                <datalist id="socialcategoryOptions">
                  {socialcategories ? socialcategories.map((x) => <option key={x.name} value={x.name} />) : ''}
                </datalist>
              </div>)
            }

         </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-dark" data-bs-dismiss="modal" 
              onClick={() => createSocial(formData.username, formData.userinfo, parent, formData.title, formData.content, formData.socialcategory)}>Post</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateSocialModal;
