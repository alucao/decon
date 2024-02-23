import './navigation-bar.css';
import WalletButton from '../wallet-button/WalletButton';
import CategoryList from '../category-list/category-list';
import { useState } from 'react';

function NavigationBar({ showMarket, selectSocial, selectMarket, selectSettings, selectMessages, wallet, setWallet, messages, username,
categories, selectCategory }) {

  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navigation-navbar-smartphone navbar navbar-expand-xl navbar-light bg-light">
      <div className="container-fluid">
        <div className="navigation-fixed-smartphone">

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation"
          onClick={toggleNavbar}>
          <span className="navbar-toggler-icon"></span>
        </button>

          <div className='navigation-smartphone'>
            {
              showMarket ? (
                <button type="button" className={`btn btn-dark mx-2 ${wallet ? '' : 'disabled'}`} disabled={!wallet} data-bs-toggle="modal" data-bs-target="#createPostModal">
                  Post Market
                </button>)
                :
                (
                  <button type="button" className={`btn btn-dark mx-2 ${wallet ? '' : 'disabled'}`} disabled={!wallet} data-bs-toggle="modal" data-bs-target="#createSocialModal">
                    Post Social
                  </button>)
            }
            <WalletButton wallet={wallet} setWallet={setWallet} username={username} />
          </div>
        </div>
        <div className={`${isOpen ? "open" : ""} collapse navbar-collapse`} id="navbarNavAltMarkup"
          onClick={toggleNavbar}
          >
          <div className="left-bar navbar-nav">
            <a key="cat-social" className={`nav-item nav-link nav-messages mr-sm-2 float-end`} onClick={() => selectSocial()}>Social</a>
            <a key="cat-market" className={`nav-item nav-link nav-messages mr-sm-2 float-end`} onClick={() => selectMarket()}>Market</a>
            <a key="cat-faq" className={`nav-item nav-link nav-messages mr-sm-2 float-end`} data-bs-toggle="modal" data-bs-target="#faqModal">FAQ</a>
          </div>
          <div className="right-bar navbar-nav ms-auto">
            <a key="cat-settings" className={`nav-item nav-link nav-messages mr-sm-2 float-end`} onClick={() => selectSettings()}>
              ⚙️ Settings
            </a>
            <a key="cat-messages" className={`nav-item nav-link nav-messages mr-sm-2 float-end ${wallet ? '' : 'disabled'}`} onClick={() => selectMessages()}>
              ✉ Messages ({messages ? messages.length : '0'})
            </a>
          </div>
          <div className='navigation-smartphone'>
            <CategoryList categories={categories} selectCategory={selectCategory} />
          </div>
        </div>
        <div className='navigation-desktop'>
          {
            showMarket ? (
              <button type="button" className={`btn btn-dark mx-2 ${wallet ? '' : 'disabled'}`} disabled={!wallet} data-bs-toggle="modal" data-bs-target="#createPostModal">
                Post Market
              </button>)
              :
              (
                <button type="button" className={`btn btn-dark mx-2 ${wallet ? '' : 'disabled'}`} disabled={!wallet} data-bs-toggle="modal" data-bs-target="#createSocialModal">
                  Post Social
                </button>)
          }
          <WalletButton wallet={wallet} setWallet={setWallet} username={username} />
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
