import React, { useMemo } from "react";

import "./Visor.scss";
import DeckGL from "deck.gl";
import Map from "react-map-gl/mapbox";
import { defaultViewState, useAppContext } from "../../context/AppContext";
import Tematica from "../Tematica/Tematica";
import CapasBase from "../Capas Base/CapasBase";
import { LAYERS, COLORS, CAPAS_BASE } from "../../utils/constants";
import { Box } from "@chakra-ui/react";
import { GeoJsonLayer } from "deck.gl";
import { useEffect, useState } from "react";
import ZoomControls from "../ZoomControls/ZoomControls";
import { MapLayer } from "../../classes/MapLayer";
import { BitmapLayer } from "@deck.gl/layers";
import { RasterLayer } from "../../classes/RasterLayer";
import LayerCard from "../Layer Card/LayerCard";
import BusquedaColonia from "../Busqueda-Colonia/BusquedaColonia";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { downloadPdf } from "../../utils/downloadFile";
import { dissolve } from "@turf/dissolve";
import { union, polygon, featureCollection } from "@turf/turf";
import { flatten } from "@turf/flatten";
import { PathStyleExtension } from '@deck.gl/extensions';



const REACT_APP_MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const REACT_APP_SAS_TOKEN = import.meta.env.VITE_AZURE_SAS_TOKEN;


