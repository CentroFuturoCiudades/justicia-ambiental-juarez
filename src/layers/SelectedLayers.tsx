import { useAppContext } from "../context/AppContext";
import { GeoJsonLayer } from "deck.gl";
import { useEffect, useMemo } from "react";
import { dissolve } from "@turf/dissolve";
import { flatten } from "@turf/flatten";
import { featureCollection } from "@turf/turf";
import { LAYERS } from "../utils/constants";

/*
    SELECTED LAYER:
    - Crea una capa a partir de las agebs/colonias seleccionadas
*/
const SelectedLayer = () => {
    const { 
        agebsGeoJson, coloniasGeoJson,
        activeLayerKey,
        selectedAGEBS,
        selectedColonias,
        selectedPoint, setSelectedPoint,
        selectionMode,
        selectedLayer,
        tematicaData,
        layerTooltip
    } = useAppContext();

    useEffect(() => {
        console.log("selected point", selectedPoint);
        //console.log('layer tooltip', layerTooltip);
    }, [selectedPoint]);

   let dissolvedLayer: GeoJsonLayer[] = [];
   let pointLayer: GeoJsonLayer[] = [];

    // Obtiene features a base de los identificadores (cvegeos/nombre) seleccionados para agebs/colonias
    const selectedGeometries = useMemo(() => {
        const isAgeb = activeLayerKey === "agebs";
        const setSelected = new Set(isAgeb ? selectedAGEBS : selectedColonias);
        return (isAgeb ? agebsGeoJson : coloniasGeoJson)?.features?.filter(
            (feature: any) => setSelected.has(isAgeb ? feature.properties.index : feature.properties.nombre)
        );
    }, [selectedAGEBS, selectedColonias, activeLayerKey]);

    const pointFeature = useMemo(() => {
        if(!selectedPoint || !tematicaData) return null;
        const found = tematicaData.allFeatures.filter((f: any) => f.properties.ID === selectedPoint) || null;
        return found
    }, [selectedPoint]);

    // Si hubo agebs/colonias seleccionadas, se disuelven en una sola geometria y se hace la capa
    if(selectedGeometries && selectedGeometries.length > 0) {
        try {
            const fc = featureCollection(selectedGeometries);
            const flattened = flatten(fc);
            const dissolved = dissolve(flattened as any);
            // create a new layer with the dissolved geometry
            dissolvedLayer = [new GeoJsonLayer({
                id: 'dissolved',
                data: dissolved,
                pickable: true,
                filled: false,
                getLineColor: [250, 200, 0, 255],
                getLineWidth: 70,
            })];
        } catch (error) {
            console.error('Error dissolving features:', error);
        }
    }

    // If a point is selected, create a layer for it
    if(pointFeature && pointFeature.length > 0) {
        console.log('entro a la capa de point selected')
        const pointFc = featureCollection(pointFeature);
        pointLayer = [new GeoJsonLayer({
            id: 'point',
            data: pointFc,
            pickable: true,
            filled: true,
            getFillColor: [255, 0, 0, 255],
            getPointRadius: 5,
            pointRadiusUnits: 'pixels',
            //pointRadiusMinPixels: 6,
            onClick: () => setSelectedPoint(null),
        })];
    }

    //return { layers: ((layer.capa && layer.pickable) || selectionMode === "agebs") ? dissolvedLayer : [] };
    if(selectionMode === "agebs"){
        return { layers: dissolvedLayer };
    } else if(selectionMode === null && pointFeature){
        return {layers: pointLayer}
    } else {
        return { layers: [] };
    }
}

export default SelectedLayer;