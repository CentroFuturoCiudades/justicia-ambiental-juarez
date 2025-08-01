import "./Landing.scss";
import QuadrantMenu from "./Quadrant-Menu/QuadrantMenu";
import PageHeader from "./Page-Header/PageHeader";
import PageFooter from "./Page-Footer/Page-Footer";
import "./Body-Accordion/AccordionComponent";
import AccordionComponent from "./Body-Accordion/AccordionComponent";
import LandingBackground from "../../assets/Fondo.jpg";
import Accordion from "./Body-Accordion/Accordion";
import { Box, Button } from "@chakra-ui/react";
import VisorIcon from "../../assets/Icono MAPA IR AL VISOR.png";
import ContactIcon from "../../assets/Icono CONTACTO.png";
import MoreIcon from "../../assets/Icono MAS_EQUIPO.png";


const Landing = () => {

    return (
        <div className="landing">
                
            <div className="landing__header">
                <PageHeader />
            </div>

            <div className="landing__body" >
                <Accordion/>
            </div>
                
            {/*buttons*/}

            <div className="speed-dial">
                <div className="speed-dial__item">
                    <button type="button" aria-label="Ir al visor" onClick={() => window.location.href = "/visor"}>
                        <span className="icon">
                            <img src={VisorIcon} alt="Visor Icon" style={{ height: '50px' }} />
                        </span>
                    </button>
                </div>
                <div className="speed-dial__item">
                    <button type="button" aria-label="Ir al visor" onClick={() => window.location.href = "/visor"}>
                        <span className="button-text">contacto</span>
                        <span className="icon">
                            <img src={ContactIcon} alt="Contact Icon" style={{ height: '50px' }} />
                        </span>
                    </button>
                </div>
                <div className="speed-dial__item">
                    <button type="button" aria-label="Ir al visor" onClick={() => window.location.href = "/visor"}>
                        <span className="button-text">equipo</span>
                        <span className="icon">
                            <img src={MoreIcon} alt="More Icon" style={{ height: '50px' }} />
                        </span>
                    </button>
                </div>
            </div>


            <img src={LandingBackground} style={{zIndex: -1, position: "absolute"}}/>
            <div className="landing__footer" style={{ width: "100%"}}>
                <PageFooter />
            </div>
        </div>
)
}

export default Landing;