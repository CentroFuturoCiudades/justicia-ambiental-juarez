import "./Landing.scss";
import QuadrantMenu from "./Quadrant-Menu/QuadrantMenu";
import PageHeader from "./Page-Header/PageHeader";
import PageFooter from "./Page-Footer/Page-Footer";

import "./Body-Accordion/AccordionComponent";
import AccordionComponent from "./Body-Accordion/AccordionComponent";
const Landing = () => {

    return (
        <div>
        <div className="landing">
            <div className="landing__header">
                <PageHeader />
                {/* HEADER COMPONENT */}
            </div>
            <div className="landing__body">
                <AccordionComponent />
            </div>
            <div className="footer">
                <PageFooter />
            </div>
        </div>
    </div>
)
}

export default Landing;