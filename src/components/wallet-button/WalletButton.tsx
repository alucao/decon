import React, { useState } from 'react';
import './WalletButton.css';
  
function WalletButton({ wallet, setWallet, username }) {

  const [wallets] = useState(getWallets);

  function getWallets(): Array<any> {
    let wallets: Array<any> = [];

    if (!window.cardano)
      return wallets;

    for (let walletName in window.cardano) {
      if (window.cardano[walletName].enable)
        wallets.push(window.cardano[walletName])
    }

    console.log(wallets)
    return wallets;
  }

  async function connectWallet(_wallet: any) {
    console.log(_wallet)
    if (!wallet) {
      console.log('setting wallet')
      let currentWallet = _wallet;
      setWallet(currentWallet);
    }
  }

  if (wallets.length === 0)
    return <div>
      <button className="btn btn-dark wallet-button" type="button" id="wallet-button" onClick={() => alert("No wallet found. Read the FAQ on how to set up a wallet.")}>
        Connect Wallet
      </button>
    </div>


  if (wallet)
    return <div>
      <button className="btn btn-dark wallet-button disabled" type="button" id="wallet-button" disabled>
        { username ? `Connected as ${username}` : `Connected to ${wallet.name}` }
      </button>
    </div>

  return (
    <div>
      {
        wallets.length > 1 ?

          <div className="dropdown">
            <button className="btn btn-dark wallet-button dropdown-toggle" type="button" id="connectMenu" data-bs-toggle="dropdown" aria-expanded="false">
              Connect Wallet
            </button>
            <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end" aria-labelledby="connectMenu">
              {
                wallets.map( w => 
                  <li key={w.name}><button className="dropdown-item" type="button" onClick={() => connectWallet(w)}>{w.name}</button></li>
                )
              }
            </ul>
          </div>
          :
          <button className="btn btn-dark wallet-button" type="button" id="wallet-button" onClick={() => connectWallet(wallets[0])}>
            {wallet == null ? "Connect Wallet" : wallet.name}
          </button>
      }
    </div>
  );
}

export default WalletButton;
