import "./PageHeader.scss";
import { FaLocationDot } from "react-icons/fa6";
import { LuMailPlus } from "react-icons/lu";
import { GoDownload } from "react-icons/go";
import { GoPlus } from "react-icons/go";

export default function PageHeader() {
    return (
        <header className="page-header">
            <div className="page-header__content">
                <div className="page-header__logo">
                    <div className="page-header__logo-title">
                        <h1 className="page-header__title">
                            <span className="line start">herramienta</span>
                            <span className="line center">de evaluación</span>
                            <span className="line start">ambiental</span>
                        </h1>
                    </div>
                    <div className="page-header__logo-location-icon">
                        <svg className="page-header__line" viewBox="0 0 100 1" preserveAspectRatio="none" aria-hidden="true">
                            <line x1="0" y1="0" x2="100" y2="0" stroke="black" strokeWidth="1" />
                        </svg>
                        <FaLocationDot />
                    </div>
                </div>
            </div>
            <div className="page-header__speed-dial">
                <div className="page-header__speed-dial-item">
                    <button>
                        <span className="button-text">Send Email</span>
                        <span className="icon">
                            <LuMailPlus />
                        </span>
                    </button>

                </div>
                <div className="page-header__speed-dial-item">
                    <button>
                        <span className="button-text">Download</span>
                        <span className="icon">
                            <GoDownload />
                        </span>
                    </button>
                </div>
                <div className="page-header__speed-dial-item">
                    <button>

                        <span className="button-text">Add New</span>
                        <span className="icon">
                            <GoPlus />
                        </span>

                    </button>
                </div>
            </div>
        </header>
    );
}