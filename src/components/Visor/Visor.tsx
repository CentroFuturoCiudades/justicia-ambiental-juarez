import "./Visor.scss";
import DeckGL from "deck.gl";
import Map from "react-map-gl/mapbox";
import { useAppContext } from "../../context/AppContext";
import { useEffect, useState, useRef, use } from "react";
import { LAYERS } from "../../utils/constants";
import { Box } from "@chakra-ui/react";
import Layers from "../Layers/Layers";
import Tematica from "../Tematica/Tematica";
import CapasComplementarias from "../Capas Complementarias/CapasComplementarias";
import BusquedaColonia from "../Busqueda Colonia/BusquedaColonia";
import LayerCard from "../Layer Card/LayerCard";
import Toolbar from "../Toolbar/Toolbar";
import InfoTooltip from "../Tooltip/Info Tooltip/InfoTooltip";
import PopUp from "../Download Card/PopUp";
import { Tooltip } from "../ui/tooltip";
import { useMediaQuery } from '@chakra-ui/react';
import { BsCardText } from "react-icons/bs";
import { FaLayerGroup, FaSearch  } from "react-icons/fa";
import LayerTooltip from "../Tooltip/LayerTooltip";

const REACT_APP_MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const REACT_APP_SAS_TOKEN = import.meta.env.VITE_AZURE_SAS_TOKEN;

