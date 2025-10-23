import nadBankLogo from "/assets/LOGO NATBANK.png";
import riceLogo from "/assets/LOGO RICE.png";
import baker from "/assets/Baker.png";
import cfcLogo from "/assets/LOGO TEC CFC.png";
import background from "/assets/Banner.png"
import "./Footer.scss";

const Footer = () => {
  const logos = [nadBankLogo, baker, cfcLogo];
  return (
    <footer className="footer-container">
      <img src={background} className="footer-container__background"/>
      {<div className="footer-container__content">
        {logos.map((item, index) => (
          <div key={index} className="footer-container__logo-box">
            <img src={item} className="footer-container__logo"/>
          </div>
        ))}
      </div>}
    </footer>
  );
};

export default Footer;
