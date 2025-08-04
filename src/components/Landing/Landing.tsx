import "./Landing.scss";
//import QuadrantMenu from "./Quadrant-Menu/QuadrantMenu";
import PageHeader from "./Page-Header/PageHeader";
import PageFooter from "./Page-Footer/Page-Footer";
import "./Body-Accordion/AccordionComponent";
//import AccordionComponent from "./Body-Accordion/AccordionComponent";
import LandingBackground from "../../../public/assets/Fondo.jpg";
import Accordion from "./Body-Accordion/Accordion";

const Landing = () => {

    return (
        <div className="landing">
                
            <div className="landing__header">
                <PageHeader />
            </div>

            <div className="landing__body" >
                <Accordion/>
            </div>

            <img src={LandingBackground} style={{zIndex: -1, position: "absolute"}}/>

            <div className="landing__footer" style={{ width: "100%"}}>
                <PageFooter />
            </div>
        </div>
)
}

export default Landing;