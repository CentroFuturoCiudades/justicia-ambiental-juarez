import natBankLogo from "/assets/LOGO NATBANK.png";
import riceLogo from "/assets/LOGO RICE.png";
import cfcLogo from "/assets/LOGO TEC CFC.png";
import footerBackground from "/assets/BANNER LOGOS.png"
import "./Page-Footer.scss";

const PageFooter = () => {
  const logos = [natBankLogo, riceLogo, cfcLogo];
  return (
    <footer className="footer-container">
      <img src={footerBackground} className="footer-container__background"/>
      <div className="footer-container__content">
        {logos.map((item, index) => (
            <div key={index} >
                <img src={item} className="footer-container__image"/>
            </div>
        ))}
      </div>
    </footer>
  );
};

export default PageFooter;
