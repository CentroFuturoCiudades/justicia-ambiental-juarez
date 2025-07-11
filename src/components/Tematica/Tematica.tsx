import { SECTIONS, LAYERS } from "../../utils/constants";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import "./Tematica.scss";
import { FaCaretDown } from "react-icons/fa";

const Tematica = () => {
    const { selectedLayers, setSelectedLayers } = useAppContext();

    const [selectedSection, setSelectedSection] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleSectionChange = (sectionKey: string) => {
        setSelectedSection(prev => prev === sectionKey ? "" : sectionKey);
    };

    const handleLayerToggle = (layerKey: string) => {
        setSelectedLayers(prev => prev === layerKey ? "" : layerKey);
    }

    return (
        <div className="tematica-container">
            <div className="tematica__dropdown-header" onClick={() => setIsOpen((prev) => !prev)}>
                <h1 style={{ fontSize: "1.1rem", margin: 0, fontWeight: 600 }}>Temática</h1>
                <span 
                    className={`tematica__arrow${isOpen ? " open" : ""}`}
                    style={{ marginLeft: "auto" }}
                >
                    <FaCaretDown size={38}/>
                </span>
            </div>
            
            {isOpen && (
                <div className="tematica__dropdown-content">
                    {Object.entries(SECTIONS).map(([sectionKey, section]) => {
                        const isSectionOpen = selectedSection === sectionKey;
                        return (
                            <div key={sectionKey} className="tematica__section">
                                <div className="tematica__section-header" onClick={() => handleSectionChange(sectionKey)}>
                                    <p style={{ fontSize: "1.1rem", margin: 0 }}> {section.label} </p>
                                    <span 
                                        className="tematica__section-arrow"
                                        style={{ marginLeft: "auto" }}
                                    >
                                        < FaCaretDown size={38}/>
                                    </span>
                                </div>


                                {isSectionOpen && (
                                    <div>
                                        {section.layers.map((layerKey) => (
                                            <label key={layerKey} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedLayers.includes(layerKey)}
                                                    onChange={() => handleLayerToggle(layerKey)}
                                                    style={{ marginRight: "0.5rem", fontSize: "1rem" }}
                                                /> 
                                                <p style={{fontSize: "1.1rem", margin: 0}}> {LAYERS[layerKey]?.title || layerKey} </p>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Tematica;

