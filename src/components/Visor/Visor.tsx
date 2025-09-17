import "./Visor.scss";
import DeckGL from "deck.gl";
import Map from "react-map-gl/mapbox";
import { useAppContext } from "../../context/AppContext";
import { useEffect, useState, useRef } from "react";
import { LAYERS } from "../../utils/constants";
import { Box } from "@chakra-ui/react";
import Layers from "../Layers/Layers";
import Tematica from "../Tematica/Tematica";
import CapasComplementarias from "../Capas Complementarias/CapasComplementarias";
import BusquedaColonia from "../Busqueda Colonia/BusquedaColonia";
import LayerCard from "../Layer Card/LayerCard";
import Toolbar from "../Toolbar/Toolbar";
import RadiusSlider from "../Toolbar/RadiusSlider";
import InfoTooltip from "../Layer Card/Info Tooltip/InfoTooltip";
import PopUp from "../Download Card/PopUp";
import { Tooltip } from "../ui/tooltip";

const REACT_APP_MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const REACT_APP_SAS_TOKEN = import.meta.env.VITE_AZURE_SAS_TOKEN;

const Visor = () => {

    const { 
        viewState, setViewState, 
        setAgebsGeoJson,
        setColoniasGeoJson,
        mapLayerInstance,
        tematicaData,
        selectedLayer,  
        activeLayerKey,
        mapLayers,
        dragMap,
        selectionMode,
        layerTooltip
    } = useAppContext();

    const { layers } = Layers();

    // Refs
    const deck = useRef<any>(null);
    const map = useRef<any>(null);
    const layerCardRef = useRef<HTMLDivElement | null>(null);
    const rangeGraphRef = useRef<HTMLDivElement | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    const selectedLayerData = selectedLayer ? LAYERS[selectedLayer as keyof typeof LAYERS] : undefined;

    const [showDownloadCard, setShowDownloadCard] = useState<boolean>(false);
    const [showInfoCard, setShowInfoCard] = useState(false);

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
                            rangeGraphRef={rangeGraphRef}
                            onInfoHover={setShowInfoCard}
                            layerCardRef={layerCardRef}
                        />
                    )}

                </Box>
            </Box>

            <div className="visor__mapContainer" ref={mapContainerRef}>
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
                    <CapasComplementarias />
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
                    setPopUp={setShowDownloadCard}
                />
                {selectionMode === "radius" && 
                    <RadiusSlider />
                }

                {/*Download Summary PopUp */}
                {showDownloadCard && mapLayers.length > 0 && (
                    <PopUp deck={deck.current} map={map.current} setPopUp={setShowDownloadCard} />
                )}

                    <InfoTooltip
                        show={showInfoCard}
                        containerRef={mapContainerRef}
                        layerCardRef={layerCardRef}
                        selectedLayerData={selectedLayerData}
                    />
                

                {layerTooltip &&
                    <div className="visor__layerTooltip" style={{ left: layerTooltip.x + 8, top: layerTooltip.y }}>
                        {Math.round(layerTooltip.content.release) + " kg"}
                    </div>
                }
            </div>
        </div>
       );
}


export default Visor;