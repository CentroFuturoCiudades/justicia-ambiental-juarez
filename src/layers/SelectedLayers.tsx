import { useAppContext } from "../context/AppContext";
import { GeoJsonLayer } from "deck.gl";
import { useMemo } from "react";
import { dissolve } from "@turf/dissolve";
import { flatten } from "@turf/flatten";
import { featureCollection } from "@turf/turf";

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
        selectionMode
    } = useAppContext();

   let dissolvedLayer: GeoJsonLayer[] = [];

    // Obtiene features a base de los identificadores (cvegeos/nombre) seleccionados para agebs/colonias
    const selectedGeometries = useMemo(() => {
        const isAgeb = activeLayerKey === "agebs";
        const setSelected = new Set(isAgeb ? selectedAGEBS : selectedColonias);
        return (isAgeb ? agebsGeoJson : coloniasGeoJson)?.features?.filter(
            (feature: any) => setSelected.has(isAgeb ? feature.properties.index : feature.properties.nombre)
        );
    }, [selectedAGEBS, selectedColonias, activeLayerKey]);

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
                pickable: false,
                filled: false,
                getLineColor: [250, 200, 0, 255],
                getLineWidth: 70,
            })];
        } catch (error) {
            console.error('Error dissolving features:', error);
        }
    }

    return { layers: selectionMode === "agebs" ? dissolvedLayer : [] };
}

export default SelectedLayer;