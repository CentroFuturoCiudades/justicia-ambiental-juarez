import { type MapViewState } from "deck.gl";
import React, { createContext, useContext, useState, type Dispatch, type ReactElement, type SetStateAction } from "react";
import type { FeatureCollection } from "geojson";
import { MapLayer } from "../classes/MapLayer";
import type { LayerKey } from "../utils/constants";
import { max } from "d3";

type ViewState = {
    latitude: number;
    longitude: number;
    zoom: number;
};

interface AppContextI {
    viewState: ViewState;
    setViewState: Dispatch<SetStateAction<ViewState>>;
    agebsGeoJson: FeatureCollection;
    setAgebsGeoJson: Dispatch<SetStateAction<FeatureCollection>>;
    coloniasGeoJson: FeatureCollection;
    setColoniasGeoJson: Dispatch<SetStateAction<FeatureCollection>>;
    mapLayerInstance: MapLayer | null;
    setMapLayerInstance: Dispatch<SetStateAction<MapLayer | null>>;
    tematicaData: any;
    setTematicaData: Dispatch<SetStateAction<any>>;
    filteredFeatures: any[];
    setFilteredFeatures: Dispatch<SetStateAction<any[]>>;
    dragMap: boolean;
    setDragMap: Dispatch<SetStateAction<boolean>>;
    radius: number;
    setRadius: Dispatch<SetStateAction<number>>;
    flagSlider: boolean;
    setFlagSlider: Dispatch<SetStateAction<boolean>>;
    //
    selectedLayer: LayerKey;
    setSelectedLayer: Dispatch<SetStateAction<LayerKey>>;
    activeLayerKey: string | null;
    setActiveLayerKey: Dispatch<SetStateAction<string | null>>;
    selectionMode: string | null;
    setSelectionMode: Dispatch<SetStateAction<string | null>>;
    selectedBaseLayers: any[];
    setSelectedBaseLayers: Dispatch<SetStateAction<any[]>>;
    zoomIn: () => void;
    zoomOut: () => void;
    selectedAGEBS: string[];
    setSelectedAGEBS: Dispatch<SetStateAction<string[]>>;
    selectedColonias: string[];
    setSelectedColonias: Dispatch<SetStateAction<string[]>>;
    selectedPoint: number | null;
    setSelectedPoint: Dispatch<SetStateAction<number | null>>;
    //
    selectedColonias_SET: Set<string>;
    setSelectedColonias_SET: Dispatch<SetStateAction<Set<string>>>;
    coloniasData: FeatureCollection;
    setColoniasData: Dispatch<SetStateAction<FeatureCollection>>;
    //array de maplayers para el reporte
    mapLayers: any[];
    setMapLayers: Dispatch<SetStateAction<any[]>>;
    layerTooltip: any | null;
    setLayerTooltip: Dispatch<SetStateAction<any | null>>;
    //json data for CAPA (diferentes)
    jsonData: any;
    setJsonData: Dispatch<SetStateAction<any>>;
    layerInfoData: any;
    setLayerInfoData: Dispatch<SetStateAction<Record<string, any>>>;
    selectedEquipamientosFilters: string[];
    setSelectedEquipamientosFilters: Dispatch<SetStateAction<string[]>>;
}

const AppContext = createContext<AppContextI | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return context;
};

export const LONGITUDE_RANGE = [-106.6, -106.3];
export const LATITUDE_RANGE = [31.5, 31.8];
export const ZOOM_RANGE = [9.8, 12];


export const defaultViewState = {
    latitude: 31.66,
    longitude: -106.4245,
    zoom: 10.8,
    maxZoom: 14,
    minZoom: 9,
}


