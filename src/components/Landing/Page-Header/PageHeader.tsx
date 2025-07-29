import "./PageHeader.scss";
import { LuMailPlus } from "react-icons/lu";
import {GoPlus } from "react-icons/go";
import { BiGlobe } from "react-icons/bi";

export default function PageHeader() {
    return (
        <header className="page-header">
            <div className="page-header__content">
                <div className="page-header__logo">
                    <p className="page-header__title">
                        <span className="page-header__titleItalic">visor de <br /></span>
                        <span className="page-header__titleBold">indicadores ambientales</span>
                    </p>
                    <div className="page-header__logo-location-icon">
                        <div className="page-header__line" />
                    </div>
                </div>
                <div className="page-header__speed-dial">
                    <div className="page-header__speed-dial-item">
                        <button type="button" aria-label="Ir al visor" onClick={() => window.location.href = "/visor"}>
                            <span className="button-text">Ir al visor</span>
                            <span className="icon"><BiGlobe /></span>
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
                </div>
            </div>
        </header>
    );
}
