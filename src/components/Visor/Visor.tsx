import "./Visor.scss";
import DeckGL from "deck.gl";
import Map from "react-map-gl/mapbox";
import { useAppContext } from "../../context/AppContext";
import Tematica from "../Tematica/Tematica";
import CapasBase from "../Capas Base/CapasBase";
import { LAYERS, COLORS } from "../../utils/constants";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import LayerCard from "../Layer Card/LayerCard";
import BusquedaColonia from "../Busqueda-Colonia/BusquedaColonia";
import { useRef } from "react";
import Toolbar from "../Toolbar/Toolbar";
import RadiusSlider from "../Toolbar/RadiusSlider";
import InfoTooltip from "../Layer Card/InfoTooltip";
import Layers from "../Layers/Layers";
import PopUp from "../Download PopUp/PopUp";
import ReactDOM from "react-dom";

const REACT_APP_MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const REACT_APP_SAS_TOKEN = import.meta.env.VITE_AZURE_SAS_TOKEN;

const Visor = () => {
    const deck = useRef<any>(null);
    const map = useRef<any>(null);
    const layerCardRef = useRef<HTMLDivElement | null>(null);
    const [showHoverCard, setShowHoverCard] = useState(false);
    const [cardRect, setCardRect] = useState<DOMRect | null>(null);
    const handleInfoHover = (show: boolean) => {
        setShowHoverCard(show);
        if (show && layerCardRef.current) {
            setCardRect(layerCardRef.current.getBoundingClientRect());
        }
    };

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
                        <LayerCard
                            selectedLayerData={selectedLayerData}
                            tematicaData={tematicaData}
                            color={sectionColor}
                            mapLayerInstance={mapLayerInstance}
                            rangeGraphRef={rangeGraphRef}
                            //onInfoHover={setShowInfoTooltip}
                            onInfoHover={handleInfoHover}
                            layerCardRef={layerCardRef}
                        />
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
                    { activeLayerKey === "colonias" && <BusquedaColonia /> }
                </div>

                {selectedLayer && mapLayerInstance && (
                    <div className="visor__legend">
                        {mapLayerInstance.getLegend(selectedLayerData?.title || "")}
                    </div>
                )}

                <Toolbar 
                    rangeGraphRef={rangeGraphRef}
                    deck={deck}
                    map={map}
                    setPopUp={setDownloadPopUp}
                />

                {selectionMode === "radius" && 
                    <RadiusSlider />
                }

                {/*Download Summary PopUp */}
                {downloadPopUp && mapLayers.length > 0 && (
                    <PopUp deck={deck.current} map={map.current} setPopUp={setDownloadPopUp} />
                )}

                {showHoverCard && cardRect && 
                    <InfoTooltip cardRect={cardRect} />
                }
            </div>
        </div>
       );
}


export default Visor;