import { useAppContext } from "../context/AppContext";
import { useEffect, useState } from "react";
import { GeoJsonLayer } from "deck.gl";

const REACT_APP_SAS_TOKEN = import.meta.env.VITE_AZURE_SAS_TOKEN;

/*
    COMPLEMENTARY LAYERS:
    - Fetch de cada "capa complementaria" seleccionada (selectedBaseLayers)
    - Se crea una GeoJsonLayer por cada selectedBaseLayer
*/
const ComplementaryLayers = () => {
    const { selectedBaseLayers } = useAppContext();
    const [baseLayers, setBaseLayers] = useState<{ [key: string]: GeoJsonLayer }>({});
    
    useEffect(() => {
    
        if (selectedBaseLayers.length === 0) {
            setBaseLayers({});
            return;
        }
    
        selectedBaseLayers.forEach(({key, url}) => {
            if (!baseLayers[key]) {
                if (!url) {
                    console.error(`No URL for layer: ${key}`);
                    return null;
                }

                const urlBlob = `${url}?${REACT_APP_SAS_TOKEN}`;

                fetch(urlBlob)
                    .then(res => res.json())
                    .then(data => {
                        const newLayer = new GeoJsonLayer({
                            id: key,
                            data: data,
                            pickable: true,
                            filled: true,
                            getFillColor: [250, 0, 0, 100],
                            getLineColor: [255, 255, 255, 180],
                        });
                        setBaseLayers(prev => ({ ...prev, [key]: newLayer }));
                    })
                    .catch(error => console.error(`Error loading GeoJSON for layer ${key}:`, error));
                }
            });
        }, [selectedBaseLayers]);

    return { layers: Object.values(baseLayers) };
}

export default ComplementaryLayers;