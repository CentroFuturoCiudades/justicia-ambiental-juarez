import "./Visor.scss";
import DeckGL from "deck.gl";
import Map from "react-map-gl/mapbox";
import { useAppContext } from "../../context/AppContext";
import { useEffect, useState, useRef } from "react";
import { LAYERS, CAPAS_BASE_CODEBOOK } from "../../utils/constants";
import { Box, Spinner } from "@chakra-ui/react";
import Layers from "../Layers/Layers";
import Tematica from "../Tematica/Tematica";
import CapasComplementarias from "../Capas Complementarias/CapasComplementarias";
import BusquedaColonia from "../Busqueda Colonia/BusquedaColonia";
import LayerCard from "../Layer Card/LayerCard";
import Toolbar from "../Toolbar/Toolbar";
import InfoTooltip from "../Tooltip/Info Tooltip/InfoTooltip";
import PopUp from "../Download Card/PopUp";
import { TileLayer, BitmapLayer } from "deck.gl";
import { useMediaQuery } from '@chakra-ui/react';
import { BsCardText } from "react-icons/bs";
import { FaLayerGroup, FaSearch  } from "react-icons/fa";
import LayerTooltip from "../Tooltip/LayerTooltip";
import { GeoJsonLayer } from "deck.gl";
import { LATITUDE_RANGE, LONGITUDE_RANGE, ZOOM_RANGE } from "../../context/AppContext";

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
        setAgebsGeoJson,
        setColoniasGeoJson,
        selectedPoint, setSelectedPoint,
        mapLayerInstance,
        selectedLayer,  
        activeLayerKey,
        mapLayers,
        dragMap,
        layerTooltip, setLayerTooltip,
        layerInfoData,
        selectionMode,
        hoverColonia,
        isSatellite
        
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
    const [limiteUrbanoLayer, setLimiteUrbanoLayer] = useState<any>(null);
    

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
                return mapLayerInstance?.getLegend(selectedLayerData?.title || "", selectedLayerData?.is_PointLayer, selectedLayerData?.legendTitle, selectedLayerData?.textRangesLegend);
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

    //fetch limite urbano de juarez
    useEffect(() => {
        (async () => {
            const data = await fetch(CAPAS_BASE_CODEBOOK["limite_urbano"].url + `?${REACT_APP_SAS_TOKEN}`);
            const json = await data.json();
            const limiteUrbano = new GeoJsonLayer({
                id: 'limite-urbano-layer',
                data: json,
                stroked: true,
                filled: false,
                getLineColor: [0, 0, 0, 200],
                getLineWidth: 1,
                lineWidthUnits: 'pixels',

            });
            setLimiteUrbanoLayer(limiteUrbano);
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

                        {selectedLayer && mapLayerInstance && !isMobile && (
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
                    viewState={viewState} //es
                    onViewStateChange={({ viewState }) => {
                        let { latitude, longitude, zoom } = viewState as { latitude: number; longitude: number; zoom: number };
                        latitude = Math.min(LATITUDE_RANGE[1], Math.max(LATITUDE_RANGE[0], latitude));
                        longitude = Math.min(LONGITUDE_RANGE[1], Math.max(LONGITUDE_RANGE[0], longitude));
                        zoom = Math.min(ZOOM_RANGE[1], Math.max(ZOOM_RANGE[0], zoom));
                        setViewState({ latitude, longitude, zoom });
                    }}
                    layers={ limiteUrbanoLayer ? [ ...layers, limiteUrbanoLayer ] : layers } //las layers y limite urbano (siempre visible)
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
                        mapStyle= {isSatellite ? "mapbox://styles/mapbox/satellite-v9" : "mapbox://styles/lameouchi/cmdhi6yd6007401qw525702ru"}
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
                    <span style={{position: 'absolute', top: 'min(3dvh, 1.75dvw)', left: ' min(3dvh, 1.75dvw)', right: 'min(3dvh, 1.75dvw)', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', pointerEvents: 'none'}}>
                        <Toolbar
                            rangeGraphRef={rangeGraphRef}
                            deck={deck}
                            map={map}
                            setPopUp={setShowDownloadCard}
                        />

                        <div className="visor__cdJuarez">
                            <p style={{borderLeft:'2px solid white', borderRight: '2px solid white', padding: '0 min(0.6dvh, 0.4dvw'}}>CIUDAD JUAREZ</p>
                        </div>

                        <div className="visor__dropDowns">
                            <CapasComplementarias />
                            { activeLayerKey === "colonias" && <BusquedaColonia /> }
                        </div>
                    </span>

                        {selectedLayer && mapLayerInstance && (
                            <div className="visor__legend">
                                {mapLayerInstance.getLegend(selectedLayerData?.title || "", selectedLayerData?.is_PointLayer, selectedLayerData?.legendTitle, selectedLayerData?.textRangesLegend)}
                            </div>
                        )}
               
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
                
                {layerTooltip && selectedPoint && layerInfoData &&
                    <LayerTooltip />
                }

                {hoverColonia && 
                    <div className="tooltip" style={{ left: hoverColonia.x, top: hoverColonia.y, border: "none", padding: 'min(0.5dvh, 0.4dvw)', pointerEvents: 'none', transform: 'translateY(-100%) translateX(-50%)' }}>
                        {hoverColonia.colonia}
                    </div>
                }

                {!mapLayerInstance && selectedLayer &&
                    <div style={{position: "absolute", left:"50%", transform: "translateX(-50%)", top: "50%", width: "100%", display: "flex", justifyContent: "center", zIndex: 1000}}>
                        <Spinner size={"xl"}/>
                    </div>
                }
            </div>
        </div>
       );
}


export default Visor;