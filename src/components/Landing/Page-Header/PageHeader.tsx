import "./PageHeader.scss";
import { LuMailPlus } from "react-icons/lu";
import {GoPlus } from "react-icons/go";
import { BiGlobe } from "react-icons/bi";

export default function PageHeader() {
    return (
        <header className="page-header" >
            <div className="page-header__content" style={{ padding: "0rem 7rem 0rem 3rem", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                {/* TITULO */}
                <div className="page-header__logo" style={{ padding: "1.5rem 0rem", marginLeft: "0rem", borderBottom: "2px solid black", width: "100%" }}>
                    <p className="page-header__title" >
                        <span className="page-header__titleItalic">visor de <br /></span>
                        <span className="page-header__titleBold">indicadores ambientales</span>
                    </p>
                </div>

                {/* ICONOS */}
                {/*<div className="page-header__speed-dial" style={{ position: "absolute", top: "5rem", right: "2rem", zIndex: 3, border:"1px solid green"}}>
                    <div className="page-header__speed-dial-item">
                        <button type="button" aria-label="Ir al visor" onClick={() => window.location.href = "/visor"}>
                            <span className="button-text">Ir al visor</span>
                            <span className="icon"><img src={VisorIcon} style={{ height: "24px" }} /></span>
                        </button>
                    </div>
                    <div className="page-header__speed-dial-item">
                        <button type="button" aria-label="Email Us">
                            <span className="button-text">Enviar correo </span>
                            <span className="icon"><LuMailPlus /></span>
                        </button>
                    </div>
                    <div className="page-header__speed-dial-item">
                        <button type="button" aria-label="Add New">
                            <span className="button-text">Add New</span>
                            <span className="icon"><GoPlus /></span>
                        </button>
                    </div>
                </div>*/}
            </div>
        </header>
    );
}
