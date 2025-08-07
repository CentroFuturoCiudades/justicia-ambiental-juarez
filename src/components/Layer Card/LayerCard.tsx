import { Button } from "@chakra-ui/react";
import { useAppContext } from "../../context/AppContext";
import { COLORS } from "../../utils/constants";
import type {Feature} from "geojson";
import "./LayerCard.scss";
import { formatNumber } from "../../utils/utils";

type LayerCardProps = {
    selectedLayerData: any;
    tematicaData: { features: Feature[] };
    color: string;
    mapLayerInstance: any;
};


const LayerCard = ({ selectedLayerData, tematicaData, color, mapLayerInstance }: LayerCardProps) => {

    const { selectedAGEBS, setSelectedAGEBS, selectedColonias_geojson, setSelectedColonias_geojson, activeLayerKey } = useAppContext();

    if (!tematicaData || !tematicaData.features) {
        return null; // o un mensaje de error
    }
    const selected = activeLayerKey === "agebs" ? selectedAGEBS : selectedColonias_geojson;

    // con base a los ID de agebs seleccionados busca en todos los features para sacar el promedio
    //si no hay agebs seleccionados, saca el promedio de todos los features
    function getAverage(features: Feature[], selectedIds: string[] , property: string): number {
        if (!tematicaData) return 0;

        if (selectedIds.length === 0) {
            return mapLayerInstance.positiveAvg;
        }
        const idField = activeLayerKey === "agebs" ? "cvegeo" : "name";
        const values = features
        .filter((f: Feature) => selectedIds.includes((f.properties as any)[idField]))
        .map(f => f.properties?.[property])
        .filter(value => value != null);
        return values.reduce((sum: number, num: number) => sum + num, 0) / values.length;
    }


    //const agebAverage = getAverage(tematicaData.features, selectedAGEBS, selectedLayerData.property);
    const agebAverage = getAverage(tematicaData.features, selected, selectedLayerData.property);
    const agebAverageFormatted = selectedLayerData.formatValue(agebAverage);
    
    return (
        <div>
            <div className="layerCard" style={{borderColor: color}}>
                <div className="layerCard__cardTitle" style={{background: color}}> 
                    <p className="layerCard__layerTitle">{selectedLayerData?.title}</p>
                </div>
                <div className="layerCard__layerCardBody">
                    <div>
                        { selected.length === 0 ? (
                            <div>
                                <p style={{ fontSize: "15px"}}>
                                    Ciudad Juárez tiene un {selectedLayerData.title} de <strong>{agebAverageFormatted}</strong>.
                                </p>
                            </div>
                        ): (
                            <p style={{ fontSize: "15px"}}>
                                {selected.length == 1 ? "El AGEB seleccionado tiene" : "Los AGEBs seleccionados tienen"} un {selectedLayerData.title} de <strong>{agebAverageFormatted}</strong>; por
                                <strong>{(agebAverage > mapLayerInstance.positiveAvg) ? " ENCIMA " : " DEBAJO"}</strong> de la media de Ciudad Juárez.
                            </p>
                        )}
                        {mapLayerInstance.getRangeGraph(selected.length > 0 ? agebAverage : undefined)}
                    </div>
                </div>
            </div>
            {selected.length > 0 && (
                <Button 
                size={"xs"}
                rounded={"full"}
                p={4}
                onClick={() => activeLayerKey === "agebs" ? setSelectedAGEBS([]) : setSelectedColonias_geojson([])}
                style={{ backgroundColor: COLORS.GLOBAL.backgroundDark, color: "white" }} 
                >
                    <p style={{ fontSize: "15px" }}>Limpiar selección</p>
                </Button>
            )}
        </div>
    );
}

export default LayerCard;