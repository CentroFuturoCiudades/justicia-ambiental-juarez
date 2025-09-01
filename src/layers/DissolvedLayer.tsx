import { useAppContext } from "../context/AppContext";
import { GeoJsonLayer } from "deck.gl";
import { useMemo } from "react";
import { dissolve } from "@turf/dissolve";
import { flatten } from "@turf/flatten";
import { featureCollection } from "@turf/turf";

const DissolvedLayer = () => {
    const { 
        agebsGeoJson, coloniasGeoJson,
        activeLayerKey,
        selectedAGEBS,
        selectedColonias,
        selectionMode
    } = useAppContext();

   let dissolvedLayer: GeoJsonLayer[] = [];
   
    //get geometries of selected agebs/colonias
    const selectedGeometries = useMemo(() => {
        const isAgeb = activeLayerKey === "agebs";
        const setSelected = new Set(isAgeb ? selectedAGEBS : selectedColonias);
        return (isAgeb ? agebsGeoJson : coloniasGeoJson)?.features?.filter(
            (feature: any) => setSelected.has(isAgeb ? feature.properties.cvegeo : feature.properties.name)
        );
    }, [selectedAGEBS, selectedColonias, activeLayerKey]);

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

    if(selectionMode !== "agebs") {
        return { layers: [] };
    }
    return { layers: dissolvedLayer };
}

export default DissolvedLayer;