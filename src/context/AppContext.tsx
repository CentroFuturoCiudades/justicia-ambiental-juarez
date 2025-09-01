import { type MapViewState } from "deck.gl";
import React, { createContext, useContext, useState, type Dispatch, type ReactElement, type SetStateAction } from "react";
import type { FeatureCollection } from "geojson";
import { MapLayer } from "../classes/MapLayer";

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
    //
    selectedLayer: string;
    setSelectedLayer: Dispatch<SetStateAction<string>>;
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
    //
    selectedColonias_SET: Set<string>;
    setSelectedColonias_SET: Dispatch<SetStateAction<Set<string>>>;
    coloniasData: FeatureCollection;
    setColoniasData: Dispatch<SetStateAction<FeatureCollection>>;
    //array de maplayers para el reporte
    mapLayers: any[];
    setMapLayers: Dispatch<SetStateAction<any[]>>;
}

const AppContext = createContext<AppContextI | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return context;
};

export const defaultViewState = {
    latitude: 31.66,
    longitude: -106.4245,
    zoom: 10.8,
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
    //una capa a la vez
    const [selectedLayer, setSelectedLayer] = useState("");
    const [activeLayerKey, setActiveLayerKey] = useState<string | null>(null);
    const [selectionMode, setSelectionMode] = useState<string | null>(null);

    //capas base
    const [selectedBaseLayers, setSelectedBaseLayers] = useState<any[]>([]);

    //zoom
    const zoomIn = () => setViewState(prev => ({...prev, zoom: prev.zoom + 1}))
    const zoomOut = () => setViewState(prev => ({...prev, zoom: prev.zoom - 1}))

    const [selectedAGEBS, setSelectedAGEBS] = useState<string[]>([]);
    const [selectedColonias, setSelectedColonias] = useState<string[]>([]);
    //
    const [selectedColonias_SET, setSelectedColonias_SET] = useState<Set<string>>(new Set());
    const [coloniasData, setColoniasData] = useState<FeatureCollection>({ type: "FeatureCollection", features: [] });
    //maplayer array for pdf
    const [mapLayers, setMapLayers] = useState<any[]>([]);

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
            selectedColonias_SET,
            setSelectedColonias_SET,
            coloniasData,
            setColoniasData,
            //
            mapLayers,
            setMapLayers

        }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;