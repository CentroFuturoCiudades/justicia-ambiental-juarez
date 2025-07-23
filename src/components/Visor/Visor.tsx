import React from "react";

import "./Visor.scss";
import DeckGL from "deck.gl";
import Map from "react-map-gl/mapbox";
import { useAppContext } from "../../context/AppContext";
import Tematica from "../Tematica/Tematica";
import CapasBase from "../Capas Base/CapasBase";
import { LAYERS, COLORS, CAPAS_BASE } from "../../utils/constants";
import { Box } from "@chakra-ui/react";
import { GeoJsonLayer } from "deck.gl";
import { useEffect, useState } from "react";
import ZoomControls from "../ZoomControls/ZoomControls";
import { MapLayer } from "../../classes/MapLayer";
import LayerCard from "../Layer Card/LayerCard";

const REACT_APP_MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const REACT_APP_SAS_TOKEN = import.meta.env.VITE_AZURE_SAS_TOKEN;


const Visor = ()=> {

    /* UNA SOLA CAPA SELECCIONADA A LA VEZ */
    const { viewState, setViewState, selectedLayer, selectedBaseLayers, selectedAGEBS, setSelectedAGEBS } = useAppContext();
    const selectedLayerData = selectedLayer ? LAYERS[selectedLayer as keyof typeof LAYERS] : undefined;
    const tematicaKey = selectedLayerData?.tematica as keyof typeof COLORS | undefined;
    const sectionColor = tematicaKey ? COLORS[tematicaKey]?.primary : "#ccc";

    const [tematicaLayer, setTematicaLayer] = useState<GeoJsonLayer | null>(null);
    const [mapLayerInstance, setMapLayerInstance] = useState<MapLayer | null>(null);
    //guarda las capas geojson ya descargadas (para no hacer fetch de todas las selectedBaseLayers siempre que se agrega una)
    const [baseLayers, setBaseLayers] = useState<{[key: string]: GeoJsonLayer}>({});

    const [tematicaData, setTematicaData] = useState<any>(null);

    const handleSelectedAGEBS = (info: any) => {
        if (info) {
            const cvegeo = info.object.properties.cvegeo as string;
            setSelectedAGEBS(prev => prev.includes(cvegeo) ? prev.filter(key => key !== cvegeo) : [...prev, cvegeo]);
        }
    };

    //una sola capa de TEMÁTICA
    useEffect(() => {
        if (!selectedLayer) {
            setTematicaLayer(null);
            setMapLayerInstance(null);
            return;
        }
        const layer = LAYERS[selectedLayer as keyof typeof LAYERS];
        if (!layer?.url) {
            console.error(`No URL for layer: ${selectedLayer}`);
            return;
        }
        const urlBlob = `${layer.url}?${REACT_APP_SAS_TOKEN}`;
        const tematicaKey = layer.tematica as keyof typeof COLORS;

        // Genera variantes
        const positiveColor = COLORS[tematicaKey]?.positive || "#ffffff";
        const negativeColor = COLORS[tematicaKey]?.negative || "#000000";  
        const neutralColor = COLORS[tematicaKey]?.primary || "#888888";
        const mapLayer = new MapLayer(positiveColor, negativeColor, 0.7, neutralColor);

        fetch(urlBlob)
            .then(res => res.json())
            .then(data => {
                const newLayer = mapLayer.getLayer(data, layer.property, layer.is_lineLayer, false, handleSelectedAGEBS, selectedAGEBS);

                setTematicaData(data);
                setTematicaLayer(newLayer);
                setMapLayerInstance(mapLayer);
            })
            .catch(error => console.error(`Error loading GeoJSON for layer ${selectedLayer}:`, error));
    }, [selectedLayer, selectedAGEBS]);

    //varias capas de BASE??
    useEffect(() => {

        if (selectedBaseLayers.length === 0) {
            setBaseLayers({});
            return;
        }

        selectedBaseLayers.forEach((layerKey) => {
            if (!baseLayers[layerKey]) {
                const layer = CAPAS_BASE[layerKey as keyof typeof CAPAS_BASE];
                if (!layer?.url) {
                    console.error(`No URL for layer: ${layerKey}`);
                    return null;
                }

                const urlBlob = `${layer.url}?${REACT_APP_SAS_TOKEN}`;

                fetch(urlBlob)
                    .then(res => res.json())
                    .then(data => {
                        const newLayer = new GeoJsonLayer({
                            id: layerKey,
                            data: data,
                            pickable: true,
                            filled: true,
                            getFillColor: [250, 0, 0, 100],
                            getLineColor: [255, 255, 255, 180],
                        });
                        setBaseLayers(prev => ({ ...prev, [layerKey]: newLayer }));
                })
                    .catch(error => console.error(`Error loading GeoJSON for layer ${layerKey}:`, error));
                }
            });
    }, [selectedBaseLayers]);

    return (
        <div className="visor">
            <Box className="visor__leftPanel" scrollbar="hidden" overflowY="auto" maxHeight="100vh"> 
                <div className="visor__title">
                    <p className="visor__titleItalic">visor de </p>
                    <p className="visor__titleBold"> indicadores ambientales</p>
                </div>
                <Tematica />

                { !selectedLayer && (
                    <div className="visor__summary">
                    <b>¿Qué es este visor?</b>
                    <br></br>
                    Lorem Ipsum dolor sit amet
                    <br></br>
                    <br></br>
                    <b>¿Cómo funciona?</b>
                    <br></br>
                    Lorem Ipsum dolor sit amet
                    <br></br>
                    <br></br>
                    <b>Recomendaciones</b>
                    <br></br>
                    Lorem Ipsum dolor sit ame
                </div>
                )}
                
                {/* selectedLayer && (
                    <div>
                        <div className="visor__layerCard" style={{borderColor: sectionColor}}>
                            <div className="visor__layerCardTitle" style={{background: sectionColor}}> 
                                <p className="visor__layerTitle">{selectedLayerData?.title}</p>
                            </div>
                            <div className="visor__layerCardBody">
                                <p className="visor__layerDescription">
                                    {selectedLayerData?.description || "No hay descripción disponible."}
                                </p>
                                {selectedAGEBS.length > 0 && (
                                    <p style={{ fontSize: "15px", fontWeight: "bold" }}>
                                        El AGEB seleccionado tiene el siguiente promedio: {getAGEBMetric(selectedLayerData?.stat_type || "", selectedLayerData?.property || "income_pc")}
                                    </p>
                                )}
                            </div>
                        </div>
                        {selectedAGEBS.length > 0 && (
                            <Button 
                            size={"xs"}
                            rounded={"full"}
                            p={4}
                            onClick={() => setSelectedAGEBS([])} 
                            >
                                <p style={{ fontSize: "15px" }}>Limpiar selección</p>
                            </Button>
                        )}
                    </div>
                )*/}

                {selectedLayer && (
                    <LayerCard
                        selectedLayerData={selectedLayerData}
                        tematicaData={tematicaData}
                        color={sectionColor}
                    />
                )}

                

            </Box>
            <div className="visor__mapContainer"> 
                <DeckGL 
                    initialViewState={ viewState }
                    viewState={ viewState }
                    onViewStateChange={({ viewState }) => {
                        const { latitude, longitude, zoom } = viewState as { latitude: number; longitude: number; zoom: number };
                        setViewState({ latitude, longitude, zoom });
                    }}
                    //layers={[...selectedBaseLayers.map(key => baseLayers[key]).filter(Boolean), ...selectedLayersMultiple.map(key => tematicaLayers[key]).filter(Boolean)]}
                   layers={[
                       ...(tematicaLayer ? [tematicaLayer] : []),
                       ...selectedBaseLayers.map(key => baseLayers[key]).filter(Boolean),
                   ]}
                    style={{ height: "100%", width: "100%", position: "relative"}}
                    controller={ true }
                    getCursor={({ isDragging, isHovering }) => (isDragging ? "grabbing" : isHovering ? "pointer" : "grab")}
                >
                    <Map
                        mapStyle="mapbox://styles/speakablekhan/clx519y7m00yc01qobp826m5t/draft"
                        mapboxAccessToken={REACT_APP_MAPBOX_TOKEN}
                        reuseMaps
                    />
                </DeckGL>

               
                <CapasBase />
                {selectedLayer && mapLayerInstance && (
                    <div className="visor__legend">
                        {mapLayerInstance.getLegend(selectedLayerData?.title || "")}
                    </div>
                )}

                <ZoomControls />

            </div>
        </div>
    );
}


export default Visor;