import { useAppContext } from "../context/AppContext";
import { useEffect, useState } from "react";
import { GeoJsonLayer } from "deck.gl";
import { MapLayer } from "../classes/MapLayer";
import { LAYERS } from "../utils/constants";

const ThemeLayer = () => {
    const { 
        agebsGeoJson, coloniasGeoJson,
        activeLayerKey,
        selectedLayer,
        setMapLayerInstance,
        setTematicaData,
        selectionMode,
        selectedAGEBS, setSelectedAGEBS,
        selectedColonias, setSelectedColonias,
        filteredFeatures
    } = useAppContext();

    const [tematicaLayer, setTematicaLayer] = useState<GeoJsonLayer | null>(null);

    const handleSelectedElements = (info: any) => {
        if (info) {
            const isAgeb = activeLayerKey === "agebs";
            const key = isAgeb ? info.object.properties.cvegeo : info.object.properties.name;
            const setSelected = isAgeb ? setSelectedAGEBS : setSelectedColonias;
            setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
        }
    };

    //crear mapLayerInstance, geojsonLayer y la data
    useEffect(() => {
    
        if(activeLayerKey === null) {
            setTematicaLayer(null);
            setMapLayerInstance(null);
            setTematicaData(null);
            return;
        };

        let layer;
        if(selectedLayer) {
            layer = LAYERS[selectedLayer as keyof typeof LAYERS];
        }

        //crea instancia
        const mapLayerInstance = new MapLayer({
            opacity: 1,
            title: layer ? layer.title : "initial",
            formatValue: layer ? layer.formatValue : "",
            theme: layer ? layer.tematica : "default",
        });

        let jsonData = JSON.parse(JSON.stringify(activeLayerKey === "agebs" ? agebsGeoJson : coloniasGeoJson)); //copia del geojson universal de agebs/colonias
        if (layer?.property && !jsonData.features?.some((f: any) => layer.property in f.properties)) {
            setTematicaLayer(null);
            setMapLayerInstance(null);
            setTematicaData(null);
            return;
        }

        if ( layer?.dataProcesssing ) { 
            jsonData = layer.dataProcesssing(jsonData); //proceso el geojson completo
        }
        
        //procesa la data que va en layerCard
        const allFeatures = jsonData.features;
        const data = {
            ...jsonData, 
            features: selectionMode === "radius" ? filteredFeatures : jsonData.features,
            allFeatures,
         };
        console.log("data for themelayer", data);
        //setTematicaData(jsonData); //toda la data
        setTematicaData(data);

        //crea la capa geojson
        const geoJsonLayer = mapLayerInstance.getLayer(
            data,
            layer?.property || "",
            layer?.is_lineLayer || false,
            true,
            handleSelectedElements,
            activeLayerKey === "agebs" ? selectedAGEBS : selectedColonias,
            selectionMode
        );
        setTematicaLayer(geoJsonLayer);
        setMapLayerInstance(mapLayerInstance);

    }, [selectedLayer, activeLayerKey, selectionMode, filteredFeatures]);
    

    return { layers: tematicaLayer ? [tematicaLayer] : [] };
}

export default ThemeLayer;