import natBankLogo from "../../../assets/LOGO NATBANK.png";
import riceLogo from "../../../assets/LOGO RICE.png";
import cfcLogo from "../../../assets/LOGO TEC CFC.png";
import footerBackground from "../../../assets/BANNER LOGOS.png"

const PageFooter = () => {
  const logos = [natBankLogo, riceLogo, cfcLogo];
  return (
    <footer style={{ position: "relative", width: "100%", }}>
      <img
        src={footerBackground}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
 
        }}
      />
      <div style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
      }}>
        {logos.map((item, index) => (
            <div key={index} >
                <img src={item} style={{ height: "100px", objectFit: "contain" }}/>
            </div>
        ))}
      </div>
    </footer>
  );
};

export default PageFooter;
