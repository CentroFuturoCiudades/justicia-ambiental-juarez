import "./PageHeader.scss";
import { LuMailPlus } from "react-icons/lu";
import {GoPlus } from "react-icons/go";
import { BiGlobe } from "react-icons/bi";

export default function PageHeader() {
    return (
        <header className="page-header" >
            <div className="page-header__content" >
                {/* TITULO */}
                <div className="page-header__logo" >
                    <p className="page-header__title" >
                        <span className="page-header__titleItalic">visor de <br /></span>
                        <span className="page-header__titleBold">indicadores ambientales</span>
                    </p>
                </div>

            </div>
        </header>
    );
}