const AppContextProvider = ({ children }: { children: any }) => {
    const [viewState, setViewState] = useState<MapViewState>(defaultViewState)
    //geojsons
    const [agebsGeoJson, setAgebsGeoJson] = useState<FeatureCollection>({ type: "FeatureCollection", features: [] });
    const [coloniasGeoJson, setColoniasGeoJson] = useState<FeatureCollection>({ type: "FeatureCollection", features: [] });
    //mapinstance y data
    const [mapLayerInstance, setMapLayerInstance] = useState<MapLayer | null>(null);
    const [tematicaData, setTematicaData] = useState<any>(null);
    const [filteredFeatures, setFilteredFeatures] = useState<any[]>([]); //features filtradas por el lens
    const [dragMap, setDragMap] = useState<boolean>(false);
    const [radius, setRadius] = useState<number>(2000);
    const [flagSlider, setFlagSlider] = useState<boolean>(false);
    //una capa a la vez
    const [selectedLayer, setSelectedLayer] = useState<LayerKey>("vulnerabilidad_calor");
    const [activeLayerKey, setActiveLayerKey] = useState<string | null>("agebs");
    const [selectionMode, setSelectionMode] = useState<string | null>("agebs");

    //capas base
    const [selectedBaseLayers, setSelectedBaseLayers] = useState<any[]>([]);

    //zoom
    const zoomIn = () => setViewState(prev => ({
        ...prev,
        longitude: Math.min(LONGITUDE_RANGE[1], Math.max(LONGITUDE_RANGE[0], prev.longitude)),
        latitude: Math.min(LATITUDE_RANGE[1], Math.max(LATITUDE_RANGE[0], prev.latitude)),
        zoom: Math.min(prev.zoom + 1, ZOOM_RANGE[1])
    }))
    const zoomOut = () => setViewState(prev => ({
        ...prev,
        longitude: Math.min(LONGITUDE_RANGE[1], Math.max(LONGITUDE_RANGE[0], prev.longitude)),
        latitude: Math.min(LATITUDE_RANGE[1], Math.max(LATITUDE_RANGE[0], prev.latitude)),
        zoom: Math.max(prev.zoom - 1, ZOOM_RANGE[0])
    }))

    const [selectedAGEBS, setSelectedAGEBS] = useState<string[]>([]);
    const [selectedColonias, setSelectedColonias] = useState<string[]>([]);
    const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
    //
    const [selectedColonias_SET, setSelectedColonias_SET] = useState<Set<string>>(new Set());
    const [coloniasData, setColoniasData] = useState<FeatureCollection>({ type: "FeatureCollection", features: [] });
    //maplayer array for pdf
    const [mapLayers, setMapLayers] = useState<any[]>([]);

    const [layerTooltip, setLayerTooltip] = useState<any | null>(null);
    //json data for CAPA (diferentes)
    const [jsonData, setJsonData] = useState<any>(null);
    const [layerInfoData, setLayerInfoData] = useState<Record<string, any>>({});
    const [selectedEquipamientosFilters, setSelectedEquipamientosFilters] = useState<string[]>(['educacion', 'salud', 'recreacion', 'parques']);


    return (
        <AppContext.Provider value={{
            viewState,
            setViewState,
            agebsGeoJson,
            setAgebsGeoJson,
            coloniasGeoJson,
            setColoniasGeoJson,
            mapLayerInstance,
            setMapLayerInstance,
            tematicaData,
            setTematicaData,
            filteredFeatures,
            setFilteredFeatures,
            dragMap,
            setDragMap,
            radius,
            setRadius,
            flagSlider,
            setFlagSlider,
            //
            selectedLayer,
            setSelectedLayer,
            activeLayerKey,
            setActiveLayerKey,
            selectionMode,
            setSelectionMode,
            selectedBaseLayers,
            setSelectedBaseLayers,
            zoomIn,
            zoomOut,
            selectedAGEBS,
            setSelectedAGEBS,
            selectedColonias,
            setSelectedColonias,
            selectedPoint,
            setSelectedPoint,
            selectedColonias_SET,
            setSelectedColonias_SET,
            coloniasData,
            setColoniasData,
            //
            mapLayers,
            setMapLayers,
            layerTooltip,
            setLayerTooltip,
            //json data for CAPA (diferentes)
            jsonData,
            setJsonData,
            layerInfoData,
            setLayerInfoData,
            selectedEquipamientosFilters,
            setSelectedEquipamientosFilters,
        }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;