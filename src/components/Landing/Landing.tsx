import "./Landing.scss";
import QuadrantMenu from "./Quadrant-Menu/QuadrantMenu";
import PageHeader from "./Page-Header/PageHeader";

import "./Body-Accordion/AccordionComponent";
import AccordionComponent from "./Body-Accordion/AccordionComponent";
const Landing = ()=> {
    
    return (
        <div className="landing">
            <div className="landing__header">
                <PageHeader />
                {/* HEADER COMPONENT */}
            </div>
            <div className="landing__body">
                Body
                {/* BODY COMPONENT */}
                <QuadrantMenu mainHeader="Main Header" items={[
                    {
                        title: "Item 1",
                        description: "Description for item 1",
                        iconUrl: "https://via.placeholder.com/100",
                        url: "#",
                        mainHeader: ""
                    },
                    {
                        title: "Item 2",
                        description: "Description for item 2",
                        iconUrl: "https://via.placeholder.com/100",
                        url: "#",
                        mainHeader: ""
                    },
                    {
                        title: "Item 3",
                        description: "Description for item 3",
                        iconUrl: "https://via.placeholder.com/100",
                        url: "#",
                        mainHeader: ""
                    },
                    {
                        title: "Item 4",
                        description: "Description for item 4",
                        iconUrl: "https://via.placeholder.com/100",
                        url: "#",
                        mainHeader: ""
                    }
                ]} />
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