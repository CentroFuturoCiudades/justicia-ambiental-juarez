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
        activeLayerKey, setActiveLayerKey,
        selectedLayer,
        setMapLayerInstance,
        setTematicaData,
        selectionMode, setSelectionMode,
        selectedAGEBS, setSelectedAGEBS,
        selectedColonias, setSelectedColonias,
        filteredFeatures,
        setLayerTooltip,
        setJsonData,
    } = useAppContext();

    const [tematicaLayer, setTematicaLayer] = useState<GeoJsonLayer | null>(null);

    // Maneja la seleccion de agebs/colonias
    const handleSelectedElements = (info: any) => {
        if (info) {
            const isAgeb = activeLayerKey === "agebs";
            const key = isAgeb ? info.object.properties.index : info.object.properties.nombre;
            const setSelected = isAgeb ? setSelectedAGEBS : setSelectedColonias;
            setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
        }
    };
    
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

    // Crea la capa de la tematica seleccionada
    useEffect(() => {
        //limpiar la vieja mapLayerInstance
        //setTematicaLayer(null);
        //setMapLayerInstance(null);
        //setTematicaData(null);

        if( !selectedLayer) {
            setTematicaLayer(null);
            setMapLayerInstance(null);
            setTematicaData(null);
            return;
        };

        const layer = LAYERS[selectedLayer as keyof typeof LAYERS];

        const fetchData = async () => {
            // Crea instancia de MapLayer
            const mapLayerInstance = new MapLayer({
                opacity: 1,
                colors: layer?.colors,
                title: layer.title,
                amountOfColors: layer?.amountOfColors,
                formatValue: layer.formatValue,
                categorical: layer.type === "Categorica" ? true : false,    //determinar si es categorica o continua
                categoryLabels: layer?.labels, //los labels personalizados para las categorias (si es categorica) (EJ. 1: "Muy bajo", 2: "Bajo", etc)
                categoryLegend: layer?.categoricalLegend, // los colores y labels personalizados para las categorias (si es categorica) (EJ. {value: "educacion", label: "Educación", color: "#e9c46a"}, etc)
            });

            let jsonData;
            // IF CAPA (con su propio url porq datos no estan en el geojson universal) -> fetch de su url
            if (layer?.url) {
                jsonData = await mapLayerInstance.loadData(layer.url);
                setSelectionMode(null);
                setActiveLayerKey(null);
            } else {
                // Copia del geojson universal de agebs/colonias (para aplicar cambios dependiendo del dataProcessing de la capa seleccionada)
                jsonData = JSON.parse(JSON.stringify(activeLayerKey === "agebs" ? agebsGeoJson : coloniasGeoJson));
            }

            // Verifica si la propiedad de la capa está presente en los features (quitar cuando esten los datos completos)
            /*if ( !jsonData.features?.some((f: any) => layer.property in f.properties) ) {
                console.log(`La propiedad "${layer.property}" no se encontró en los datos de la capa seleccionada.`);
                setTematicaLayer(null);
                setMapLayerInstance(null);
                setTematicaData(null);
                return;
            }*/
           //If capa => fetch jsonData if jsonurl exists else use geojson data from url for graphs
           if(layer?.capa){
                if(layer?.jsonurl){
                    fetch(layer.jsonurl)
                    .then(response => response.json())
                    .then(data => {
                        setJsonData(data);
                    })
                    .catch(err => console.error("Error fetching jsonData:", err));
                } else {
                    setJsonData(jsonData.features);
                }
           }

            // Si hay que cambiar algo en los datos de la capa (ej. porcentajes)
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
                layer?.is_PointLayer || false,
                layer?.trimOutliers || false,
                layer?.url ? (selectedLayer === "industrias_contaminantes" ? handleClick : () => {}) : handleSelectedElements,
                activeLayerKey === "agebs" ? selectedAGEBS : selectedColonias,
                selectionMode
            );
            console.log("SelectionMode", selectionMode);
            setTematicaLayer(geoJsonLayer);
            setMapLayerInstance(mapLayerInstance);
        };

        fetchData();

    }, [selectedLayer, activeLayerKey, selectionMode, filteredFeatures, agebsGeoJson]);
    

    return { layers: tematicaLayer ? [tematicaLayer] : [] };
}

export default ThemeLayer;