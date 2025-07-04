import React from "react";

import "./Landing.scss";
import PageHeader from "./Page-Header/PageHeader";

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
            </div>
            <div className="landing__footer">
                Footer
                {/* FOOTER COMPONENT */}
            </div>
        </div>
    )
}

export default Landing;