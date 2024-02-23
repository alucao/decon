import './Footer.css';

function Footer() {
  return (
    <div className="footer">
      <span className="d-inline"></span>
      <a href="https://github.com/alucao/decon" target="_blank">{process.env.REACT_APP_IS_DEMO ? 'decon source code:' : '' }<img src="images/github-logo.png" alt="Github" width="20px" /></a>
      <a href="https://twitter.com/decon_" target="_blank"><img src="images/logo-white.png" alt="X" width="15px" /></a>
      <a href="https://discord.gg/P5XQsE6xkx" target="_blank"><img src="images/discord-mark-white.png" alt="Discord" width="18px" /></a>
    </div>
  );
}

export default Footer;
