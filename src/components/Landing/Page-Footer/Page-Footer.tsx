import natBankLogo from "../../../../public/assets/LOGO NATBANK.png";
import riceLogo from "../../../../public/assets/LOGO RICE.png";
import cfcLogo from "../../../../public/assets/LOGO TEC CFC.png";
import footerBackground from "../../../../public/assets/BANNER LOGOS.png"

const PageFooter = () => {
  const logos = [natBankLogo, riceLogo, cfcLogo];
  return (
    <footer style={{  width: "100%", justifyContent: "right", position: "relative", overflow: "hidden"}}>
      <img
        src={footerBackground}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          transform: "translateX(25%)",
        }}
      />
      <div style={{
        position: "relative",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        zIndex: 1,
        
      }}>
        {logos.map((item, index) => (
            <div key={index} >
                <img src={item} style={{ height: "90px", objectFit: "contain" }}/>
            </div>
        ))}
      </div>
    </footer>
  );
};

export default PageFooter;
