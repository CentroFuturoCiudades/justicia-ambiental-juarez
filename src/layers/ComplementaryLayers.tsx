import { useAppContext } from "../context/AppContext";
import { useEffect, useState } from "react";
import { GeoJsonLayer } from "deck.gl";
import { CAPAS_BASE_CODEBOOK } from "../utils/constants";
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
                
                //If has parent & is parent is loaded (dont fetch again, just filter parent data)
                if(complementary.parent && baseLayers[complementary.parent]) {
                    let data = baseLayers[complementary.parent].props.data;
                    data = complementary.dataFiltering(data);

                    const complementaryLayer = new ComplementaryLayer({ colors: complementary?.colors, title: complementary.title });
                    const newLayer = complementaryLayer.getLayer(data, complementary.field || "", complementary.isPointLayer || false, complementary.hoverInfo ? handleClick : undefined, complementary.categoryColors ? complementary.categoryColors : undefined);
                    setBaseLayers(prev => ({ ...prev, [layerKey]: newLayer }) );
                    return;
                }
                
                
                const url = complementary?.url;
                if (!url) {
                    console.error(`No URL for layer: ${layerKey}`);
                    return null;
                }

                const urlBlob = `${url}?${REACT_APP_SAS_TOKEN}`;

                fetch(urlBlob)
                    .then(res => res.json())
                    .then(data => {
                        const complementaryLayer = new ComplementaryLayer({ colors: complementary?.colors || ["#f4f9ff", "#08316b"], title: complementary.title });
                        //for filtering or processing data before creating layer
                        if(complementary?.dataProcessing) {
                            data = complementary.dataProcessing(data);
                        }
                        const newLayer = complementaryLayer.getLayer(data, complementary.field || "", complementary.isPointLayer || false, complementary.hoverInfo ? handleClick : undefined, complementary.categoryColors ? complementary.categoryColors : undefined);
                        setBaseLayers(prev => ({ ...prev, [layerKey]: newLayer }));
                    })
                    .catch(error => console.error(`Error loading GeoJSON for layer ${layerKey}:`, error));
                }
            });
        }, [selectedBaseLayers]);

    return { layers: Object.values(baseLayers) };
}

export default ComplementaryLayers;