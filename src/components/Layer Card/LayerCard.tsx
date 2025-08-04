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

    const { selectedAGEBS,setSelectedAGEBS } = useAppContext();

    if (!tematicaData || !tematicaData.features) {
        return null; // o un mensaje de error
    }

    // con base a los ID de agebs seleccionados busca en todos los features para sacar el promedio
    //si no hay agebs seleccionados, saca el promedio de todos los features
    function getAverage(features: Feature[], cvegeos: string[], property: string): number {
        if (!tematicaData) return 0;
        if (selectedAGEBS.length === 0) {
            return mapLayerInstance.positiveAvg;
        }
        const values = features
        .filter((f: Feature) => cvegeos.includes((f.properties as { cvegeo: string }).cvegeo))
        .map(f => f.properties?.[property])
        .filter(value => value != null);
        return values.reduce((sum: number, num: number) => sum + num, 0) / values.length;
    }


    const agebAverage = selectedLayerData.formatValue(getAverage(tematicaData.features, selectedAGEBS, selectedLayerData.property));
    
    return (
        <div>
            <div className="layerCard" style={{borderColor: color}}>
                <div className="layerCard__cardTitle" style={{background: color}}> 
                    <p className="layerCard__layerTitle">{selectedLayerData?.title}</p>
                </div>
                <div className="layerCard__layerCardBody">
                    <div>
                        { selectedAGEBS.length === 0 ? (
                            <div>
                                <p className="layerCard__layerDescription">
                                    {selectedLayerData?.description || "No hay descripción disponible."}
                                </p>
                                <p style={{ fontSize: "15px"}}>
                                    Ciudad Juárez tiene un {selectedLayerData.title} de <strong> {agebAverage} </strong>
                                </p>
                            </div>
                        ): (
                            <p style={{ fontSize: "15px"}}>
                                {selectedAGEBS.length == 1 ? "El AGEB seleccionado tiene" : "Los AGEBs seleccionados tienen"} un <strong>{selectedLayerData.formatValue(agebAverage, selectedLayerData.decimalPlaces)}</strong> de {selectedLayerData.title}
                                <strong>{(agebAverage > mapLayerInstance.positiveAvg) ? " ENCIMA " : " DEBAJO"}</strong> de la media de Ciudad Juárez
                            </p>
                        )}
                        {mapLayerInstance.getRangeGraph(agebAverage)}
                    </div>
                </div>
            </div>
            {selectedAGEBS.length > 0 && (
                <Button 
                size={"xs"}
                rounded={"full"}
                p={4}
                onClick={() => setSelectedAGEBS([])}
                style={{ backgroundColor: COLORS.GLOBAL.backgroundDark, color: "white" }} 
                >
                    <p style={{ fontSize: "15px" }}>Limpiar selección</p>
                </Button>
            )}
        </div>
    );
}

export default LayerCard;