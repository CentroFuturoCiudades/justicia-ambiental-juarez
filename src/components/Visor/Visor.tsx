import React, { act, use, useCallback, useMemo } from "react";

import "./Visor.scss";
import DeckGL from "deck.gl";
import Map from "react-map-gl/mapbox";
import { defaultViewState, useAppContext } from "../../context/AppContext";
import Tematica from "../Tematica/Tematica";
import CapasBase from "../Capas Base/CapasBase";
import { LAYERS, COLORS, CAPAS_BASE } from "../../utils/constants";
import { Box, Group } from "@chakra-ui/react";
import { GeoJsonLayer } from "deck.gl";
import { useEffect, useState } from "react";
import ZoomControls from "../ZoomControls/ZoomControls";
import { MapLayer } from "../../classes/MapLayer";
import LayerCard from "../Layer Card/LayerCard";
import BusquedaColonia from "../Busqueda-Colonia/BusquedaColonia";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { downloadPdf, downlaodFile, downloadPdf_LAYERS} from "../../utils/downloadFile";
import { dissolve } from "@turf/dissolve";
import { union, polygon, featureCollection } from "@turf/turf";
import { flatten } from "@turf/flatten";
import { PathStyleExtension } from '@deck.gl/extensions';
//import booleanContains from "@turf/boolean-contains";           //para ver interseccion de colonias-agebs (no se usa por el momento)
//import  booleanIntersects  from "@turf/boolean-intersects";     //para ver interseccion de colonias-agebs (no se usa por el momento)
import { RiHome2Line, RiDownloadLine } from "react-icons/ri";
import { LuSquareDashed } from "react-icons/lu";
import { PiIntersectSquareDuotone, PiIntersectSquareFill } from "react-icons/pi";
import { FaRegTrashCan } from "react-icons/fa6";
import { RiAddLine } from "react-icons/ri";
import html2canvas from "html2canvas";

const REACT_APP_MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const REACT_APP_SAS_TOKEN = import.meta.env.VITE_AZURE_SAS_TOKEN;


