import React from "react";

import "./Landing.scss";

const Landing = ()=> {
    
    return (
        <div className="landing">
            <div className="landing__header">
                Header
                <div>Test <p>test2</p></div>
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