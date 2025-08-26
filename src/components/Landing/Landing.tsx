import "./Landing.scss";
//import QuadrantMenu from "./Quadrant-Menu/QuadrantMenu";
import PageHeader from "./Page-Header/PageHeader";
import PageFooter from "./Page-Footer/Page-Footer";
//import AccordionComponent from "./Body-Accordion/AccordionComponent";
import LandingBackground from "/assets/Fondo.jpg";
import Accordion from "./Body-Accordion/Accordion";
import VisorIcon from "/assets/Icono MAPA IR AL VISOR.png";


const Landing = () => {

    return (
        <div className="landing">
                
            {/*<div className="landing__header">
                <PageHeader />
            </div>*/}

            <img src={LandingBackground} className="landing__background" />


            <div className="landing__body" >
                <PageHeader />
                <Accordion/>
            </div>


            <div className="landing__footer" style={{ width: "100%"}}>
                <PageFooter />
            </div>
        </div>
)
}

export default Landing;