import { useAppContext } from "../context/AppContext";
import { use, useEffect, useState } from "react";
import { GeoJsonLayer, BitmapLayer } from "deck.gl";
import { MapLayer } from "../classes/MapLayer";
import { RasterLayer } from "../classes/RasterLayer";
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
        tematicaData, setTematicaData,
        selectionMode, setSelectionMode,
        selectedAGEBS, setSelectedAGEBS,
        selectedColonias, setSelectedColonias,
        selectedPoint, setSelectedPoint,
        filteredFeatures,
        setLayerTooltip,
        setJsonData,    //for graphs
        setLayerInfoData,   //for layer tooltio (copy of jsonData but for layer info)
        setHoverColonia
    } = useAppContext();

    const [tematicaLayer, setTematicaLayer] = useState<GeoJsonLayer[] | BitmapLayer | null>(null);

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
                content: info.object.properties,
                layerKey: selectedLayer,
            });
            setSelectedPoint(info.object.properties.ID);
        } else {
            setLayerTooltip(null);
            setSelectedPoint(null);
        }
    };

    const handleHover = (info:any) => {
        console.log("Hover info in ThemeLayer:", info);
        if (info && info.object && activeLayerKey) { //only colonia geojson has 'nombre' property
            setHoverColonia({
                x: info.x,
                y: info.y,
                colonia: activeLayerKey === "colonias" ? info.object.properties.nombre : info.object.properties.index,
            });
        } else {
            setHoverColonia(null);
        }
    };

    //with every layer change, to avoid showing old layer while new one loads
    useEffect(() => {
            setMapLayerInstance(null);
            setTematicaLayer(null);
            setTematicaData(null);
            setJsonData(null); 
            setHoverColonia(null);
        
    }, [selectedLayer]);

    // Crea la capa de la tematica seleccionada
    useEffect(() => {
        setLayerTooltip(null); //cerrar tooltip al cambiar de capa

        if( !selectedLayer) {
            //setTematicaLayer(null);
            //setMapLayerInstance(null);
            //setTematicaData(null);
            //setJsonData(null); 
            return;
        };

       // setMapLayerInstance(null);

        const layer = LAYERS[selectedLayer as keyof typeof LAYERS];
        let layerData; //feature collection object in order to create de layer
        let newGeoJsonLayer;
        let extraGeoJsonLayer;
        let graphData = null;

        if(!layer.colonias && activeLayerKey === "colonias") {
            setActiveLayerKey("agebs");
        }

        //fetch data de capa tematica
        (async () => {
            //1. create mapLayerInstance (but dont update context variable yet)
            if(layer.raster ) {
               // setSelectionMode(null);
               // setActiveLayerKey(null);

                console.log("Loading raster layer:", layer.title);
                const rasterLayerInstance = new RasterLayer({
                    opacity: 0.7,
                    colors: layer?.colors,
                    title: layer.title,
                    scaleType: layer?.scaleType,
                    thresholds: layer?.thresholds,
                });
                await rasterLayerInstance.loadRaster(layer.url);
                const newBitmapLayer = rasterLayerInstance.getBitmapLayer();
                setTematicaLayer(newBitmapLayer);
                setMapLayerInstance(rasterLayerInstance);
            } else {
            const mapLayerInstance = new MapLayer({
                opacity: 1,
                colors: layer?.colors,
                title: layer.title,
                theme: layer?.tematica,
                amountOfColors: layer?.amountOfColors,
                formatValue: layer.formatValue,
                categorical: layer.type === "Categorica" ? true : false,    //determinar si es categorica o continua
                categoryLegend: layer?.categoricalLegend, // los colores y labels personalizados para las categorias (si es categorica) (EJ. {value: "educacion", label: "Educación", color: "#e9c46a"}, etc)
                scaleType: layer?.scaleType,
                thresholds: layer?.thresholds
            });

            //2. Get data for layer
            //if capa, fetch data
            if(layer.url) {
                //setSelectionMode(null);
                //setActiveLayerKey(null);

                layerData = await mapLayerInstance.loadData(`${layer.url}`);
                //industrias contaminantes que viene con 2 capas
                if(layer.extraLayerUrl) {
                    const extraLayerData = await mapLayerInstance.loadData(`${layer.extraLayerUrl}`);
                    //create extra GeoJsonLayer
                    extraGeoJsonLayer = new GeoJsonLayer({
                        id: 'extra-layer',
                        data: extraLayerData,
                        stroked: true,
                        filled: true,
                        getFillColor: [196, 196, 196, 100],
                        getLineColor: [0, 0, 0, 200],
                        getLineWidth: 10,
                    });
                }
            } else {
                //if regular indicator, just copy agebs/colonias geojson from context
                layerData = JSON.parse(JSON.stringify(activeLayerKey === "agebs" ? agebsGeoJson : coloniasGeoJson));
            }

            //extra! remove features with null geometry (en vulnerabilidad_calor habia varias que rompian radio y seleccion)
            layerData.features = layerData.features.filter((feature: any) => feature.geometry !== null ); //filter out features with null geometry
            //2. dataProcessing (if any)
            if(layer.dataProcessing) {
                layerData = layer.dataProcessing(layerData);
            }

            //3.
            // Data de la capa: todos los features y los filtrados (en caso de que este activado el radio)
            const allFeatures = layerData.features;
            const data = {
                ...layerData, 
                features: selectionMode === "radius" ? filteredFeatures : layerData.features,
                allFeatures,
            };

            //4. create GeoJsonLayer
            newGeoJsonLayer = mapLayerInstance.getLayer(
                data,
                layer?.property || "",
                layer?.is_PointLayer || false,
                layer?.trimOutliers || false,
                layer?.url ? (selectedLayer === "industrias_contaminantes" ? handleClick : () => {}) : handleSelectedElements,
                activeLayerKey === "agebs" ? selectedAGEBS : selectedColonias,
                selectionMode,
                layer?.capa ? layer.pickable : true,
                selectedLayer === "industrias_contaminantes" ? 5 : undefined,
               handleHover
            )

            //5. fetch jsonData for graphs (if any)
            if(layer.graphs){
                if(layer.jsonurl) {
                    const data = await fetch(layer.jsonurl);
                    graphData = await data.json();
                    graphData = layer.jsonDataProcessing ? layer.jsonDataProcessing (graphData) : graphData;
                } else {
                    graphData = data.features;
                }
            }

            //6. set context variables
            setMapLayerInstance(mapLayerInstance);
            setTematicaData(data);
            setTematicaLayer( extraGeoJsonLayer ? [extraGeoJsonLayer, newGeoJsonLayer] : [newGeoJsonLayer] );
            setJsonData(graphData);
            if(graphData != null && selectedLayer==="industrias_contaminantes") {
                setLayerInfoData(prev => ({
                    ...prev,
                    [selectedLayer]: graphData
                })); //same data for layer tooltip
            }
        }

        })();

    }, [selectedLayer, activeLayerKey, selectionMode, filteredFeatures, agebsGeoJson]);
    

    return { layers: tematicaLayer ? [tematicaLayer] : [] };
}

export default ThemeLayer;