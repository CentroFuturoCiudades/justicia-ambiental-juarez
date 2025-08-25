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
import { MapLayer } from "../../classes/MapLayer";
import LayerCard from "../Layer Card/LayerCard";
import BusquedaColonia from "../Busqueda-Colonia/BusquedaColonia";
import { Button } from "@chakra-ui/react";
import { useRef } from "react";
import { dissolve } from "@turf/dissolve";
import { union, polygon, featureCollection } from "@turf/turf";
import { flatten } from "@turf/flatten";
import { PathStyleExtension } from '@deck.gl/extensions';
import booleanContains from "@turf/boolean-contains";           //para ver interseccion de colonias-agebs (no se usa por el momento)
import  booleanIntersects  from "@turf/boolean-intersects";     //para ver interseccion de colonias-agebs (no se usa por el momento)
import PopUp from "../Download PopUp/PopUp";
import Controls from "../Controls/Controls";
import * as turf from "@turf/turf";

const REACT_APP_MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const REACT_APP_SAS_TOKEN = import.meta.env.VITE_AZURE_SAS_TOKEN;

const Visor = () => {
    const deck = useRef<any>(null);
    const map = useRef<any>(null);
    const { 
        viewState, setViewState, 
        selectedLayer, 
        selectedBaseLayers, 
        selectedAGEBS, setSelectedAGEBS, 
        selectedColonias, setSelectedColonias, 
        // coloniasData, 
        activeLayerKey,
        mapLayers,
        selectionMode,
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
    const rangeGraphRef = useRef<HTMLDivElement | null>(null);
    const [popUp, setPopUp] = useState<boolean>(false);

    const [coords, setCoords] = useState({ latitude: viewState.latitude, longitude: viewState.longitude });
    const [circleCoords, setCircleCoords] = useState(coords);
    const [radius, setRadius] = useState(2000);
    const [polygon, setPolygon] = useState<any>();
    const [drag, setDrag] = useState<boolean>(false);
    //const [filteredFeatures, setFilteredFeatures] = useState<any[]>([]);
    const [flagDragEnd, setFlagDragEnd] = useState<boolean>(false); //para forzar el useMemo de filteredFeatures al soltar el circulo

    useEffect(() => {
        setCircleCoords(coords)
    }, [coords])

    //se queda igual porque es lo que dibuja el circulo
    useEffect(() => {
        if(!circleCoords) return;
        console.log("entro a lo que hace el circulo")
        const temp = turf.circle(
            [circleCoords.longitude, circleCoords.latitude] as any,
            radius,
            {
                units: "meters",
                steps: radius * 16 / 100,
            } as any,
        );
        setPolygon(temp);
    }, [circleCoords, radius]);

    const filteredFeatures = useMemo(() => {
        if (!polygon || !selectedLayer || selectionMode !== "radius") return [];
        const circlePolygon = turf.polygon([polygon.geometry.coordinates[0]]);
        return tematicaData.features.filter((feature: any) =>
            booleanContains(circlePolygon, feature)
            //booleanIntersects(feature, circlePolygon)
        );
    }, [flagDragEnd, selectionMode]);

    const lensLayer = new GeoJsonLayer({
        id: "lens-layer",
        data: polygon,
        filled: true,
        getFillColor: [255, 255, 255, 0],
        getLineColor: [42, 47, 58, 255],
        getLineWidth: 30,
        pickable: true, //viewState.zoom < ZOOM_SHOW_DETAILS,?? 16
        getDashArray: [6, 1],
        dashJustified: true,
        dashGapPickable: true,
        onDragStart: () => {
            setDrag(true);
            setFlagDragEnd(false);
        },
        onDrag: (info: any) => {
            if (!info || !info.coordinate) return;
            setCircleCoords({
                latitude: info.coordinate[1],
                longitude: info.coordinate[0],
            });
        },
        onDragEnd: (info: any, event: any) => {
            //debouncedHover(info);
            setDrag(false);
            setFlagDragEnd(true);
        },
        extensions: [new PathStyleExtension({ dash: true })],
        updateTriggers: {
            getDashArray: [radius],
        }
    });

    const centerPointLayer = new GeoJsonLayer({
        id: "center-point-layer",
        data: circleCoords
            ? turf.point([circleCoords.longitude, circleCoords.latitude])
            : undefined,
        filled: true,
        getLineColor: [42, 47, 58, 255],
        getLineWidth: 5,
        getFillColor: [200, 200, 200, 200],
        getRadius: 15,
        pickable: false,
    });



    /*
    var center = [-75.343, 39.984];
var radius = 5;
var options = {steps: 10, units: 'kilometers', properties: {foo: 'bar'}};
var circle = turf.circle(center, radius, options);*/



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

        if(activeLayerKey === null) {
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
            theme: layer ? layer.tematica : "default",
        });

        let jsonData = JSON.parse(JSON.stringify(activeLayerKey === "agebs" ? agebsGeoJson : coloniasGeoJson)); //copia del geojson universal de agebs/colonias
        if (layer?.property && !jsonData.features?.some((f: any) => layer.property in f.properties)) {
            setTematicaLayer(null);
            setMapLayerInstance(null);
            setTematicaData(null);
            return;
        }

        if ( layer?.dataProcesssing ) { 
            jsonData = layer.dataProcesssing(jsonData);
        }
        
        //procesa la data que va en layerCard
        const features = selectionMode === "radius" ? filteredFeatures : jsonData.features;
        const data = {...jsonData, features };
        setTematicaData(jsonData);

        //crea la capa geojson
        const geoJsonLayer = mapLayerInstance.getLayer(
            data,
            layer?.property || "",
            layer?.is_lineLayer || false,
            true,
            handleSelectedElements,
            activeLayerKey === "agebs" ? selectedAGEBS : selectedColonias,
            selectionMode
        );
        setTematicaLayer(geoJsonLayer);
        setMapLayerInstance(mapLayerInstance);

    }, [selectedLayer, activeLayerKey, agebsGeoJson, coloniasGeoJson, selectionMode, filteredFeatures]);


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

            {/* Panel izquierdo */}
            <Box className="visor__leftPanel" scrollbar="hidden">
                <div className="visor__panelContent">

                    <div className="visor__title">
                        <p className="italic">visor de </p>
                        <p className="bold"> indicadores</p>
                        <p className="bold"> ambientales y sociales</p>
                    </div>

                    <div className="visor__description">
                        <p> Selecciona una temática y haz click en la tarjeta correspondiente para visualizar la capa en el mapa. </p>
                    </div>
                    





                    <Tematica />

                    {selectedLayer && tematicaData && mapLayerInstance && (
                        <LayerCard
                            selectedLayerData={selectedLayerData}
                            tematicaData={tematicaData}
                            color={sectionColor}
                            mapLayerInstance={mapLayerInstance}
                            rangeGraphRef={rangeGraphRef}
                        />
                    )}




                </div>
            </Box>

            <div className="visor__mapContainer">
                <DeckGL
                    controller={{dragPan: !drag}}
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
                        (selectionMode ==="agebs" && dissolvedLayer),
                        (selectionMode === "radius" && lensLayer),
                        (selectionMode === "radius" && centerPointLayer),
                        //...(coloniasLayer ? [coloniasLayer] : []),
                    ]}
                    style={{ height: "100%", width: "100%", position: "relative" }}
                    //controller={true}
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
                    {coloniasGeoJson && (
                        <BusquedaColonia coloniasData={coloniasGeoJson} />
                    )}
                </div>

                {selectedLayer && mapLayerInstance && (
                    <div className="visor__legend">
                        {mapLayerInstance.getLegend(selectedLayerData?.title || "")}
                    </div>
                )}

                <div className="visor__topButtons">
                    <Controls 
                        mapLayerInstance={mapLayerInstance} 
                        rangeGraphRef={rangeGraphRef} 
                        deck={deck} 
                        map={map} 
                        setPopUp={setPopUp} 
                    />
                </div>

                {/*pop up*/ }
                {popUp && mapLayers.length > 0 && (
                    <PopUp deck={deck.current} map={map.current} setPopUp={setPopUp} />
                )}
            </div>
        </div>
       );
}


export default Visor;