const Visor = () => {

    const [hydrated, setHydrated] = useState(false);
    const [isMobile] = useMediaQuery('(max-width: 800px)')
    useEffect(() => {
      setHydrated(true);
    }, []);


    const { 
        viewState, setViewState, 
        agebsGeoJson,setAgebsGeoJson,
        setColoniasGeoJson,
        selectedPoint, setSelectedPoint,
        mapLayerInstance,
        tematicaData,
        selectedLayer,  
        activeLayerKey,
        mapLayers,
        dragMap,
        layerTooltip, setLayerTooltip,
        jsonData, setJsonData,
        selectedAGEBS,
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
    const [infoCardOpen, setInfoCardOpen] = useState(false);
    const themeKey = selectedLayerData?.tematica;
    const [mobileVisibleElement, setMobileVisibleElement] = useState("layercard");

    const renderMobilePanel = () => {
        switch(mobileVisibleElement) {
            case "layercard":
                return (
                    <LayerCard
                        layer={selectedLayerData}
                        rangeGraphRef={rangeGraphRef}
                        onInfoHover={setInfoCardOpen}
                        layerCardRef={layerCardRef}
                        infoCardOpen={infoCardOpen}
                    />
                );
            case "legend":
                return mapLayerInstance?.getLegend(selectedLayerData?.title || "", selectedLayerData?.is_PointLayer, selectedLayerData?.legendTitle);
            case "tematica":
                return <Tematica />;
            case "complementary":
                return <CapasComplementarias />;
            case "colonias":
                return <BusquedaColonia />;
            case "download":
                return <PopUp deck={deck.current} map={map.current} setPopUp={setShowDownloadCard} setMobileVisibleElement={setMobileVisibleElement} />;
            default:
                return null;
        }
    };

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
        const coloniaEndpoint = "https://justiciaambientalstore.blob.core.windows.net/data/colonias.geojson";

        (async () => {
            const data = await fetch(`${coloniaEndpoint}?${REACT_APP_SAS_TOKEN}`);
            const json = await data.json();
            setColoniasGeoJson(json);
        })();
    }, []);

    if(!hydrated) return null;

    return (
        <div className="visor">

            {/* Panel izquierdo */}
            {!isMobile && (
                <Box className="visor__leftPanel" scrollbar="hidden">
                    <Box className="visor__panelContent" scrollbar="hidden">

                        <div className="visor__title">
                            <p className="italic">visor de </p>
                            <p className="bold"> indicadores</p>
                            <p className="bold"> ambientales y sociales</p>
                        </div>

                        <div className="visor__description">
                            <p> Selecciona una temática y haz click en el indicador de interés para visualizarlo en el mapa. </p>
                        </div>

                        <Tematica />

                        {selectedLayer && tematicaData && mapLayerInstance && !isMobile && (
                            <LayerCard
                                layer={selectedLayerData}
                                rangeGraphRef={rangeGraphRef}
                                onInfoHover={setInfoCardOpen}
                                layerCardRef={layerCardRef}
                                infoCardOpen={infoCardOpen}
                            />
                        )}

                    </Box>
                </Box>
            )}

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
                    onClick={info => {
                        if (!info.object) {
                            setLayerTooltip(null);
                            setSelectedPoint(null);
                        }
                    }}
                    onDrag={() => setSelectedPoint(null)}
                >
                    <Map
                        mapStyle="mapbox://styles/lameouchi/cmdhi6yd6007401qw525702ru"
                        mapboxAccessToken={REACT_APP_MAPBOX_TOKEN}
                        ref={map}
                        reuseMaps
                    />
                </DeckGL>

                { isMobile ? 
                    (
                    <>
                        <div className="buttonGroup" style={{ top: "2dvh" }}>
                            <div className="visor__buttonRow" >
                                <button className={`topButton ${mobileVisibleElement === "tematica" ? "topButton--selected" : ""}`} onClick={() => setMobileVisibleElement(mobileVisibleElement === "tematica" ? "" : "tematica")} style={{ flex: 1 }}>
                                    Tematica
                                </button>
                                <button className={`topButton ${mobileVisibleElement === "complementary" ? "topButton--selected" : ""}`} onClick={() => setMobileVisibleElement(mobileVisibleElement === "complementary" ? "" : "complementary")}>
                                    <FaLayerGroup size={18} />
                                </button>
                                { activeLayerKey === "colonias" &&
                                    <button className={`topButton ${mobileVisibleElement === "colonias" ? "topButton--selected" : ""}`} onClick={() => setMobileVisibleElement(mobileVisibleElement === "colonias" ? "" : "colonias")}>
                                        <FaSearch size={18} />
                                    </button>
                                }
                            </div>
                            <>
                                <Toolbar 
                                    rangeGraphRef={rangeGraphRef}
                                    deck={deck}
                                    map={map}
                                    setPopUp={setShowDownloadCard}
                                    setMobileVisibleElement={setMobileVisibleElement}
                                />
                            </>
                        </div>

                        <div className="buttonGroup" style={{  bottom: "2dvh" }}>
                            {mobileVisibleElement && (
                                <div className={`visor__centerPanel${mobileVisibleElement ? " visor__centerPanel--visible" : ""}`}>
                                    {renderMobilePanel()}
                                </div>
                            )}

                            <div className="visor__buttonRow">
                                <button style={{ flex: 1 }} className={`lowerButton lowerButton--${themeKey} ${mobileVisibleElement === "layercard" ? "lowerButton--selected" : ""}`} onClick={() => setMobileVisibleElement(mobileVisibleElement === "layercard" ? "" : "layercard")}>
                                    Ver datos
                                </button>
                                <button className={`lowerButton lowerButton--${themeKey} ${mobileVisibleElement === "legend" ? "lowerButton--selected" : ""}`} onClick={() => setMobileVisibleElement(mobileVisibleElement === "legend" ? "" : "legend")}>
                                    <BsCardText size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="visor__dropDowns">
                            <CapasComplementarias />
                            { activeLayerKey === "colonias" && <BusquedaColonia /> }
                        </div>

                        {selectedLayer && mapLayerInstance && tematicaData && (
                            <div className="visor__legend">
                                {mapLayerInstance.getLegend(selectedLayerData?.title || "", selectedLayerData?.is_PointLayer, selectedLayerData?.legendTitle)}
                            </div>
                        )}

                        <Toolbar
                            rangeGraphRef={rangeGraphRef}
                            deck={deck}
                            map={map}
                            setPopUp={setShowDownloadCard}
                        />
               
                        {/*Download Summary PopUp */}
                        {showDownloadCard && mapLayers.length > 0 && (
                            <div className="visor__downloadCard">
                                <PopUp deck={deck.current} map={map.current} setPopUp={setShowDownloadCard} />
                            </div>
                        )}
                    </>
                )
                }


                <InfoTooltip
                    show={infoCardOpen}
                    containerRef={mapContainerRef}
                    layerCardRef={layerCardRef}
                    selectedLayerData={selectedLayerData}
                />
                
                {layerTooltip && selectedPoint &&
                    <LayerTooltip />
                }
            </div>
        </div>
       );
}


export default Visor;