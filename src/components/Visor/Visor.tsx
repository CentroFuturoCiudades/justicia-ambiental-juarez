import React from "react";

import "./Visor.scss";
import DeckGL from "deck.gl";
import Map from "react-map-gl/mapbox";
import { useAppContext } from "../../context/AppContext";
import Tematica from "../Tematica/Tematica";
import CapasBase from "../Capas Base/CapasBase";
import { LAYERS, SECTIONS, COLORS } from "../../utils/constants";

const REACT_APP_MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const Visor = ()=> {

    const { viewState, selectedLayers, selectedLayersMultiple } = useAppContext(); //una a la vez (por ahora)
    //const selectedLayersData = LAYERS[selectedLayers as keyof typeof LAYERS];

    /*const validSectionKeys = Object.keys(COLORS).filter(key => key !== "GLOBAL") as (keyof typeof COLORS)[];
    const sectionKey = Object.entries(SECTIONS)
        .find(([, section]) => section.layers.includes(selectedLayers as typeof section.layers[number]))
        ?.[0] as keyof typeof SECTIONS | undefined;
    const sectionColor = validSectionKeys.includes(sectionKey as keyof typeof COLORS)
        ? (COLORS[sectionKey as keyof typeof COLORS] as { primary?: string }).primary
        : undefined;
    */

    return (
        <div className="visor">
            <div className="visor__leftPanel"> 
                <div className="visor__title">visor para la evaluación ambiental</div>

                { selectedLayersMultiple.length == 0 && (
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
            

                {/* -----una sola capa seleccionada a la vez-------
                { selectedLayers && (
                    <div className="visor__layerCard" style={{borderColor: sectionColor}}>
                        <div className="visor__layerCardTitle" style={{background: sectionColor}}> 
                            <p>{selectedLayersData?.title}</p>
                        </div>
                        <b>Descripción</b>
                        <br></br>
                        {selectedLayersData?.description || "No hay descripción disponible."}
                        <br></br>
                        </div>
                )}*/}

                {selectedLayersMultiple.length > 0 && selectedLayersMultiple.map(layerKey => {
                    const layerData = LAYERS[layerKey as keyof typeof LAYERS];
                    const sectionKey = Object.entries(SECTIONS)
                        .find(([, section]) => section.layers.includes(layerKey as typeof section.layers[number]))
                        ?.[0] as keyof typeof SECTIONS | undefined;
                    const sectionColor = sectionKey ? COLORS[sectionKey]?.primary : undefined;
                    return (
                        <div key={layerKey} className="visor__layerCard" style={{borderColor: sectionColor}}>
                            <div className="visor__layerCardTitle" style={{background: sectionColor}}> 
                                <p style={{fontSize:"1.1rem"}}>{layerData?.title}</p>
                            </div>
                            <div className="visor__layerCardBody">
                                <p style={{fontSize: "1.1rem"}}>
                                    {layerData?.description || "No hay descripción disponible."}
                                </p>
                            </div>
                        </div>
                    );
                })}

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
                <CapasBase />
            </div>
        </div>
    );
}


export default Visor;