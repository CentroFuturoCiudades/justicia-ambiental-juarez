import { useAppContext } from "../../context/AppContext";
import "./LayerCard.scss";
import { IoInformationCircleSharp } from "react-icons/io5";

type LayerCardProps = {
    selectedLayerData: any;
    rangeGraphRef: React.RefObject<HTMLDivElement | null>;
    onInfoHover: any;
    layerCardRef?: React.RefObject<HTMLDivElement | null>;
};


const LayerCard = ({ selectedLayerData, rangeGraphRef, onInfoHover, layerCardRef }: LayerCardProps) => {

    const { 
        selectedAGEBS, 
        selectedColonias, 
        activeLayerKey, 
        selectionMode,
        mapLayerInstance,
        tematicaData,
    } = useAppContext();

    if ( !activeLayerKey || !mapLayerInstance ) return null;

    const themeKey = selectedLayerData?.tematica;
    const isRadius = selectionMode === "radius";

    const selected = isRadius
        ? tematicaData.features.map(f => f.properties[activeLayerKey === "agebs" ? "cvegeo" : "name"])
        : activeLayerKey === "agebs" ? selectedAGEBS : selectedColonias;

    const average = mapLayerInstance.getAverage(
        tematicaData.features, 
        selected, 
        selectedLayerData.property, 
        activeLayerKey
    );
    const averageFormatted = selectedLayerData.formatValue(average);
    const description = mapLayerInstance.getDescription(selected, selectedLayerData.title, activeLayerKey, averageFormatted);

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
            <div ref={rangeGraphRef} style={{ overflow: "hidden", padding: " 1dvw 0.5dvw 1.3dvw 0.5dvw" }}>
                {mapLayerInstance.getRangeGraph(selected.length > 0 ? average: 0)}
            </div>
        </div>
    );
}

export default LayerCard;