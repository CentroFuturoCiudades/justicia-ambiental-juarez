import "./Landing.scss";
import QuadrantMenu from "./Quadrant-Menu/QuadrantMenu";
import PageHeader from "./Page-Header/PageHeader";

import "./Body-Accordion/AccordionComponent";
import AccordionComponent from "./Body-Accordion/AccordionComponent";
const Landing = () => {

    return (
        <div className="landing">
            <div className="landing__header">
                <PageHeader />
                {/* HEADER COMPONENT */}
            </div>
            <div className="landing__body">
                <AccordionComponent />
            </div>
            <div className="landing__footer">
                Footer
                {/* FOOTER COMPONENT */}
            </div>
        </div>
    )
}

export default Landing;