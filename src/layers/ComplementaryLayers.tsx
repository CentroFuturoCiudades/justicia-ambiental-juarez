import { useAppContext } from "../context/AppContext";
import { useEffect, useState } from "react";
import { BitmapLayer, GeoJsonLayer } from "deck.gl";
import { CAPAS_BASE_CODEBOOK } from "../utils/constants";
import { ComplementaryLayer } from "../classes/ComplementaryLayer";
import { RasterLayer } from "../classes/RasterLayer";

const REACT_APP_SAS_TOKEN = import.meta.env.VITE_AZURE_SAS_TOKEN;

/*
    COMPLEMENTARY LAYERS:
    - baseLayers guarda key de capa y su GeoJsonLayer
    - Fetch de cada "capa complementaria" seleccionada (selectedBaseLayers) que aun no esta en baseLayers
    - Se crea una GeoJsonLayer por cada selectedBaseLayer
*/
const ComplementaryLayers = () => {
    const { selectedBaseLayers, setLayerTooltip } = useAppContext();
    const [baseLayers, setBaseLayers] = useState<{ [key: string]: GeoJsonLayer[] | BitmapLayer }>({});

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
                //solo aplica para equipamientos (maybe quitarlo si esta innecesario y solo aplicaba a equipamientos)
                //segun yo para ahorrarme el fetch
                /*if(complementary.parent && baseLayers[complementary.parent]) {
                    let data = baseLayers[complementary.parent].props.data;
                    data = complementary.dataFiltering(data);

                    const complementaryLayer = new ComplementaryLayer({ colors: complementary?.colors, title: complementary.title });
                    const newLayer = complementaryLayer.getLayer(data, complementary.field || "", complementary.isPointLayer || false, complementary.clickInfo ? handleClick : undefined, complementary.categoryColors ? complementary.categoryColors : undefined);
                    setBaseLayers(prev => ({ ...prev, [layerKey]: newLayer }) );
                    return;
                }*/
                
                const url = complementary?.url;
                if (!url) {
                    console.error(`No URL for layer: ${layerKey}`);
                    return null;
                }
                const urlBlob = `${url}?${REACT_APP_SAS_TOKEN}`;

                (async () => {
                    //if complementary is raster
                    if(complementary?.raster){
                        console.log('loading raster layer for', layerKey);
                        const rasterLayerInstance = new RasterLayer({
                            opacity: 0.7,
                            title: complementary.title
                        });
                        await rasterLayerInstance.loadRaster(urlBlob);
                        const newLayer = rasterLayerInstance.getBitmapLayer();
                        setBaseLayers(prev => ({ ...prev, [layerKey]: [newLayer] }));
                    } 
                    //else regular geojson complementary layer
                    else {
                        const complementaryLayerInstance = new ComplementaryLayer({ 
                            colors: complementary?.colors || ["#f4f9ff", "#08316b"], 
                            title: complementary.title ,
                            opacity: complementary?.opacity || 1
                        });
                        let data = await complementaryLayerInstance.loadData(urlBlob);
                        if(complementary?.dataProcessing) {
                            data = complementary.dataProcessing(data);
                            console.log('processed data for', layerKey, data);
                        }
                        const newLayer = complementaryLayerInstance.getLayer(data, complementary.field || "", complementary.isPointLayer || false, complementary.isLine, complementary.clickInfo ? handleClick : undefined, complementary.categoryColors ? complementary.categoryColors : undefined);

                        let extraLayer: GeoJsonLayer | null = null;
                        //extra layer if extraurl (circles for industries)
                        if(complementary.extraUrl) {
                            const extraUrlBlob = `${complementary.extraUrl}?${REACT_APP_SAS_TOKEN}`;
                            const extraData = await complementaryLayerInstance.loadData(extraUrlBlob);
                            extraLayer = new GeoJsonLayer({
                                id: 'extra-layer',
                                data: extraData,
                                stroked: true,
                                filled: true,
                                getFillColor: [196, 196, 196, 100],
                                getLineColor: [0, 0, 0, 200],
                                getLineWidth: 10,
                            });
                        }
                        setBaseLayers(prev => ({ ...prev, [layerKey]: extraLayer ? [newLayer, extraLayer] : [newLayer] }));
                    }
                })();


                /*fetch(urlBlob)
                .then(res => res.json())
                .then(data => {
                   // const complementaryLayer = new ComplementaryLayer({ colors: complementary?.colors || ["#f4f9ff", "#08316b"], title: complementary.title });
                    //for filtering or processing data before creating layer
                    if(complementary?.dataProcessing) {
                        data = complementary.dataProcessing(data);
                    }

                    let newLayer;
                    if(complementary?.raster){
                        const rasterLayerInstance = new RasterLayer({
                            opacity: 0.7,
                            title: complementary.title
                        });
                        await rasterLayerInstance.loadRaster(urlBlob);
                        newLayer = rasterLayerInstance.getBitmapLayer();
                    } else {
                        const complementaryLayer = new ComplementaryLayer({ colors: complementary?.colors || ["#f4f9ff", "#08316b"], title: complementary.title });
                        newLayer = complementaryLayer.getLayer(data, complementary.field || "", complementary.isPointLayer || false, complementary.clickInfo ? handleClick : undefined, complementary.categoryColors ? complementary.categoryColors : undefined);
                    }
                    
                    setBaseLayers(prev => ({ ...prev, [layerKey]: newLayer }));
                })
                .catch(error => console.error(`Error loading GeoJSON for layer ${layerKey}:`, error));*/

            }
        });
        }, [selectedBaseLayers]);

    return { layers: Object.values(baseLayers) };
}

export default ComplementaryLayers;