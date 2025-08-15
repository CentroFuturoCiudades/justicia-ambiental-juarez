import { useAppContext } from "../../context/AppContext";
import { COLORS } from "../../utils/constants";
import type {Feature} from "geojson";
import { useRef } from "react";
import "./LayerCard.scss";
import { IoInformationCircleSharp } from "react-icons/io5";


type LayerCardProps = {
    selectedLayerData: any;
    tematicaData: { features: Feature[] };
    color: string;
    mapLayerInstance: any;
    rangeGraphRef: React.RefObject<HTMLDivElement | null>;
};


const LayerCard = ({ selectedLayerData, tematicaData, color, mapLayerInstance, rangeGraphRef }: LayerCardProps) => {

    const { selectedAGEBS, selectedColonias, activeLayerKey } = useAppContext();
    const selected = activeLayerKey === "agebs" ? selectedAGEBS : selectedColonias;

    const average = mapLayerInstance.getAverage(tematicaData.features, selected, selectedLayerData.property, activeLayerKey);
    const averageFormatted = selectedLayerData.formatValue(average);
    const description = mapLayerInstance.getDescription(selected, selectedLayerData.title, activeLayerKey, averageFormatted);

    return (
        <div>
            <div className="layerCard" style={{borderColor: color}}>
                <div className="layerCard__cardTitle" style={{background: color}}> 
                    {selected.length === 0 ? 
                        <p>{selectedLayerData?.title}</p>
                    : 
                        <p>{selectedLayerData?.title} por {(activeLayerKey === "agebs" ? "AGEBS" : "Colonias")}</p>
                    }

                    <IoInformationCircleSharp />
                </div>
                <div className="layerCard__layerCardBody">
                    <div>
                        <p>{description}</p>
                    </div>
                </div>
                <div ref={rangeGraphRef} style={{ overflow: "hidden", padding: "8px"}}>
                    {mapLayerInstance.getRangeGraph(selected.length > 0 ? average: undefined)}
                </div>
                <div>
                    <p className="layerCard__source">Fuente: XXX </p>
                </div>
            </div>
        </div>
    );
}

export default LayerCard;