const Visor = () => {
    const navigate = useNavigate();
    const deck = useRef<any>(null);
    const map = useRef<any>(null);
    const { 
        viewState, setViewState, 
        selectedLayer, 
        selectedBaseLayers, 
        selectedAGEBS, setSelectedAGEBS, 
        selectedColonias, setSelectedColonias, 
        // coloniasData, 
        activeLayerKey, setActiveLayerKey,
        mapLayers,setMapLayers //mas de una layer seleccionada en el "pop up" (simulacion)
    } = useAppContext();

    const selectedLayerData = selectedLayer ? LAYERS[selectedLayer as keyof typeof LAYERS] : undefined;
    const tematicaKey = selectedLayerData?.tematica as keyof typeof COLORS | undefined;
    const sectionColor = tematicaKey ? COLORS[tematicaKey]?.primary : "#ccc";

    const [tematicaLayer, setTematicaLayer] = useState<GeoJsonLayer | null>(null);
    const [mapLayerInstance, setMapLayerInstance] = useState<MapLayer | null>(null);
    const [tematicaData, setTematicaData] = useState<any>(null);                                        // data que va a ir en la layerCard

    //const [coloniasLayer, setColoniasLayer] = useState<GeoJsonLayer | null>(null);
    const [baseLayers, setBaseLayers] = useState<{ [key: string]: GeoJsonLayer }>({});

    const [agebsGeoJson, setAgebsGeoJson] = useState<any>(null);                                        //guarda el geojson universal de agebs
    const [coloniasGeoJson, setColoniasGeoJson] = useState<any>(null);                                  //guarda el geojson universal de colonias
    const mapLayerRef = useRef<HTMLDivElement | null>(null);


    let dissolvedLayer: GeoJsonLayer[] = [];

    //get geometries of selected agebs/colonias
    const selectedGeometries = useMemo(() => {
        const isAgeb = activeLayerKey === "agebs";
        const setSelected = new Set(isAgeb ? selectedAGEBS : selectedColonias);
        return (isAgeb ? agebsGeoJson : coloniasGeoJson)?.features?.filter(
            (feature: any) => setSelected.has(isAgeb ? feature.properties.cvegeo : feature.properties.name)
        );
    }, [selectedAGEBS, selectedColonias, activeLayerKey]);

    const handleSelectedElements = (info: any) => {
        if (info) {
            const isAgeb = activeLayerKey === "agebs";
            const key = isAgeb ? info.object.properties.cvegeo : info.object.properties.name;
            const setSelected = isAgeb ? setSelectedAGEBS : setSelectedColonias;
            setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
        }
    };

    // INTERSECCION (no se usa por el momento)
    /*const AGEBS_colonias = useMemo(() => {
        if (!selectedColoniasGeometries || !tematicaData) return [];

        return tematicaData.features
            .filter((ageb: any) => 
                selectedColoniasGeometries.some((colonia: any) =>
                    booleanIntersects(ageb.geometry, colonia.geometry) ||
                    booleanContains(ageb.geometry, colonia.geometry)
                )
            )
            .map((ageb: any) => ageb.properties.cvegeo);
    }, [selectedColoniasGeometries]);*/

    //FETCH AGEBS
    useEffect(() => {
        const agebEndpoint = "https://justiciaambientalstore.blob.core.windows.net/data/agebs.geojson";

        (async () => {
            const data = await fetch(`${agebEndpoint}?${REACT_APP_SAS_TOKEN}`);
            const json = await data.json();
            setAgebsGeoJson(json);
        })();
    }, []);

    //FETCH COLONIAS
    useEffect(() => {
        const coloniaEndpoint = "https://justiciaambientalstore.blob.core.windows.net/data/neighborhoods.geojson";

        (async () => {
            const data = await fetch(`${coloniaEndpoint}?${REACT_APP_SAS_TOKEN}`);
            const json = await data.json();
            setColoniasGeoJson(json);
        })();
    }, []);

    //crear mapLayerInstance, geojsonLayer y la data
    useEffect(() => {

        if(activeLayerKey === "juarez") {
            setTematicaLayer(null);
            setMapLayerInstance(null);
            setTematicaData(null);
            return;
        };

        let layer;
        if(selectedLayer) {
            layer = LAYERS[selectedLayer as keyof typeof LAYERS];
        }

        //crea instancia
        const mapLayerInstance = new MapLayer({
            opacity: 1,
            title: layer ? layer.title : "initial",
            formatValue: layer ? layer.formatValue : "",
            ref: mapLayerRef,
            theme: layer ? layer.tematica : "default",
        });

        let jsonData = JSON.parse(JSON.stringify(activeLayerKey === "agebs" ? agebsGeoJson : coloniasGeoJson)); //copia del geojson universal de agebs/colonias
        if (layer?.property && !jsonData.features?.some((f: any) => layer.property in f.properties)) {
            setTematicaLayer(null);
            setMapLayerInstance(null);
            setTematicaData(null);
            return;
        }
        
        //procesa la data que va en layerCard
        if ( layer?.dataProcesssing ) { 
            jsonData = layer.dataProcesssing(jsonData);
        }
        setTematicaData(jsonData);

        //crea la capa geojson
        const geoJsonLayer = mapLayerInstance.getLayer(
            jsonData,
            layer?.property || "",
            layer?.is_lineLayer || false,
            true,
            handleSelectedElements,
            activeLayerKey === "agebs" ? selectedAGEBS : selectedColonias,
        );
        setTematicaLayer(geoJsonLayer);
        setMapLayerInstance(mapLayerInstance);

    }, [selectedLayer, activeLayerKey, agebsGeoJson, coloniasGeoJson]);

    // cambio de layer activa (botones arriba)
    const handleLayerToggle = (layerKey: string) => {
        if(layerKey === activeLayerKey) {
            setActiveLayerKey("juarez");
        } else {
            setActiveLayerKey(layerKey);
        }
    };

    //cada vez que cambien las colonias seleccionadas, ver que agebs colindan y cambiar selectedagebs (INTERSECCION, ya no se usa por el momento)
    /*useEffect(() => {        
        setSelectedAGEBS(AGEBS_colonias);
    }, [AGEBS_colonias]);*/


    if(selectedGeometries && selectedGeometries.length > 0) {
        try {
            const fc = featureCollection(selectedGeometries);
            const flattened = flatten(fc);
            const dissolved = dissolve(flattened as any);
            // create a new layer with the dissolved geometry
            dissolvedLayer = [new GeoJsonLayer({
                id: 'dissolved',
                data: dissolved,
                pickable: false,
                filled: false,
                getLineColor: [250, 200, 0, 255],
                getLineWidth: 70,
            })];
        } catch (error) {
            console.error('Error dissolving features:', error);
        }
    }

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



    //varias colonias
    //cada que haya un cambio en selectedColonias
    /*useEffect(() => {
        if(selectedColonias.length === 0) {
            setColoniasLayer(null);
            return;
        }

        const filteredColonias = {
            ...coloniasData,
            features: coloniasData.features.filter(
                (f: any) => selectedColonias.includes(f.properties.NOMBRE)
            )
        }

        const newLayer = new GeoJsonLayer({
            id: 'colonias_seleccionadas',
            data: filteredColonias,
            pickable: true,
            filled: true,
            getFillColor: [0, 0, 0, 255],
            getLineColor: [0, 0, 0, 255],
        });

        setColoniasLayer(newLayer);

    }, [selectedColonias, coloniasData]);*/

    useEffect(() => {
        console.log("Array de maplayers", mapLayers)
    }, [mapLayers]);

    return (
        <div className="visor">
            <Box className="visor__leftPanel" scrollbar="hidden" overflowY="auto" maxHeight="100vh">
                <div className="visor__title">
                    <p className="visor__titleItalic">visor de </p>
                    <p className="visor__titleBold"> indicadores ambientales</p>
                </div>
                <div style={{ fontWeight: "600", fontSize: "17px", lineHeight: "1.2", textAlign: "justify",marginBottom: "1rem" }}>
                    <p> Selecciona una temática y haz click en la tarjeta correspondiente para visualizar la capa en el mapa. </p>
                </div>
                <Tematica />

                {selectedLayer && tematicaData && mapLayerInstance && (
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
                    layers={[
                        ...(tematicaLayer ? [tematicaLayer] : []),
                        ...selectedBaseLayers.map(key => baseLayers[key]).filter(Boolean),
                        ...dissolvedLayer,
                        //...(coloniasLayer ? [coloniasLayer] : []),
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

                <div className="visor__dropDowns">
                    <CapasBase />
                    <BusquedaColonia />
                </div>

                {/* {selectedLayer && mapLayerInstance && ( */}
                {selectedLayer && mapLayerInstance && (
                    <div className="visor__legend">
                        {mapLayerInstance.getLegend(selectedLayerData?.title || "")}
                    </div>
                )}

                <div className="visor__topButtons">
                    <Button className="visor__button" borderRadius={0} p={2} background={COLORS.GLOBAL.backgroundDark}
                        onClick={() => navigate("/")}>
                        <RiHome2Line/>
                    </Button>
                    <Button className="visor__button" borderRadius={0} p={2} background={COLORS.GLOBAL.backgroundDark}
                        onClick={() => {
                            setViewState({
                                ...defaultViewState,
                                transitionDuration: 0,
                            } as any);
                            setTimeout(() => {
                                 //downloadPdf(deck.current, map.current, mapLayerInstance);
                                 downloadPdf_LAYERS(deck.current, map.current, mapLayers);
                                //downlaodFile("/assets/Template Reporte.pdf", "Template Reporte.pdf");
                            }, 100);
                        }}>
                        <RiDownloadLine />
                    </Button>
            
                    <ZoomControls />

                    <Group attached>
                        <Button className="visor__button" minWidth="auto" borderRadius={0} p={1.5} background={activeLayerKey === "juarez" ? COLORS.GLOBAL.backgroundDark : COLORS.GLOBAL.backgroundMedium} onClick={() => handleLayerToggle("juarez")}>
                            <LuSquareDashed size={38}/>
                        </Button>
                        <Button className="visor__button" minWidth="auto" borderRadius={0} p={1.5} background={activeLayerKey === "agebs" ? COLORS.GLOBAL.backgroundDark : COLORS.GLOBAL.backgroundMedium} onClick={() => handleLayerToggle("agebs")}>
                            <PiIntersectSquareDuotone size={38} />
                        </Button>
                        <Button className="visor__button" minWidth="auto" borderRadius={0} p={1.5} background={activeLayerKey === "colonias" ? COLORS.GLOBAL.backgroundDark : COLORS.GLOBAL.backgroundMedium} onClick={() => handleLayerToggle("colonias")}>
                            <PiIntersectSquareFill size={38} />
                        </Button>
                    </Group>

                    <Button className="visor__button" borderRadius={0} p={2} background={COLORS.GLOBAL.backgroundDark } onClick={() => activeLayerKey === "agebs" ? setSelectedAGEBS([]) : setSelectedColonias([])}>
                            <FaRegTrashCan />
                        </Button>

                    <Button className="visor__button" borderRadius={0} p={2} background={COLORS.GLOBAL.backgroundDark} onClick={async () => {
                        if (mapLayerInstance?.ref?.current) {
                            const canvas = await html2canvas(mapLayerInstance.ref.current);
                            mapLayerInstance.graphImage = canvas.toDataURL("image/png");
                        }
                        setMapLayers(prev => [...prev, mapLayerInstance]);
                    }}>
                        <RiAddLine />
                    </Button>
                </div>
            </div>
                </div>
       );
}


export default Visor;