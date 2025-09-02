import "./Visor.scss";
import DeckGL from "deck.gl";
import Map from "react-map-gl/mapbox";
import { useAppContext } from "../../context/AppContext";
import Tematica from "../Tematica/Tematica";
import CapasBase from "../Capas Base/CapasBase";
import { LAYERS, COLORS } from "../../utils/constants";
import { Box, Slider, SliderControl } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import LayerCard from "../Layer Card/LayerCard";
import BusquedaColonia from "../Busqueda-Colonia/BusquedaColonia";
import { useRef } from "react";
import Controls from "../Controls/Controls";
import InfoTooltip from "../Layer Card/InfoTooltip";
import Layers from "../Layers/Layers";
import PopUp from "../Download PopUp/PopUp";

const REACT_APP_MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const REACT_APP_SAS_TOKEN = import.meta.env.VITE_AZURE_SAS_TOKEN;

const Visor = () => {
    const deck = useRef<any>(null);
    const map = useRef<any>(null);
    const layerCardRef = useRef<HTMLDivElement | null>(null);
    const { 
        viewState, setViewState, 
        setAgebsGeoJson,
        coloniasGeoJson, setColoniasGeoJson,
        mapLayerInstance,
        tematicaData,
        selectedLayer,  
        activeLayerKey,
        mapLayers,
        dragMap,
        radius, setRadius,
        selectionMode,
    } = useAppContext();

    const selectedLayerData = selectedLayer ? LAYERS[selectedLayer as keyof typeof LAYERS] : undefined;
    const tematicaKey = selectedLayerData?.tematica as keyof typeof COLORS | undefined;
    const sectionColor = tematicaKey ? COLORS[tematicaKey]?.primary : "#ccc";

    const rangeGraphRef = useRef<HTMLDivElement | null>(null);
    const [downloadPopUp, setDownloadPopUp] = useState<boolean>(false);
    const [showInfoTooltip, setShowInfoTooltip] = useState<boolean>(false);
    const { layers } = Layers();

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

    return (
        <div className="visor">

            {/* Panel izquierdo */}
            <Box className="visor__leftPanel">
                <Box className="visor__panelContent" scrollbar="hidden">

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
                        <div ref={layerCardRef}>
                        <LayerCard
                            selectedLayerData={selectedLayerData}
                            tematicaData={tematicaData}
                            color={sectionColor}
                            mapLayerInstance={mapLayerInstance}
                            rangeGraphRef={rangeGraphRef}
                            onInfoHover={setShowInfoTooltip}
                        />
                        </div>
                    )}

                </Box>
            </Box>

            <div className="visor__mapContainer">
                <DeckGL
                    controller={{ dragPan: !dragMap }}
                    ref={deck}
                    initialViewState={viewState}
                    viewState={viewState}
                    onViewStateChange={({ viewState }) => {
                        const { latitude, longitude, zoom } = viewState as { latitude: number; longitude: number; zoom: number };
                        setViewState({ latitude, longitude, zoom });
                    }}
                    layers={ layers }
                    style={{ height: "100%", width: "100%", position: "relative" }}
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
                    {activeLayerKey === "colonias" && (
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
                        setPopUp={setDownloadPopUp} 
                    />
                </div>

                {selectionMode === "radius" && 
                    <div className="slider">
                        <Slider.Root 
                            className="slider__root"
                            value={[radius]} //intial value of 2000
                            min={1000}
                            max={5000}
                            step={100}
                            onValueChange={details => setRadius(details.value[0])}
                        >
                            <SliderControl>
                                <Slider.Track className="slider__track" >
                                    <Slider.Range className="slider__range" />
                                </Slider.Track>
                                <Slider.Thumbs className="slider__thumb" />
                            </SliderControl>
                        </Slider.Root>
                    </div>
                }

                {/*Download PopUp */}
                {downloadPopUp && mapLayers.length > 0 && (
                    <PopUp deck={deck.current} map={map.current} setPopUp={setDownloadPopUp} />
                )}

                {showInfoTooltip && <InfoTooltip />}
            </div>
        </div>
       );
}


export default Visor;