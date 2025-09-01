
import * as turf from "@turf/turf";
import { useAppContext } from "../context/AppContext";
import { useEffect, useState } from "react";
import { GeoJsonLayer } from "deck.gl";
import  booleanIntersects  from "@turf/boolean-intersects"; 
import { PathStyleExtension } from '@deck.gl/extensions';

const LensLayer = () => {
    
    const {
        viewState,
        selectedLayer,
        selectionMode,
        tematicaData,
        setFilteredFeatures,
        setDragMap,
    } = useAppContext();
    const [coords, setCoords] = useState({ latitude: viewState.latitude, longitude: viewState.longitude });
    const [circleCoords, setCircleCoords] = useState(coords);
    const [radius, setRadius] = useState(2000);
    const [polygon, setPolygon] = useState<any>();
    const [flagDragEnd, setFlagDragEnd] = useState<boolean>(false);
    const allFeatures = tematicaData ? tematicaData.allFeatures : [];

    useEffect(() => {
        setCircleCoords(coords)
    }, [coords])
    
    useEffect(() => {
        if(!circleCoords) return;
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

    useEffect(() => {
        if (!polygon || !selectedLayer || selectionMode !== "radius") return;
        const circlePolygon = turf.polygon([polygon.geometry.coordinates[0]]);
        const filtered = allFeatures.filter((feature: any) =>
            booleanIntersects(turf.centroid(feature), circlePolygon)
        );
        setFilteredFeatures(filtered);
    }, [flagDragEnd, selectionMode]);

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
            setFlagDragEnd(false);
        },
        onDrag: (info: any) => {
            if (!info || !info.coordinate) return;
            setCircleCoords({
                latitude: info.coordinate[1],
                longitude: info.coordinate[0],
            });
        },
        onDragEnd: (info: any, event: any) => {
            //debouncedHover(info);
            setDragMap(false);
            setFlagDragEnd(true);
        },
        extensions: [new PathStyleExtension({ dash: true })],
        updateTriggers: {
            getDashArray: [radius],
        }
    });

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