const Visor = () => {
    const navigate = useNavigate();
    const deck = useRef<any>(null);
    const map = useRef<any>(null);
    /* UNA SOLA CAPA SELECCIONADA A LA VEZ */
    const { viewState, setViewState, selectedLayer, selectedBaseLayers, selectedAGEBS, setSelectedAGEBS } = useAppContext();
    const selectedLayerData = selectedLayer ? LAYERS[selectedLayer as keyof typeof LAYERS] : undefined;
    const tematicaKey = selectedLayerData?.tematica as keyof typeof COLORS | undefined;
    const sectionColor = tematicaKey ? COLORS[tematicaKey]?.primary : "#ccc";

    const [tematicaLayer, setTematicaLayer] = useState<GeoJsonLayer | BitmapLayer | null>(null);
    const [mapLayerInstance, setMapLayerInstance] = useState<MapLayer | RasterLayer | null>(null);
    //guarda las capas geojson ya descargadas (para no hacer fetch de todas las selectedBaseLayers siempre que se agrega una)
    const [baseLayers, setBaseLayers] = useState<{ [key: string]: GeoJsonLayer }>({});

    const [tematicaData, setTematicaData] = useState<any>(null);

    const handleSelectedAGEBS = (info: any) => {
        if (info) {
            const cvegeo = info.object.properties.cvegeo as string;
            setSelectedAGEBS(prev => prev.includes(cvegeo) ? prev.filter(key => key !== cvegeo) : [...prev, cvegeo]);
        }
    };

    let dissolvedLayer: GeoJsonLayer[] = [];

    console.log(tematicaData);

    // get geometries of selectedAGEBS
    const selectedAGEBSGeometries = useMemo(() => {
        const setAgebs = new Set(selectedAGEBS);
        return tematicaData?.features?.filter((feature: any) => setAgebs.has(feature.properties.cvegeo));
    }, [selectedAGEBS]);
    console.log(selectedAGEBSGeometries);
    if (selectedAGEBSGeometries && selectedAGEBSGeometries.length > 0) {
        try {
            const fc = featureCollection(selectedAGEBSGeometries);
            const flattened = flatten(fc);
            const dissolved = dissolve(flattened as any);
            // create a new layer with the dissolved geometry
            dissolvedLayer = [new GeoJsonLayer({
                id: 'dissolved',
                data: dissolved,
                pickable: false,
                filled: false,
                getLineColor: [100, 100, 100, 255],
                getLineWidth: 60,
            })];
        } catch (error) {
            console.error('Error dissolving features:', error);
        }
    }


    //una sola capa de TEMÁTICA
    useEffect(() => {
        (async () => {

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

            if (layer.map_type === "geometry") {

                const mapLayerInstance = new MapLayer(0.7);
                const jsonData = await mapLayerInstance.loadData(urlBlob);
                const geojsonLayer = mapLayerInstance.getLayer(jsonData, layer.property, layer.is_lineLayer, false, handleSelectedAGEBS, selectedAGEBS);

                setTematicaData(jsonData);
                setTematicaLayer(geojsonLayer);
                setMapLayerInstance(mapLayerInstance);
            } else if (layer.map_type === "raster") {
                const rasterLayerInstance = new RasterLayer({
                    opacity: 0.7,
                    title: layer.title
                });
                await rasterLayerInstance.loadRaster(urlBlob);
                setTematicaLayer(rasterLayerInstance.getBitmapLayer());
                setMapLayerInstance(rasterLayerInstance);
            }
        })();
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

    useEffect(() => {
        setSelectedAGEBS([]);
    }, [selectedLayer]);

    return (
        <div className="visor">
            <Box className="visor__leftPanel" scrollbar="hidden" overflowY="auto" maxHeight="100vh">
                <div className="visor__title">
                    <p className="visor__titleItalic">visor de </p>
                    <p className="visor__titleBold"> indicadores ambientales</p>
                </div>
                <Tematica />

                {!selectedLayer && (
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

                {selectedLayer && (
                    <LayerCard
                        selectedLayerData={selectedLayerData}
                        tematicaData={tematicaData}
                        color={sectionColor}
                        mapLayerInstance={mapLayerInstance}
                    />
                )}

            </Box>

            <div className="visor__mapContainer">
                <DeckGL
                    ref={deck}
                    initialViewState={viewState}
                    viewState={viewState}
                    onViewStateChange={({ viewState }) => {
                        const { latitude, longitude, zoom } = viewState as { latitude: number; longitude: number; zoom: number };
                        setViewState({ latitude, longitude, zoom });
                    }}
                    //layers={[...selectedBaseLayers.map(key => baseLayers[key]).filter(Boolean), ...selectedLayersMultiple.map(key => tematicaLayers[key]).filter(Boolean)]}
                    layers={[
                        ...(tematicaLayer ? [tematicaLayer] : []),
                        ...selectedBaseLayers.map(key => baseLayers[key]).filter(Boolean),
                        ...dissolvedLayer
                    ]}
                    style={{ height: "100%", width: "100%", position: "relative" }}
                    controller={true}
                    getCursor={({ isDragging, isHovering }) => (isDragging ? "grabbing" : isHovering ? "pointer" : "grab")}
                >
                    <Map
                        mapStyle="mapbox://styles/lameouchi/cmdhi6yd6007401qw525702ru"
                        mapboxAccessToken={REACT_APP_MAPBOX_TOKEN}
                        ref={map}
                        reuseMaps
                    />
                </DeckGL>

                <BusquedaColonia />

                {/* CAPAS BASE */}
                <CapasBase />

                {selectedLayer && mapLayerInstance && (
                    <div className="visor__legend">
                        {mapLayerInstance.getLegend(selectedLayerData?.title || "")}
                    </div>
                )}

                <div style={{ position: "absolute", top: "1.5rem", left: "2rem", display: "flex", gap: "0", background: COLORS.GLOBAL.backgroundDark, borderRadius: "20px" }}>
                    <Button rounded={"lg"} p={2} background={COLORS.GLOBAL.backgroundDark}
                        onClick={() => navigate("/")}>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50" fill="#FFFFFF">
                            <path d="M 25 1.0507812 C 24.7825 1.0507812 24.565859 1.1197656 24.380859 1.2597656 L 1.3808594 19.210938 C 0.95085938 19.550938 0.8709375 20.179141 1.2109375 20.619141 C 1.5509375 21.049141 2.1791406 21.129062 2.6191406 20.789062 L 4 19.710938 L 4 46 C 4 46.55 4.45 47 5 47 L 19 47 L 19 29 L 31 29 L 31 47 L 45 47 C 45.55 47 46 46.55 46 46 L 46 19.710938 L 47.380859 20.789062 C 47.570859 20.929063 47.78 21 48 21 C 48.3 21 48.589063 20.869141 48.789062 20.619141 C 49.129063 20.179141 49.049141 19.550938 48.619141 19.210938 L 25.619141 1.2597656 C 25.434141 1.1197656 25.2175 1.0507812 25 1.0507812 z M 35 5 L 35 6.0507812 L 41 10.730469 L 41 5 L 35 5 z"></path>
                        </svg>
                    </Button>
                </div>
                <div style={{ position: "absolute", top: "1.5rem", left: "5rem", display: "flex", gap: "0", background: COLORS.GLOBAL.backgroundDark, borderRadius: "20px" }}>
                    <Button rounded={"lg"} p={2} background={COLORS.GLOBAL.backgroundDark}
                        onClick={() => {
                            setViewState({
                                ...defaultViewState,
                                transitionDuration: 0,
                            } as any);
                            setTimeout(() => {
                                downloadPdf(deck.current, map.current, mapLayerInstance);
                            }, 100);
                        }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                    </Button>
                </div>
                <div style={{ position: "absolute", top: "1.5rem", left: "8rem", display: "flex", gap: "0", background: COLORS.GLOBAL.backgroundDark, borderRadius: "20px" }}>
                    <ZoomControls />
                </div>

                {/* <ZoomControls /> */}

            </div>
        </div>
    );
}


export default Visor;