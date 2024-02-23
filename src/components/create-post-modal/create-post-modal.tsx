import './create-post-modal.css';
import React, { useState } from 'react';

function CreatePostModal({ username, createPost, categories, subcategories, locations, sublocations}) {

  const [formData, setFormData] = useState<any>({});

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.id;

    formData[name] = value;
    setFormData(formData);
  }

  return (
    <div className="modal fade" id="createPostModal" data-bs-backdrop="static" tabIndex={-1} aria-labelledby="createPostModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="createPostModalLabel">Post item</h5>
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
              <label htmlFor="title" className="form-label">Title</label>
              <input type="text" className="form-control" id="title" placeholder="Post title" 
                onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">Price</label>
              <input type="text" className="form-control" id="price" placeholder="10 USD"
                onChange={handleInputChange} />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea className="form-control" id="description" rows={10} placeholder="Post description.&#10;You might want to include contact information and a PGP key for secure communication.&#10;Remember that anyone can see your description and it will be stored in the blockchain forever!"
                onChange={handleInputChange} />
            </div>

            <div className="mb-3">
              <label htmlFor="category" className="form-label">Category</label>
              <input className="form-control" list="categoryOptions" id="category" placeholder="Type an existing category or a new one"
                onChange={handleInputChange} />
              <datalist id="categoryOptions">
                { categories ? categories.map((x) => <option key={x.name} value={x.name} /> ) : '' }
              </datalist>
            </div>

            <div className="mb-3">
              <label htmlFor="subcategory" className="form-label">Sub-category</label>
              <input className="form-control" list="subcategoryOptions" id="subcategory" placeholder="Type an existing sub-category or a new one"
                onChange={handleInputChange} />
              <datalist id="subcategoryOptions">
                { subcategories ? subcategories.map((x) => <option key={x.name} value={x.name} /> ) : '' }
              </datalist>
            </div>

            <div className="mb-3">
              <label htmlFor="location" className="form-label">Ships from</label>
              <input className="form-control" list="locationOptions" id="location" placeholder="Type an existing location or a new one"
                onChange={handleInputChange} />
              <datalist id="locationOptions">
                { locations ? locations.map((x) => <option key={x.name} value={x.name} /> ) : '' }
              </datalist>
            </div>

            <div className="mb-3">
              <label htmlFor="sublocation" className="form-label">Ships to</label>
              <input className="form-control" list="sublocationOptions" id="sublocation" placeholder="Type where the service is available"
                onChange={handleInputChange} />
              <datalist id="sublocationOptions">
                { sublocations ? sublocations.map((x) => <option key={x.name} value={x.name} />) : '' }
              </datalist>
            </div>

         </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-dark" data-bs-dismiss="modal" 
              onClick={() => createPost(formData.username, formData.userinfo, formData.title, formData.price, formData.description, formData.category, formData.subcategory, formData.location, formData.sublocation)}>Post</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePostModal;
