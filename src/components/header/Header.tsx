import './Header.css';

function Header() {

  let currentSite:string|null = null;
  if (window.location.host === "disabled.decon.app")
    currentSite = "Mainnet";
  if (window.location.host === "testnet.decon.app")
    currentSite = "Testnet";

  return (
    <div className="header">

      { currentSite ?
        <div className="network-selector dropdown">
          <button className="btn btn-dark btn-primary btn-sm dropdown-toggle" type="button" id="dropdownNetwork" data-bs-toggle="dropdown" aria-expanded="false">
            {currentSite}
          </button>
          <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownNetwork">
            <li><button className="dropdown-item" type="button" onClick={() => window.location.href="https://decon.app" }>Mainnet</button></li>
            <li><button className="dropdown-item" type="button" onClick={() => window.location.href="https://testnet.decon.app" }>Testnet</button></li>
          </ul>
        </div>
      : ''
      }
     <span className='text-center'>decon</span>
    </div>
  );
}

export default Header;
