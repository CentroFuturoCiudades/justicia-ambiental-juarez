import React from "react";

import "./Visor.scss";
import DeckGL from "deck.gl";
import Map from "react-map-gl/mapbox";
import { useAppContext } from "../../context/AppContext";

const REACT_APP_MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const Visor = ()=> {

    const { viewState } = useAppContext();
    
    return (
        <div className="visor">
            <div className="visor__leftPanel"> 
                <div className="visor__title">visor para la evaluación ambiental</div>

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
            </div>
        </div>
    );
}


export default Visor;