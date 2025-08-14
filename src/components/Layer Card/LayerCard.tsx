import { useAppContext } from "../../context/AppContext";
import { COLORS } from "../../utils/constants";
import type {Feature} from "geojson";
import "./LayerCard.scss";

type LayerCardProps = {
    selectedLayerData: any;
    tematicaData: { features: Feature[] };
    color: string;
    mapLayerInstance: any;
};


const LayerCard = ({ selectedLayerData, tematicaData, color, mapLayerInstance }: LayerCardProps) => {

    const { selectedAGEBS, selectedColonias, activeLayerKey } = useAppContext();
    //const rangeGraphRef = useRef<HTMLDivElement>(null);
    const selected = activeLayerKey === "agebs" ? selectedAGEBS : selectedColonias;


    const average = mapLayerInstance.getAverage(tematicaData.features, selected, selectedLayerData.property, activeLayerKey);
    const averageFormatted = selectedLayerData.formatValue(average);
    const description = mapLayerInstance.getDescription(selected, selectedLayerData.title, activeLayerKey, averageFormatted);

    return (
        <div>
            <div className="layerCard" style={{borderColor: color}}>
                <div className="layerCard__cardTitle" style={{background: color}}> 
                    <p className="layerCard__layerTitle">{selectedLayerData?.title}</p>
                </div>
                <div className="layerCard__layerCardBody">
                    <div>
                        <p style={{ fontSize: "15px" }}>{description}</p>
                    </div>
                </div>
                <div ref={mapLayerInstance.ref} style={{ overflow: "hidden", padding: "8px"}}>
                    {mapLayerInstance.getRangeGraph(selected.length > 0 ? average: undefined, mapLayerInstance.ref)}
                </div>
            </div>
        </div>
    );
}

export default LayerCard;