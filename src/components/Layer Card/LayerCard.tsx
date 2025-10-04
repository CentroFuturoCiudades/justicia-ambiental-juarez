import { useAppContext } from "../../context/AppContext";
import "./LayerCard.scss";
import { IoInformationCircleSharp } from "react-icons/io5";
import { use, useEffect, useState, type JSX } from "react";

type LayerCardProps = {
    selectedLayerData: any;
    rangeGraphRef: React.RefObject<HTMLDivElement | null>;
    onInfoHover: React.Dispatch<React.SetStateAction<boolean>>;
    layerCardRef?: React.RefObject<HTMLDivElement | null>;
};


const LayerCard = ({ selectedLayerData, rangeGraphRef, onInfoHover, layerCardRef }: LayerCardProps) => {

    const { 
        selectedAGEBS, 
        selectedColonias, 
        activeLayerKey, 
        //selectionMode,
        mapLayerInstance,
        tematicaData,
        filteredFeatures,
    } = useAppContext();

    useEffect(() => {
        console.log("Filtered features:", filteredFeatures);
    }, [filteredFeatures]);

    if ( !activeLayerKey || !mapLayerInstance ) return;

    const themeKey = selectedLayerData?.tematica;
    const selected = activeLayerKey === "agebs" ? selectedAGEBS : selectedColonias; // si esta cambiando cuando agrego colonias
 
    const average = mapLayerInstance.getAverage(
        //tematicaData.features,
        tematicaData.allFeatures, 
        selected, 
        selectedLayerData.property, 
        activeLayerKey
    );
    const category = selectedLayerData.descriptionCategories?.[Math.trunc(average)];
    const description = mapLayerInstance.getDescription(
        selected, //agebs/colonias selected
        activeLayerKey, // key
        average, //average number
        selectedLayerData.formatValue, //format function
        selectedLayerData.descriptionCategories, //categories object (optional)
        selectedLayerData.juarezCard, //juarez card JSX
        selectedLayerData.selectionCard, //selection card JSX
        category, //category string
    );

    return (
        <div className={`layerCard layerCard--${themeKey}`} ref={layerCardRef}>
            <div className={`layerCard__header layerCard--${themeKey}`}> 
                <p className="layerCard__header__title">
                    {selected.length === 0 ? selectedLayerData.title : 
                    `${selectedLayerData?.title} por ${activeLayerKey === "agebs" ? "AGEBS" : "Colonias"}`}
                </p>
                <span
                    onMouseEnter={() => onInfoHover(true)}
                    onMouseLeave={() => onInfoHover(false)}
                    style={{ display: "inline-block", cursor: "pointer" }}
                >
                    <IoInformationCircleSharp className="layerCard__header__icon"/>
                </span>
            </div>
            <div className="layerCard__body">
                <p>{description}</p>
            </div>
            <div ref={rangeGraphRef} style={{ overflow: "hidden", padding: " 1dvw 0.5dvw 1.5dvw 0.5dvw" }}>
                {mapLayerInstance?.getRangeGraph(selected.length > 0 ? average: 0, selected.length)}
            </div>
        </div>
    );
}

export default LayerCard;