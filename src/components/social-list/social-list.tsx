import './social-list.css';

function SocialList({ socials, wallet, selectSocialTarget, selectUser }) {

  const renderSocial = function (social, level) {
    return (
      <div key={`main-social-${social.guid}`} className={level % 2 == 0 ? "social-thread social-thread-even" : "social-thread social-thread-odd" } >
        <a data-bs-toggle="collapse" href={`#social-${social.guid}`} role="button" aria-expanded="true" aria-controls={`social-${social.guid}`} className='social-expander'></a>
        <div key={`social-${social.guid}`} id={`social-${social.guid}`} className="collapse show">
          <span className="social-user">👤
            <button type="button" className="user-button btn btn-link"
              data-bs-toggle="modal" data-bs-target="#userModal" onClick={() => selectUser(social.from)} >
              <b>{social.from}</b>
            </button>
          </span>
          <span className="social-date">{new Date(social.ts * 1000).toString()}</span>
          <span className="social-content">{social.content}</span>
          <button type="button" className={`social-reply-button btn btn-sm btn-dark mx-2 ${wallet ? '' : 'disabled'}`} disabled={!wallet}
            data-bs-toggle="modal" data-bs-target="#createSocialModal" onClick={() => selectSocialTarget(social.guid)}>
            Reply
          </button>
          <div>
            {
              socials.filter(x => x.parent && x.parent == social.guid).map(x => {
                return renderSocial(x, level + 1);
              })
            }
          </div>
        </div>
      </div>
    )
  }

  if (!socials || socials.length === 0)
    return <div className="social-list">No socials found.</div>

  return (
    <div className="social-list">
      {
        socials.filter(social => !social.parent).map((social) => {
          return <div key={`social-post-${social.guid}`} className="social">
            <h4 className="social-title">
            {social.title}
            </h4>
            {renderSocial(social, 0)}
          </div>
        })
      }
    </div>
  );
}

export default SocialList;
