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
    const { selectedBaseLayers, setLayerTooltip, setSelectedPoint, setJsonData, setLayerInfoData, layerInfoData, selectedEquipamientosFilters, isLoadingComplementaryLayer, setIsLoadingComplementaryLayer } = useAppContext();
    const [baseLayers, setBaseLayers] = useState<{ [key: string]: GeoJsonLayer[] | BitmapLayer }>({});
    const [equuipamientosData, setEquipamientosData] = useState<any>(null);


    const handleClick = (layerKey: string) => (info: any) => {
        if (info) {
            setLayerTooltip({
                x: info.x,
                y: info.y,
                content: info.object.properties,
                layerKey: layerKey
            });
            setSelectedPoint(info.object.properties.ID);
        } else {
            setLayerTooltip(null);
            setSelectedPoint(null);
        }
    };

    //equipamientos selection/deselection filtering on equipamientos complementary layer
    useEffect(() => {
        //si capas seleccionadas tiene equipamientos
        if (baseLayers['equipamientos']) {
            const equipamientosLayer = baseLayers['equipamientos'];
            //filter copy of fetched equipamientos data w/ selected equipamientos filters
            const dataFiltered = equuipamientosData.features.filter((feature: any) =>
                selectedEquipamientosFilters.includes(feature.properties.group)
            );
            const newLayer = new GeoJsonLayer({
                ...equipamientosLayer[0].props,
                data: dataFiltered
            });
            setBaseLayers(prev => ({ ...prev, 'equipamientos': [newLayer] }));
        } else {
            setEquipamientosData(null); 
        }
    }, [selectedEquipamientosFilters]);
    
    //generate complementary layers
    useEffect(() => {
        let isCurrent = true;
        //deseleccionar capas
        setBaseLayers(prev => {
            const filtered = Object.fromEntries(
                Object.entries(prev).filter(([key]) => selectedBaseLayers.includes(key))
            );
            return filtered;
        });
        //setLayerInfoData({});
        setLayerTooltip(null);
        setSelectedPoint(null);
    
        if (selectedBaseLayers.length === 0) {
            setBaseLayers({});
           // setLayerInfoData({});
            return;
        }
    
        selectedBaseLayers.forEach(layerKey => {
            if (!baseLayers[layerKey]) {
                if(setIsLoadingComplementaryLayer) setIsLoadingComplementaryLayer(true);
                const complementary = CAPAS_BASE_CODEBOOK[layerKey as keyof typeof CAPAS_BASE_CODEBOOK];
                
                const url = complementary?.url;
                if (!url) {
                    console.error(`No URL for layer: ${layerKey}`);
                    return null;
                }
                const urlBlob = `${url}?${REACT_APP_SAS_TOKEN}`;

                let graphData : any = null;

                (async () => {
                    //if complementary is raster
                    if(complementary?.raster){
                        const rasterLayerInstance = new RasterLayer({
                            opacity: 0.7,
                            colors: complementary?.colors || ["#f4f9ff", "#08316b"],
                            title: complementary.title
                        });
                        await rasterLayerInstance.loadRaster(urlBlob);
                        if(!isCurrent) return;
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
                        if(!isCurrent) return;
                        
                        if(complementary?.dataProcessing) {
                            data = complementary.dataProcessing(data);
                            if(layerKey === 'equipamientos') {
                                setEquipamientosData(data);     //copy of equipamientos data for filters
                            }
                        }
                        
                        const newLayer = complementaryLayerInstance.getLayer(
                            data, 
                            complementary.field, 
                            complementary.isPointLayer, 
                            complementary.isLine,
                            complementary.title === "industrias contaminantes" ? handleClick(layerKey) : undefined, 
                            complementary.categoryColors ? complementary.categoryColors : undefined, 
                            complementary.units,
                            complementary.lineWidth,
                            complementary.radius
                        );

                        /*let extraLayer: GeoJsonLayer | null = null;
                        //extra layer if extraurl (circles for industries)
                        if(complementary.extraUrl) {
                            const extraUrlBlob = `${complementary.extraUrl}?${REACT_APP_SAS_TOKEN}`;
                            const extraData = await complementaryLayerInstance.loadData(extraUrlBlob);
                            extraLayer = new GeoJsonLayer({
                                id: 'extra-layer-complementary',
                                data: extraData,
                                stroked: true,
                                filled: true,
                                getFillColor: [196, 196, 196, 100],
                                getLineColor: [0, 0, 0, 200],
                                getLineWidth: 10,
                            });
                        }
                        setBaseLayers(prev => ({ ...prev, [layerKey]: extraLayer ? [extraLayer, newLayer] : [newLayer] }));*/
                        setBaseLayers(prev => ({ ...prev, [layerKey]: [newLayer] }));
                    }

                    if(complementary?.jsonurl){
                        const data = await fetch(complementary.jsonurl);
                        graphData = await data.json();
                        if(complementary?.jsonDataProcessing){
                            graphData = complementary.jsonDataProcessing(graphData)
                        }
                    }

                   // setJsonData(graphData)
                   if(graphData != null){
                       console.log("graphData", graphData);
                       console.log("layerKey", layerKey);
                        setLayerInfoData(prev => ({
                            ...prev,
                            [layerKey]: graphData
                        }));
                    }
                    //console.log('layerInfoData', layerInfoData)
                    if(setIsLoadingComplementaryLayer) setIsLoadingComplementaryLayer(false);

                })();

        }});
        return () => { isCurrent = false; };
        }, [selectedBaseLayers, selectedEquipamientosFilters]);

    return { layers: Object.values(baseLayers) };
}

export default ComplementaryLayers;