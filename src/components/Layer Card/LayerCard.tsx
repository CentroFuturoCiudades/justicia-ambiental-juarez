import { Button } from "@chakra-ui/react";
import { useAppContext } from "../../context/AppContext";
import { COLORS } from "../../utils/constants";
import type {Feature} from "geojson";
import "./LayerCard.scss";
import { formatNumber } from "../../utils/utils";
import { active } from "d3";

type LayerCardProps = {
    selectedLayerData: any;
    tematicaData: { features: Feature[] };
    color: string;
    mapLayerInstance: any;
};


const LayerCard = ({ selectedLayerData, tematicaData, color, mapLayerInstance }: LayerCardProps) => {

    const { selectedAGEBS, setSelectedAGEBS, selectedColonias, setSelectedColonias, activeLayerKey } = useAppContext();

    if (!tematicaData || !tematicaData.features) {
        return null; // o un mensaje de error
    }
    const selected = activeLayerKey === "agebs" ? selectedAGEBS : selectedColonias;
    const singleSelected = activeLayerKey === "agebs" ? "El AGEB seleccionado tiene" : "La colonia seleccionada tiene";
    const multipleSelected = activeLayerKey === "agebs" ? "Los AGEBs seleccionados tienen" : "Las colonias seleccionadas tienen";

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

    const average = getAverage(tematicaData.features, selected, selectedLayerData.property);
    const averageFormatted = selectedLayerData.formatValue(average);
    
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
                                    Ciudad Juárez tiene un {selectedLayerData.title} de <strong>{averageFormatted}</strong>.
                                </p>
                            </div>
                        ): (
                            <p style={{ fontSize: "15px"}}>
                                {selected.length == 1 ? singleSelected : multipleSelected } un {selectedLayerData.title} de <strong>{averageFormatted}</strong>; por
                                <strong>{(average > mapLayerInstance.positiveAvg) ? " ENCIMA " : " DEBAJO"}</strong> de la media de Ciudad Juárez.
                            </p>
                        )}
                        {mapLayerInstance.getRangeGraph(selected.length > 0 ? average : undefined)}
                    </div>
                </div>
            </div>
            {selected.length > 0 && (
                <Button 
                size={"xs"}
                rounded={"full"}
                p={4}
                onClick={() => activeLayerKey === "agebs" ? setSelectedAGEBS([]) : setSelectedColonias([])}
                style={{ backgroundColor: COLORS.GLOBAL.backgroundDark, color: "white" }} 
                >
                    <p style={{ fontSize: "15px" }}>Limpiar selección</p>
                </Button>
            )}
        </div>
    );
}

export default LayerCard;