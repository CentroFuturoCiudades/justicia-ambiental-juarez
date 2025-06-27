import React from "react";

import "./Landing.scss";
import Footer from "../Footer/Footer";

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
            </div>
            <div className="landing__footer">
                <Footer />
            </div>
        </div>
    )
}

export default Landing;