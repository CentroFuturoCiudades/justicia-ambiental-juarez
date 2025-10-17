import { useAppContext } from "../context/AppContext";
import { useEffect, useState } from "react";
import { GeoJsonLayer } from "deck.gl";
import { MapLayer } from "../classes/MapLayer";
import { LAYERS } from "../utils/constants";
import { json } from "d3";

/* THEME LAYER:
    - Crea una capa geojson con la TEMATICA seleccionada
*/
const ThemeLayer = () => {
    const { 
        agebsGeoJson, coloniasGeoJson,
        activeLayerKey, setActiveLayerKey,
        selectedLayer,
        setMapLayerInstance,
        tematicaData, setTematicaData,
        selectionMode, setSelectionMode,
        selectedAGEBS, setSelectedAGEBS,
        selectedColonias, setSelectedColonias,
        selectedPoint, setSelectedPoint,
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
            //console.log("prev:", selectedPoint, "clicked ID:", info.object.properties.ID);
            //setSelectedPoint(prev => prev === info.object.properties.ID ? null : info.object.properties.ID);
            //console.log("selected point:", selectedPoint);
            setSelectedPoint(info.object.properties.ID);
            /*setSelectedPoint(prev =>
            prev === info.object.properties.ID ? null : info.object.properties.ID
        );*/
        } else {
            setLayerTooltip(null);
            setSelectedPoint(null);
        }
    };

    //useEffect json for graphs
    /*useEffect(() => {
        setJsonData(null);
        const layer = LAYERS[selectedLayer as keyof typeof LAYERS];
        if (!selectedLayer || !layer?.capa || !tematicaData) return;

        if(layer?.jsonurl){
            //no estoy esperando los datos antes de seguir
            fetch(layer.jsonurl)
            .then(response => response.json())
            .then(data => {
                setJsonData(data);
            })
            .catch(err => console.error("Error fetching jsonData:", err));
        } else {
            setJsonData(tematicaData.features);
        }
    }, [tematicaData, selectedLayer]);*/




    // Crea la capa de la tematica seleccionada
    useEffect(() => {
        setLayerTooltip(null); //cerrar tooltip al cambiar de capa

        if( !selectedLayer) {
            setTematicaLayer(null);
            setMapLayerInstance(null);
            setTematicaData(null);
            setJsonData(null);
            return;
        };

        const layer = LAYERS[selectedLayer as keyof typeof LAYERS];
        let isEffectActive = true; // race condition flag (evitar datos de capa anterior si se cambia rapido de capa)

        //limpiar la vieja mapLayerInstance (para no ver datos de la capa anterior mientras carga la nueva)
        //solo las capas tematicas sin url se limpian al inicio
        if(!layer.url) {
            setMapLayerInstance(null);
            setTematicaData(null);
            setJsonData(null);
        }


        const fetchData = async () => {
            let jsonData;
            // si la capa tiene su url (capas municipales), hacer fetch porque sus datos no vienen en el geojson universal
            if (layer?.url) {
                try {
                    const response = await fetch(layer.url);
                    jsonData = await response.json();
                } catch (err) {
                    console.error("Error fetching capa GEOJSON data:", err);
                    return;
                }
                //bloquear selection y visualization tools
                setSelectionMode(null);
                setActiveLayerKey(null);
            } else {
                // Copia del geojson universal de agebs/colonias (para aplicar cambios dependiendo del dataProcessing de la capa seleccionada)
                jsonData = JSON.parse(JSON.stringify(activeLayerKey === "agebs" ? agebsGeoJson : coloniasGeoJson));
            }

            // Si hay que cambiar algo en los datos de la capa (ej. porcentajes)
            if ( layer?.dataProcesssing ) { 
                jsonData = layer.dataProcesssing(jsonData); //aplica cambios a la copia
            }
            console.log("Fetched capa data:", jsonData);


            // Data de la capa: todos los features y los filtrados (en caso de que este activado el radio)
            const allFeatures = jsonData.features;
            const data = {
                ...jsonData, 
                features: selectionMode === "radius" ? filteredFeatures : jsonData.features,
                allFeatures,
            };
            //setTematicaData(data);

            if(isEffectActive) {
                if(layer?.url) {
                    setTematicaData(null);
                    setMapLayerInstance(null);
                    setJsonData(null);
                }
                setTematicaData(data);

                //2do fetch de datos para graphs (si hay, solo para las capas municipales)
                if(layer.graphs){
                    if(layer?.jsonurl){
                        fetch(layer.jsonurl)
                        .then(response => response.json())
                        .then(data => {
                            const processedData = layer.jsonDataProcessing ? layer.jsonDataProcessing(data) : data;
                            //console.log("processed json data", processedData);
                            setJsonData(processedData);
                        })
                        .catch(err => console.error("Error fetching jsonData:", err));
                    } else {
                        setJsonData(data.features);
                    }
                }
                // Crea instancia de MapLayer
                const mapLayerInstance = new MapLayer({
                    opacity: 1,
                    colors: layer?.colors,
                    title: layer.title,
                    theme: layer?.tematica,
                    amountOfColors: layer?.amountOfColors,
                    formatValue: layer.formatValue,
                    categorical: layer.type === "Categorica" ? true : false,    //determinar si es categorica o continua
                    categoryLabels: layer?.labels, //los labels personalizados para las categorias (si es categorica) (EJ. 1: "Muy bajo", 2: "Bajo", etc)
                    categoryLegend: layer?.categoricalLegend, // los colores y labels personalizados para las categorias (si es categorica) (EJ. {value: "educacion", label: "Educación", color: "#e9c46a"}, etc)
                });
                // Crea la capa geojson de tematica (con todos los features o los filtrados dentro del radio)
                const geoJsonLayer = mapLayerInstance.getLayer(
                    data,
                    layer?.property || "",
                    layer?.is_PointLayer || false,
                    layer?.trimOutliers || false,
                    layer?.url ? (selectedLayer === "industrias_contaminantes" ? handleClick : () => {}) : handleSelectedElements,
                    //layer?.capa ? (layer?.featureInfo ? handleClick : () => {}) : handleSelectedElements,
                    activeLayerKey === "agebs" ? selectedAGEBS : selectedColonias,
                    selectionMode,
                    layer?.capa ? layer.pickable : true,
                );
                setTematicaLayer(geoJsonLayer);
                setMapLayerInstance(mapLayerInstance);
            }
        };

        fetchData();
        return () => { isEffectActive = false; };

    }, [selectedLayer, activeLayerKey, selectionMode, filteredFeatures, agebsGeoJson]);
    

    return { layers: tematicaLayer ? [tematicaLayer] : [] };
}

export default ThemeLayer;