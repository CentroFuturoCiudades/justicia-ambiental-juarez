import "./PageHeader.scss";

export default function PageHeader() {
    return (
        <header className="page-header" >
            {/* TITULO */}
            <div className="page-header__logo" >
                <p className="page-header__title" >
                    <span className="page-header__titleItalic">visor de <br /></span>
                    <span className="page-header__titleBold">indicadores ambientales</span>
                </p>
            </div>
        </header>
    );
}
