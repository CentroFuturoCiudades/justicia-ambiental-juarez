import { useAppContext } from "../context/AppContext";
import { useEffect, useState } from "react";
import { GeoJsonLayer } from "deck.gl";
import { MapLayer } from "../classes/MapLayer";
import { LAYERS } from "../utils/constants";

/* THEME LAYER:
    - Crea una capa geojson con la TEMATICA seleccionada
*/
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
        filteredFeatures,
    } = useAppContext();

    const [tematicaLayer, setTematicaLayer] = useState<GeoJsonLayer | null>(null);

    // Maneja la seleccion de agebs/colonias
    const handleSelectedElements = (info: any) => {
        if (info) {
            const isAgeb = activeLayerKey === "agebs";
            const key = isAgeb ? info.object.properties.cvegeo : info.object.properties.name;
            const setSelected = isAgeb ? setSelectedAGEBS : setSelectedColonias;
            setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
        }
    };

    // Crea la capa de la tematica seleccionada
    useEffect(() => {

        if(activeLayerKey === null || !selectedLayer) {
            setTematicaLayer(null);
            setMapLayerInstance(null);
            setTematicaData(null);
            return;
        };

        const layer = LAYERS[selectedLayer as keyof typeof LAYERS];

        // Crea instancia de MapLayer
        const mapLayerInstance = new MapLayer({
            opacity: 1,
            title: layer.title,
            formatValue: layer.formatValue,
            theme: layer.tematica,
        });

        // Copia del geojson universal de agebs/colonias (para aplicar cambios dependiendo del dataProcessing de la capa seleccionada)
        let jsonData = JSON.parse(JSON.stringify(activeLayerKey === "agebs" ? agebsGeoJson : coloniasGeoJson));

        // Verifica si la propiedad de la capa está presente en los features (quitar cuando esten los datos completos)
        if ( !jsonData.features?.some((f: any) => layer.property in f.properties) ) {
            setTematicaLayer(null);
            setMapLayerInstance(null);
            setTematicaData(null);
            return;
        }

        // Si hay procesamiento especifico de la capa, aplica cambios a los datos
        if ( layer?.dataProcesssing ) { 
            jsonData = layer.dataProcesssing(jsonData); //aplica cambios a la copia
        }

        // Data de la capa: todos los features y los filtrados (en caso de que este activado el radio)
        const allFeatures = jsonData.features;
        const data = {
            ...jsonData, 
            features: selectionMode === "radius" ? filteredFeatures : jsonData.features,
            allFeatures,
         };
        setTematicaData(data);

        // Crea la capa geojson de tematica (con todos los features o los filtrados dentro del radio)
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