import "./Landing.scss";

import "./Body-Accordion/AccordionComponent";
import AccordionComponent from "./Body-Accordion/AccordionComponent";
const Landing = ()=> {
    
    return (
        <div className="landing">
            <div className="landing__header">
                Header
                {/* HEADER COMPONENT */}
            </div>
            <div className="landing__body">
                Body
                {/* BODY COMPONENT */}
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