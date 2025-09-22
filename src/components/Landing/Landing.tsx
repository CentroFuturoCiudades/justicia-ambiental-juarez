import "./Landing.scss";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import LandingBackground from "/assets/Fondo.jpg";
import Body from "./Body/Body";


const Landing = () => {

    return (
        <div className="landing">

            <img src={LandingBackground} className="landing__background" />

            <div className="landing__main" >
                <Header />
                <div className="landing__body" >
                    <Body />
                </div>
            </div>

            <div className="landing__footer" >
                <Footer />
            </div>
        </div>
)
}

export default Landing;