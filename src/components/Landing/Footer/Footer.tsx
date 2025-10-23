import nadBankLogo from "/assets/LOGO NATBANK.png";
import riceLogo from "/assets/LOGO RICE.png";
import bakerInstituteLogo from "/assets/BakerLOGO.png";
import cfcLogo from "/assets/LOGO TEC CFC.png";
import background from "/assets/Banner.png"
import "./Footer.scss";

const Footer = () => {
  const logos = [nadBankLogo, riceLogo, cfcLogo];
  return (
    <footer className="footer-container">
      <img src={background} className="footer-container__background"/>
      {<div className="footer-container__content">
        {logos.map((item, index) => (
            <img key={index} src={item} className="footer-container__image"/>
        ))}
      </div>}
    </footer>
  );
};

export default Footer;
