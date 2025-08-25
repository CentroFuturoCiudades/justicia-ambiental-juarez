import "./PageHeader.scss";
import VisorIcon from "/assets/Icono MAPA IR AL VISOR.png";


export default function PageHeader() {
    return (
        <header className="page-header" >
            {/* TITULO */}
            <div className="page-header__logo" >
                <p className="page-header__title" >
                    <span className="page-header__title__italic">visor de <br /></span>
                    <span className="page-header__title__bold">indicadores<br /></span>
                    <span className="page-header__title__bold">ambientales y sociales</span>
                </p>
            </div>
                <button  className="button_visor" onClick={() => window.location.href = "/visor"}>
                    <img src={VisorIcon} alt="Visor Icon" className="img"/>
                </button>
        </header>
    );
}
