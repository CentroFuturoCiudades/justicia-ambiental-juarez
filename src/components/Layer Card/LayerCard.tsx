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

    // con base a los ID de agebs seleccionados busca en todos los features
    // lo dejo asi? o guardo de una los cvegeos y el property que quiero calcular?
    function getAverage(features: Feature[], cvegeos: string[], property: string): number {
        const values = features
        .filter((f: Feature) => cvegeos.includes((f.properties as { cvegeo: string }).cvegeo))
        .map(f => f.properties?.[property])
        .filter(value => value != null);
        return values.reduce((sum: number, num: number) => sum + num, 0) / values.length;
    }

    // SWITCH para obtener el "calculo" o metrica de AGEBS dependiendo de la propiedad stat_type de la layer (ahorita solo hay promedio)
    /*const getAGEBMetric = (stat_type: string, property: string) : any => {
        switch (stat_type) {
            case "promedio":
                return getAverage(tematicaData.features, selectedAGEBS, property).toFixed(2);
            default:
                return null;
        }
    } */

    const agebAverage = getAverage(tematicaData.features, selectedAGEBS, selectedLayerData.property);
    
    return (
        <div>
            <div className="layerCard" style={{borderColor: color}}>
                <div className="layerCard__cardTitle" style={{background: color}}> 
                    <p className="layerCard__layerTitle">{selectedLayerData?.title}</p>
                </div>
                <div className="layerCard__layerCardBody">
                    { selectedAGEBS.length == 0 ? (
                        <p className="layerCard__layerDescription">
                            {selectedLayerData?.description || "No hay descripción disponible."}
                        </p>
                    ) : (
                        <div>
                            {/* texto fixed, ahorita todas van a decir promedio */}
                            <p style={{ fontSize: "15px"}}>
                                El AGEB seleccionado tiene un <strong>{selectedLayerData.formatValue(agebAverage, selectedLayerData.decimalPlaces)}</strong> de {selectedLayerData.title}
                                <strong>{(agebAverage > mapLayerInstance.positiveAvg) ? " ENCIMA " : " DEBAJO"}</strong> de la media de Ciudad Juárez
                            </p>
                            {mapLayerInstance.getRangeGraph(agebAverage)}
                        </div>
                    )}
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