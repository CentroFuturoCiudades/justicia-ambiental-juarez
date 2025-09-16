import { useAppContext } from "../context/AppContext";
import { useEffect, useState } from "react";
import { GeoJsonLayer } from "deck.gl";
import { COMPLEMENTARY_LAYERS, CAPAS_BASE_CODEBOOK } from "../utils/constants";
import { ComplementaryLayer } from "../classes/ComplementaryLayer";

const REACT_APP_SAS_TOKEN = import.meta.env.VITE_AZURE_SAS_TOKEN;

/*
    COMPLEMENTARY LAYERS:
    - baseLayers guarda key de capa y su GeoJsonLayer
    - Fetch de cada "capa complementaria" seleccionada (selectedBaseLayers) que aun no esta en baseLayers
    - Se crea una GeoJsonLayer por cada selectedBaseLayer
*/
const ComplementaryLayers = () => {
    const { selectedBaseLayers, setLayerTooltip } = useAppContext();
    const [baseLayers, setBaseLayers] = useState<{ [key: string]: GeoJsonLayer }>({});

    const handleClick = (info: any) => {
        if (info) {
            setLayerTooltip({
                x: info.x,
                y: info.y,
                content: info.object.properties
            });
        } else {
            setLayerTooltip(null);
        }
    };
    
    useEffect(() => {
        //deseleccionar capas
        setBaseLayers(prev => {
            const filtered = Object.fromEntries(
                Object.entries(prev).filter(([key]) => selectedBaseLayers.includes(key))
            );
            return filtered;
        });
    
        if (selectedBaseLayers.length === 0) {
            setBaseLayers({});
            return;
        }
    
        selectedBaseLayers.forEach(layerKey => {
            if (!baseLayers[layerKey]) {
                const complementary = CAPAS_BASE_CODEBOOK[layerKey as keyof typeof CAPAS_BASE_CODEBOOK];
                const url = complementary?.url;
                if (!url) {
                    console.error(`No URL for layer: ${layerKey}`);
                    return null;
                }

                const urlBlob = `${url}?${REACT_APP_SAS_TOKEN}`;

                fetch(urlBlob)
                    .then(res => res.json())
                    .then(data => {
                        /*const newLayer = new GeoJsonLayer({
                            id: `complementary-${layerKey}`,
                            data: data,
                            pickable: true,
                            filled: true,
                            getFillColor: [250, 0, 0, 100],
                            getLineColor: [255, 255, 255, 180],
                            getRadius: f => {
                                const value = f.properties.release;
                                return value ? Math.sqrt(value) * 2.5 : 4;
                            },
                            pointRadiusMinPixels: 6,
                            pointRadiusMaxPixels: 30,
                        });*/
                        const complementaryLayer = new ComplementaryLayer({ colors: complementary?.colors || ["#f4f9ff", "#08316b"] });
                        const newLayer = complementaryLayer.getLayer(data, complementary.field || "", complementary.isPointLayer || false, complementary.hoverInfo ? handleClick : undefined);
                        setBaseLayers(prev => ({ ...prev, [layerKey]: newLayer }));
                    })
                    .catch(error => console.error(`Error loading GeoJSON for layer ${layerKey}:`, error));
                }
            });
        }, [selectedBaseLayers]);

    return { layers: Object.values(baseLayers) };
}

export default ComplementaryLayers;