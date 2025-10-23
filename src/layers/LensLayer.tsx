
import * as turf from "@turf/turf";
import { useAppContext } from "../context/AppContext";
import { useEffect, useState } from "react";
import { GeoJsonLayer } from "deck.gl";
import  booleanIntersects  from "@turf/boolean-intersects"; 
import { PathStyleExtension } from '@deck.gl/extensions';

/*
    LENS LAYER:
    - Crea un lente circular alrededor del punto seleccionado
    - Determina los filteredFeatures dentro del lente (radio)
*/
const LensLayer = () => {
    
    const {
        viewState,
        selectedLayer,
        selectionMode,
        tematicaData,
        setFilteredFeatures,
        setDragMap,
        radius,
        flagSlider, setFlagSlider,
        activeLayerKey,
        setSelectedAGEBS, setSelectedColonias,
    } = useAppContext();

    const [circleCoords, setCircleCoords] = useState({
        latitude: viewState.latitude,
        longitude: viewState.longitude
    });
    const [polygon, setPolygon] = useState<any>();
    const allFeatures = tematicaData ? tematicaData.allFeatures : [];

    // Crea circulo basado en coordenadas del mapa y valor de radio
    useEffect(() => {
        if(!circleCoords) {
            console.log('no circleCoords');
            return;
        };
        console.log('circleCoords', circleCoords);
        console.log('radius', radius);
        const temp = turf.circle(
            [circleCoords.longitude, circleCoords.latitude] as any,
            radius,
            {
                units: "meters",
                steps: radius * 16 / 100,
            } as any,
        );
        setPolygon(temp);
    }, [circleCoords, radius]);

    // Filtra los features: busca entre todos los features cuales intersectan con el circulo (cada que termina el Drag)
    useEffect(() => {
        if (!polygon || !selectedLayer || selectionMode !== "radius") return;
        console.log("Filtering features within lens...");
        console.log('selectionMode', selectionMode);
        const circlePolygon = turf.polygon([polygon.geometry.coordinates[0]]);
        //features dentro del circulo
       // console.log('allFeatures', allFeatures); //si esta leyendo las all features de colonias
        console.log('circlePolygon', circlePolygon);
        const featuresWithInvalidGeometries = allFeatures.filter((f: any) => !f.geometry || (f.geometry.type === "Polygon" && f.geometry.coordinates.length === 0));
        if (featuresWithInvalidGeometries.length > 0) {
            //console.warn(`Warning: ${featuresWithInvalidGeometries.length} features have invalid geometries and will be skipped.`);
            console.log('these features are invalid:', featuresWithInvalidGeometries);
        }
        const filtered = allFeatures.filter((feature: any) =>
            booleanIntersects(feature, circlePolygon)
        );
        console.log(`Found ${filtered.length} features within lens.`, filtered);
        setFilteredFeatures(filtered); //saves all features
        setFlagSlider(false);
        //NEW: depending on activeLayerKey, save identifiers of filtered features
        const identifiers = filtered.map(f => f.properties[activeLayerKey === "agebs" ? "index" : "nombre"]);
        if (activeLayerKey === "agebs") {
            setSelectedAGEBS(identifiers);
        }
        else {
            setSelectedColonias(identifiers);
        }
    }, [flagSlider, selectionMode]);

    // lensLayer: crea un GeoJsonLayer para el circulo
    const lensLayer = new GeoJsonLayer({
        id: "lens-layer",
        data: polygon,
        filled: true,
        getFillColor: [255, 255, 255, 0],
        getLineColor: [250, 200, 0, 255],
        getLineWidth: 30,
        pickable: true, //viewState.zoom < ZOOM_SHOW_DETAILS,?? 16
        getDashArray: [6, 1],
        dashJustified: true,
        dashGapPickable: true,
        onDragStart: () => {
            setDragMap(true);
            setFlagSlider(false);
        },
        onDrag: (info: any) => {
            if (!info || !info.coordinate) return;
            setCircleCoords({
                latitude: info.coordinate[1],
                longitude: info.coordinate[0],
            });
        },
        onDragEnd: (info: any, event: any) => {
            setDragMap(false);
            setFlagSlider(true);
        },
        extensions: [new PathStyleExtension({ dash: true })],
        updateTriggers: {
            getDashArray: [radius],
        }
    });

    // Centro del circulo
    const centerPointLayer = new GeoJsonLayer({
        id: "center-point-layer",
        data: circleCoords
            ? turf.point([circleCoords.longitude, circleCoords.latitude])
            : undefined,
        filled: true,
        getLineColor: [250, 200, 0, 255],
        getLineWidth: 5,
        getFillColor: [200, 200, 200, 200],
        getRadius: 15,
        pickable: false,
    });
    
    return { layers: selectionMode === "radius" ? [lensLayer, centerPointLayer] : [] };
}

export default LensLayer;