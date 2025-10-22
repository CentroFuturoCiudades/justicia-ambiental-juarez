import "./Header.scss";
import VisorIcon from "/assets/Icono MAPA IR AL VISOR.png";


export default function Header() {
    return (
        <header className="page-header" >
            <div className="page-header__logo" >
                <div className="page-header__title" >
                    <span className="page-header__title__italic">visor de <br /></span>
                    <span className="page-header__title__bold">indicadores<br /></span>
                    <span className="page-header__title__bold">ambientales y sociales</span>
                </div>
                <div style={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <span style={{fontFamily: 'Lovelo Black', fontSize: 'min(6dvh, 4dvw)', textAlign: 'center'}}>
                        CIUDAD JUÁREZ, CHIHUAHUA
                    </span>
                </div>
            </div>
            <button className="button_visor" onClick={() => window.location.href = "/visor"}>
                <img src={VisorIcon} alt="Visor Icon" className="img"/>
            </button>
        </header>
    );
}
