import { useAppContext } from "../../context/AppContext";
import type {Feature} from "geojson";
import "./LayerCard.scss";
import { IoInformationCircleSharp } from "react-icons/io5";


type LayerCardProps = {
    selectedLayerData: any;
    tematicaData: { features: Feature[] };
    color: string;
    mapLayerInstance: any;
    rangeGraphRef: React.RefObject<HTMLDivElement | null>;
    onInfoHover: any;
    layerCardRef?: React.RefObject<HTMLDivElement | null>;
};


const LayerCard = ({ selectedLayerData, tematicaData, color, mapLayerInstance, rangeGraphRef, onInfoHover, layerCardRef }: LayerCardProps) => {

    const { selectedAGEBS, selectedColonias, activeLayerKey, selectionMode } = useAppContext();
    const isRadius = selectionMode === "radius";

    const selected = isRadius
        ? tematicaData.features.map(f => f.properties[activeLayerKey === "agebs" ? "cvegeo" : "name"])
        : activeLayerKey === "agebs" ? selectedAGEBS : selectedColonias;

    //const selected = activeLayerKey === "agebs" ? selectedAGEBS : selectedColonias;

    const average = mapLayerInstance.getAverage(
        tematicaData.features, 
        selected, 
        selectedLayerData.property, 
        activeLayerKey
    );
    const averageFormatted = selectedLayerData.formatValue(average);
    const description = mapLayerInstance.getDescription(selected, selectedLayerData.title, activeLayerKey, averageFormatted);

    return (
        <div className="layerCard" style={{borderColor: color}} ref={layerCardRef}>
            <div className="layerCard__header" style={{background: color}}> 
                <p className="layerCard__header__title">
                    {selected.length === 0 ? selectedLayerData.title : 
                    `${selectedLayerData?.title} por ${activeLayerKey === "agebs" ? "AGEBS" : "Colonias"}`}
                </p>
                <span
                    //ref={layerCardRef}
                    onMouseEnter={() => onInfoHover(true)}
                    onMouseLeave={() => onInfoHover(false)}
                    style={{ display: "inline-block", cursor: "pointer" }}
                >
                    <IoInformationCircleSharp className="layerCard__header__icon"/>
                </span>
            </div>
            <div className="layerCard__layerCardBody">
                <p>{description}</p>
            </div>
            <div ref={rangeGraphRef} style={{ overflow: "hidden", padding: " 1dvw 0.5dvw 1.3dvw 0.5dvw" }}>
                {mapLayerInstance.getRangeGraph(selected.length > 0 ? average: undefined)}
            </div>
        </div>
    );
}

export default LayerCard;