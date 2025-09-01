import "./Landing.scss";
import PageHeader from "./Page-Header/PageHeader";
import PageFooter from "./Page-Footer/Page-Footer";
import LandingBackground from "/assets/Fondo.jpg";
import Accordion from "./Body-Accordion/Accordion";


const Landing = () => {

    return (
        <div className="landing">

            <img src={LandingBackground} className="landing__background" />

            <div className="landing__main" >
                <PageHeader />
                <div className="landing__body" >
                    <Accordion />
                </div>
            </div>

            <div className="landing__footer" style={{ width: "100%"}}>
                <PageFooter />
            </div>
        </div>
)
}

export default Landing;