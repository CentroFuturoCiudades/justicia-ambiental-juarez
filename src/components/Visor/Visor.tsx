import React from "react";

import "./Visor.scss";
import DeckGL from "deck.gl";
import Map from "react-map-gl/mapbox";
import { useAppContext } from "../../context/AppContext";
import Tematica from "../Tematica/Tematica";
import CapasBase from "../Capas Base/CapasBase";
import { LAYERS, COLORS, CAPAS_BASE } from "../../utils/constants";
import { Button, Box } from "@chakra-ui/react";
import { GeoJsonLayer } from "deck.gl";
import { useEffect, useState } from "react";

const REACT_APP_MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const REACT_APP_SAS_TOKEN = import.meta.env.VITE_AZURE_SAS_TOKEN;

const Visor = ()=> {

    /* UNA SOLA CAPA SELECCIONADA A LA VEZ */
    //const { selectedLayers } = useAppContext();
    //const selectedLayersData = LAYERS[selectedLayers as keyof typeof LAYERS];

    const { viewState, setViewState, selectedLayersMultiple, selectedBaseLayers, zoomIn, zoomOut } = useAppContext(); //varias capas

    //guarda las capas geojson ya descargadas (para no hacer fetch de todas las selectedLayersMultiple siempre que se agrega una)
    const [tematicaLayers, setTematicaLayers] = useState<{[key: string]: GeoJsonLayer}>({});
    const [baseLayers, setBaseLayers] = useState<{[key: string]: GeoJsonLayer}>({});

    //convierte color hex (de constants) a rgba
    function hexToRgba(hex: string, alpha = 80) {
        const h = hex.replace("#", "");
        const bigint = parseInt(h, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return [r, g, b, alpha];
    }

    //capas de TEMÁTICA
    useEffect(() => {
        if (selectedLayersMultiple.length === 0) {
            setTematicaLayers({});
            return;
        }

        //solo fetch de las capas que no están en tematicaLayers
        selectedLayersMultiple.forEach((layerKey) => {
            if (!tematicaLayers[layerKey]) {
                const layer = LAYERS[layerKey as keyof typeof LAYERS];
                if (!layer?.url) {
                    console.error(`No URL for layer: ${layerKey}`);
                    return;
                }

                const urlBlob = `${layer.url}?${REACT_APP_SAS_TOKEN}`;

                fetch(urlBlob)
                    .then(res => res.json())
                    .then(data => {
                        // solo para darle el color de la sección
                        const tematicaKey = layer.tematica as keyof typeof COLORS;
                        const colorHex = COLORS[tematicaKey]?.primary;
                        const color = colorHex ? hexToRgba(colorHex, 80) : [250, 0, 0, 80]; // Default color if not found

                        const newLayer = new GeoJsonLayer({
                            id: layerKey,
                            data: data,
                            pickable: true,
                            filled: true,
                            getFillColor: () => color as [number, number, number, number],
                            getLineColor: () => [255, 255, 255, 180],
                        });
                        setTematicaLayers(prev => ({ ...prev, [layerKey]: newLayer }));
                    })
                    .catch(error => console.error(`Error loading GeoJSON for layer ${layerKey}:`, error));
            }
        });
    }, [selectedLayersMultiple]);

    //capas de BASE
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
                            getFillColor: [250, 0, 0, 80],
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
                <div className="visor__title">visor para la evaluación ambiental</div>

                { selectedLayersMultiple.length == 0 && (
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
            

                {/* -----una sola capa seleccionada a la vez-------
                { selectedLayers && (
                    <div className="visor__layerCard" style={{borderColor: sectionColor}}>
                        <div className="visor__layerCardTitle" style={{background: sectionColor}}> 
                            <p>{selectedLayersData?.title}</p>
                        </div>
                        <b>Descripción</b>
                        <br></br>
                        {selectedLayersData?.description || "No hay descripción disponible."}
                        <br></br>
                        </div>
                )}*/}

                {selectedLayersMultiple.length > 0 && selectedLayersMultiple.map(layerKey => {
                    const layerData = LAYERS[layerKey as keyof typeof LAYERS];
                    const tematicaKey = layerData.tematica as keyof typeof COLORS;
                    const sectionColor = COLORS[tematicaKey]?.primary;

                    return (
                        <div key={layerKey} className="visor__layerCard" style={{borderColor: sectionColor}}>
                            <div className="visor__layerCardTitle" style={{background: sectionColor}}> 
                                <p style={{fontSize:"1.1rem"}}>{layerData?.title}</p>
                            </div>
                            <div className="visor__layerCardBody">
                                <p style={{fontSize: "1.1rem"}}>
                                    {layerData?.description || "No hay descripción disponible."}
                                </p>
                            </div>
                        </div>
                    );
                })}

            </Box>
            <div className="visor__mapContainer"> 
                <DeckGL 
                    initialViewState={ viewState }
                    viewState={ viewState }
                    onViewStateChange={({ viewState }) => {
                        const { latitude, longitude, zoom } = viewState as { latitude: number; longitude: number; zoom: number };
                        setViewState({ latitude, longitude, zoom });
                    }}
                    layers={[...selectedBaseLayers.map(key => baseLayers[key]).filter(Boolean), ...selectedLayersMultiple.map(key => tematicaLayers[key]).filter(Boolean)]}
                    style={{ height: "100%", width: "100%", position: "relative"}}
                    controller={ true }
                >
                    <Map
                        mapStyle="mapbox://styles/speakablekhan/clx519y7m00yc01qobp826m5t/draft"
                        mapboxAccessToken={REACT_APP_MAPBOX_TOKEN}
                        reuseMaps
                    />
                </DeckGL>
                <Tematica />
                <CapasBase />
                <div style={{position:"absolute", top:"1.5rem", left:"2rem", display:"flex", gap:"0", background:COLORS.GLOBAL.backgroundDark, borderRadius:"20px"}}>
                    <Button rounded={"lg"} p={2} background={COLORS.GLOBAL.backgroundDark} borderTopRightRadius={0} borderBottomRightRadius={0}
                        onClick={zoomOut}>
                        -
                    </Button>
                    <Button rounded={"lg"} p={2} background={COLORS.GLOBAL.backgroundDark} borderTopLeftRadius={0} borderBottomLeftRadius={0}
                        onClick={zoomIn}>
                        +
                    </Button>
                </div>

            </div>
        </div>
    );
}


export default Visor;