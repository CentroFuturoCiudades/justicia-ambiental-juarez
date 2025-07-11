import React, { useEffect } from "react";

import "./Visor.scss";
import DeckGL from "deck.gl";
import Map from "react-map-gl/mapbox";
import { useAppContext } from "../../context/AppContext";
import Tematica from "../Tematica/Tematica";
import { LAYERS, SECTIONS, COLORS } from "../../utils/constants";

const REACT_APP_MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const Visor = ()=> {

    const { viewState, selectedLayers } = useAppContext();
    const selectedLayersData = LAYERS[selectedLayers as keyof typeof LAYERS]; // si es selección única
    const sectionKey = Object.entries(SECTIONS).find(([, section]) => section.layers.includes(selectedLayers as typeof section.layers[number]))?.[0] as keyof typeof COLORS | undefined;
    const sectionColor = sectionKey ? COLORS[sectionKey]?.primary : undefined;

    useEffect(() => {
        console.log("VISOR las selected layers han cambiado:", selectedLayers);
    }, [selectedLayers]);
    
    return (
        <div className="visor">
            <div className="visor__leftPanel"> 
                <div className="visor__title">visor para la evaluación ambiental</div>

                { !selectedLayers && (
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
            

                { selectedLayers && (
                    <div className="visor__layerCard">
                        <div className="visor__layerCardTitle"> 
                            <p>{selectedLayersData?.title}</p>
                        </div>
                        <b>Descripción</b>
                        <br></br>
                        {selectedLayersData?.description || "No hay descripción disponible."}
                        <br></br>
                        </div>
                )}

            </div>
            <div className="visor__mapContainer"> 
                <DeckGL 
                    initialViewState={ viewState }
                    layers={[]}
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
            </div>
        </div>
    );
}


export default Visor;