import './item-list.css';

function ItemList({ items, wallet, selectMessageTarget, selectUser }) {

  if (!items || items.length === 0)
    return <div className="item-list">No items found.</div>

  return (
    <div className="item-list">
      {
        items.map((post) => {
          return <div className="item" key={post.guid}>
            <h4 className="item-title">
            <a data-bs-toggle="collapse" href={`#post-${post.guid}`} role="button" aria-expanded="false" aria-controls={`post-${post.guid}`}>{post.title}</a>
            </h4>
            <span className="item-price">Price: {post.price}</span>
            <div id={`post-${post.guid}`} className="collapse">
              <span className="item-date">Date: {new Date(post.ts*1000).toString()}</span>
              <span className="item-category">Category: {post.category} ({post.subcategory})</span>
              <span className="item-location">Ships from: {post.location}</span>
              <span className="item-location">Ships to: {post.sublocation}</span>
              <span className="item-description">Description: {post.description}</span>
              <span className="item-seller">Seller: 
              <button type="button" className="user-button btn btn-link" 
                data-bs-toggle="modal" data-bs-target="#userModal" onClick={() => selectUser(post.from)} >
                <b>{post.from}</b>
              </button>
              </span>
              <button type="button" className={`item-message-button btn btn-sm btn-dark mx-2 ${wallet ? '' : 'disabled'}`} disabled={!wallet}
                data-bs-toggle="modal" data-bs-target="#createMessageModal" onClick={() => selectMessageTarget(post.from)}>
                Message Seller 
              </button>
 
            </div>

          </div>
        })
      }
    </div>
  );
}

export default ItemList;
