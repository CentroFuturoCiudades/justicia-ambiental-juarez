import React, { act, use, useCallback, useMemo } from "react";

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
import booleanContains from "@turf/boolean-contains";
import  booleanIntersects  from "@turf/boolean-intersects";
import { RiHome2Line, RiDownloadLine } from "react-icons/ri";
import { LuSquareDashed } from "react-icons/lu";
import { PiIntersectSquareDuotone, PiIntersectSquareFill } from "react-icons/pi";


const REACT_APP_MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const REACT_APP_SAS_TOKEN = import.meta.env.VITE_AZURE_SAS_TOKEN;


const Visor = () => {
    const navigate = useNavigate();
    const deck = useRef<any>(null);
    const map = useRef<any>(null);
    /* UNA SOLA CAPA SELECCIONADA A LA VEZ */
    const { viewState, setViewState, selectedLayer, selectedBaseLayers, selectedAGEBS, setSelectedAGEBS, selectedColonias, setSelectedColonias, coloniasData, selectedColonias_geojson, setSelectedColonias_geojson } = useAppContext();
    const selectedLayerData = selectedLayer ? LAYERS[selectedLayer as keyof typeof LAYERS] : undefined;
    const tematicaKey = selectedLayerData?.tematica as keyof typeof COLORS | undefined;
    const sectionColor = tematicaKey ? COLORS[tematicaKey]?.primary : "#ccc";

    const [tematicaLayer, setTematicaLayer] = useState<GeoJsonLayer | BitmapLayer | null>(null);
    const [mapLayerInstance, setMapLayerInstance] = useState<MapLayer | RasterLayer | null>(null);
    const [coloniasLayer, setColoniasLayer] = useState<GeoJsonLayer | null>(null);
    const [baseLayers, setBaseLayers] = useState<{ [key: string]: GeoJsonLayer }>({});

    const [tematicaData, setTematicaData] = useState<any>(null);

    const [activeLayerKey, setActiveLayerKey] = useState<string | null>(null);
    const [mapLayerInstance_AGEB, setMapLayerInstance_AGEB] = useState<MapLayer | null>(null);
    const [mapLayerInstance_COLONIA, setMapLayerInstance_COLONIA] = useState<MapLayer | null>(null);


    const [agebsGeoJson, setAgebsGeoJson] = useState<any>(null);
    const [coloniasGeoJson, setColoniasGeoJson] = useState<any>(null);
    

    const handleSelectedAGEBS = (info: any) => {
        if (info) {
            const cvegeo = info.object.properties.cvegeo as string;
            setSelectedAGEBS(prev => prev.includes(cvegeo) ? prev.filter(key => key !== cvegeo) : [...prev, cvegeo]);
        }
    };

    // por que es mejor con callback??
    const handleSelectedAGEBS2 = useCallback((info: any) => {
        if (info) {
            const cvegeo = info.object.properties.cvegeo as string;
            setSelectedAGEBS(prev => prev.includes(cvegeo) ? prev.filter(key => key !== cvegeo) : [...prev, cvegeo]);
        }
    }, [setSelectedAGEBS]);

    const handleSelectedColonias = useCallback((info: any) => {
        if (info) {
            const nombre = info.object.properties.NOMBRE as string;
            setSelectedColonias_geojson(prev => prev.includes(nombre) ? prev.filter(key => key !== nombre) : [...prev, nombre]);
        }
    }, [setSelectedColonias_geojson]);

    let dissolvedLayer: GeoJsonLayer[] = [];

    // get geometries of selectedAGEBS
    const selectedAGEBSGeometries = useMemo(() => {
        const setAgebs = new Set(selectedAGEBS);
        // en vez de agebsGeoJson o tematicaData 
        return agebsGeoJson?.features?.filter((feature: any) => setAgebs.has(feature.properties.cvegeo));
    }, [selectedAGEBS]);

    //las colonias seleccionadas como SET
    const selectedColoniasGeometries = useMemo(() => {
        const setColonias = new Set(selectedColonias);
        return coloniasData?.features?.filter((feature: any) => setColonias.has(feature.properties.NOMBRE));
    }, [selectedColonias]);

    //console.log(selectedAGEBSGeometries);

    const AGEBS_colonias = useMemo(() => {
        if (!selectedColoniasGeometries || !tematicaData) return [];

        return tematicaData.features
            .filter((ageb: any) => 
                selectedColoniasGeometries.some((colonia: any) =>
                    booleanIntersects(ageb.geometry, colonia.geometry) ||
                    booleanContains(ageb.geometry, colonia.geometry)
                )
            )
            .map((ageb: any) => ageb.properties.cvegeo);
    }, [selectedColoniasGeometries]);

    //useEffect inicial: hace un unico fetch de geojson de agebs y colonias
    useEffect(() => {
        const agebEndpoint = "https://justiciaambientalstore.blob.core.windows.net/data/agebs.geojson";
        //https://justiciaambientalstore.blob.core.windows.net/data/agebs.geojson
        const coloniaEndpoint = "https://justiciaambientalstore.blob.core.windows.net/data/neighborhoods.geojson";

        (async () => {
            //datos agebs
            const ageb_MapLayerInstance = new MapLayer({
                opacity: 1,
                title: "agebs",
            });
            const ageb_jsonData = await ageb_MapLayerInstance.loadData(`${agebEndpoint}?${REACT_APP_SAS_TOKEN}`);
            //console.log("USEEFFECT INICIAL:", ageb_jsonData.features);
            setAgebsGeoJson(ageb_jsonData);
            setMapLayerInstance_AGEB(ageb_MapLayerInstance);

            //datos colonias
            const colonia_MapLayerInstance = new MapLayer({
                opacity: 1,
                title: "colonias",
            });
            const colonia_jsonData = await colonia_MapLayerInstance.loadData(`${coloniaEndpoint}?${REACT_APP_SAS_TOKEN}`);
            setColoniasGeoJson(colonia_jsonData);
            setMapLayerInstance_COLONIA(colonia_MapLayerInstance);
        })();
    }, []);

    //cada vez que cambien las colonias seleccionadas, ver que agebs colindan y cambiar selectedagebs
    useEffect(() => {        
        setSelectedAGEBS(AGEBS_colonias);
    }, [AGEBS_colonias]);

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
                getLineColor: [250, 200, 0, 255],
                getLineWidth: 70,
            })];
            console.log("Dissolved features:", dissolved);
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

            /*if (layer.map_type === "geometry") {
                //console.log("este siempre se llama")

                const mapLayerInstance = new MapLayer({
                    opacity: 1,
                    title: layer.title,
                    formatValue: layer.formatValue
                });
                let jsonData = await mapLayerInstance.loadData(urlBlob);
                //console.log("USEFFECT1- jsonData features:", jsonData.features);

                //justo despues del fetch procesa con dataProcesssing de la layer
                if (layer.dataProcesssing) {
                    jsonData = layer.dataProcesssing(jsonData);
                    console.log("USEEFFECT1 - jsonData features after processing:", jsonData);
                }
                //console.log("jsonData features:", jsonData.features);
                const geojsonLayer = mapLayerInstance.getLayer(jsonData, layer.property, layer.is_lineLayer, true, handleSelectedAGEBS, selectedAGEBS);
                setTematicaData(jsonData);
                setTematicaLayer(geojsonLayer);
                setMapLayerInstance(mapLayerInstance);
            } */
            //else if (layer.map_type === "raster") {
            if (layer.map_type === "raster") {
                const rasterLayerInstance = new RasterLayer({
                    opacity: 0.7,
                    title: layer.title,
                    formatValue: layer.formatValue
                });
                await rasterLayerInstance.loadRaster(urlBlob);
                setTematicaLayer(rasterLayerInstance.getBitmapLayer());
                setMapLayerInstance(rasterLayerInstance);
            }
        })();
    }, [selectedLayer, selectedAGEBS]);

    //nuevo useeffect sin fetch para reemplazar todo el pedo de usememos
    useEffect(() => {
        if (!selectedLayer || !mapLayerInstance_AGEB || !agebsGeoJson) {
            setTematicaData(null);
            setTematicaLayer(null);
            return;
        }

        const layer = LAYERS[selectedLayer as keyof typeof LAYERS];

        if (layer.map_type !== "geometry" ) {
            setTematicaData(null);
            setTematicaLayer(null);
            return;
        }

        //actualizar properties del mapLayerInstance_AGEB que se creo al inicio
        mapLayerInstance_AGEB.title = layer.title;
        mapLayerInstance_AGEB.formatValue = layer.formatValue;
        /*const mapLayerInstance = new MapLayer({
            opacity: 1,
            title: layer.title,
            formatValue: layer.formatValue
        });*/

        //json data ahora es una copia de agebsGeoJson
        //let jsonData = agebsGeoJson; //que se fetcheo al inicio
        let jsonData = JSON.parse(JSON.stringify(agebsGeoJson)); // Clona profundo

        if (layer.dataProcesssing) {
            jsonData = layer.dataProcesssing(jsonData);
            //console.log("USEFFECT2 - jsonData features after processing:", jsonData);
        }
        //console.log("jsonData features:", jsonData.features);
        //crea la capa 
        const geojsonLayer = mapLayerInstance_AGEB.getLayer(
            jsonData, 
            layer.property, 
            layer.is_lineLayer, 
            true, 
            handleSelectedAGEBS, 
            selectedAGEBS
        );
        //actualiza el estado
        setTematicaData(jsonData);
        setTematicaLayer(geojsonLayer);

    }, [selectedLayer, selectedAGEBS]);

    useEffect(() => {
        console.log("selectedlayeDATA:", selectedLayerData);
    }, [selectedLayerData]);

    /*const processedAGEBSData = useMemo(() => {
        if (!agebsGeoJson || !mapLayerInstance_AGEB) return null;
        if(selectedLayerData?.formatValue) {
            mapLayerInstance_AGEB.formatValue = selectedLayerData.formatValue;
        }
        if (selectedLayer && selectedLayerData?.dataProcesssing) {
            return selectedLayerData.dataProcesssing(agebsGeoJson);
        }
        return agebsGeoJson;
    }, [agebsGeoJson, selectedLayer, selectedLayerData]);

    //se crea una capa de agebs: solo devuelve la capa
    const agebLayer = useMemo(() => {
        if (!agebsGeoJson || !mapLayerInstance_AGEB || !processedAGEBSData) return null;
        //let jsonData = agebsGeoJson;

        //si hay selectedlayer
        if ( selectedLayer) {
            if( selectedLayerData.map_type === "geometry"  ) {
                console.log("entro al nuevo memo de agebLayer");


                return mapLayerInstance_AGEB.getLayer(
                    //jsonData,
                    processedAGEBSData,
                    selectedLayerData.property,
                    false,
                    true,
                    handleSelectedAGEBS,
                    selectedAGEBS,
                );
            }
        }

        //si no hay selectedlayer, son los agebs de juarez
        return mapLayerInstance_AGEB.getLayer(
            agebsGeoJson,
            "",
            false,
            true,
            handleSelectedAGEBS2,
            selectedAGEBS,
        );

    }, [ agebsGeoJson, selectedAGEBS, selectedLayer, activeLayerKey, processedAGEBSData]);

    //se crea la data procesada de la tematica seleccionada
    /*useEffect(() => {
        if (!selectedLayer || !agebsGeoJson || !mapLayerInstance_AGEB) return;
        if(selectedLayerData?.formatValue) {
            mapLayerInstance_AGEB.formatValue = selectedLayerData.formatValue;
        }
        
        if (selectedLayerData?.dataProcesssing) {
            //console.log("entro al useEffect de dataProcesssing");
            const processedData = selectedLayerData.dataProcesssing(agebsGeoJson);
            setTematicaData(processedData);
        } else {
            setTematicaData(agebsGeoJson);
        }
    }, [selectedLayer, selectedAGEBS]);

    useEffect(() => {
        setTematicaData(processedAGEBSData);
    }, [processedAGEBSData]);*/

    /*useEffect(() => {
        console.log("tematicaData features sobre los que se calcula el average:", tematicaData?.features);
    }, [tematicaData]);*/


    /*const coloniaLayer = useMemo(() => {
        if (!coloniasGeoJson ) return null;
        console.log("entro al nuevo memo de coloniaLayer");
        const coloniaMapLayerInstance = new MapLayer({ opacity: 1, title: "colonias" });
        //usar la misma getlayer?? o hacer una nueva funcion??
        
        return coloniaMapLayerInstance.getLayer(
            coloniasGeoJson,
            "porcentaje_pob_60",
            false,
            true,
            handleSelectedColonias,
            selectedColonias_geojson,
        );
    }, [coloniasGeoJson, handleSelectedColonias, selectedColonias_geojson]);

    /*const layer = useMemo(() => {
        if (activeLayerKey === "agebs"){
            return agebLayer;
        } 
        if (activeLayerKey === "colonias") return coloniaLayer;
        return null;
    }, [activeLayerKey]);*/

    // cambio de layer activa (botones arriba)
    const handleLayerToggle = (layerKey: string) => {
        if(layerKey === activeLayerKey) {
            setActiveLayerKey(null);
        } else {
            setActiveLayerKey(layerKey);
        }
    };


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

    //reset
    useEffect(() => {
        setSelectedAGEBS([]);
        setSelectedColonias([]);
        setActiveLayerKey(null);
    }, [selectedLayer]);


    //varias colonias
    //cada que haya un cambio en selectedColonias
    useEffect(() => {
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

    }, [selectedColonias, coloniasData]);

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

                {/*selectedLayer && tematicaData && mapLayerInstance && (
                    <LayerCard
                        selectedLayerData={selectedLayerData}
                        tematicaData={tematicaData}
                        color={sectionColor}
                        mapLayerInstance={mapLayerInstance}
                    />
                )*/}
                {selectedLayer && tematicaData && mapLayerInstance_AGEB && (
                    <LayerCard
                        selectedLayerData={selectedLayerData}
                        tematicaData={tematicaData}
                        color={sectionColor}
                        mapLayerInstance={mapLayerInstance_AGEB}
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
                        //...(layer ? [layer] : []), // juarez, agebs, colonias 
                        ...selectedBaseLayers.map(key => baseLayers[key]).filter(Boolean),
                        //...dissolvedLayer,
                        ...(coloniasLayer ? [coloniasLayer] : []),
                        ...dissolvedLayer,
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
                                downloadPdf(deck.current, map.current, mapLayerInstance);
                            }, 100);
                        }}>
                        <RiDownloadLine />
                    </Button>
            
                    <ZoomControls />
                    <Button className="visor__button" borderRadius={0} p={2} background={COLORS.GLOBAL.backgroundDark} onClick={() => handleLayerToggle("juarez")}>
                        <LuSquareDashed />
                    </Button>
                    <Button className="visor__button" borderRadius={0} p={2} background={COLORS.GLOBAL.backgroundDark} onClick={() => handleLayerToggle("agebs")}>
                        <PiIntersectSquareDuotone />
                    </Button>
                    <Button className="visor__button" borderRadius={0} p={2} background={COLORS.GLOBAL.backgroundDark} onClick={() => handleLayerToggle("colonias")}>
                        <PiIntersectSquareFill />
                    </Button>
                </div>
            </div>
                </div>
       );
}


export default Visor;