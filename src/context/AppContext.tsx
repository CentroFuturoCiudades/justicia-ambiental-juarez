import { type MapViewState } from "deck.gl";
import React, { createContext, useContext, useState, type Dispatch, type ReactElement, type SetStateAction } from "react";
import type { FeatureCollection } from "geojson";

type ViewState = {
    latitude: number;
    longitude: number;
    zoom: number;
};

interface AppContextI {
    viewState: ViewState;
    setViewState: Dispatch<SetStateAction<ViewState>>;
    selectedLayer: string;
    setSelectedLayer: Dispatch<SetStateAction<string>>;
    //selectedLayersMultiple: string[];
    //setSelectedLayersMultiple: Dispatch<SetStateAction<string[]>>;
    selectedBaseLayers: string[];
    setSelectedBaseLayers: Dispatch<SetStateAction<string[]>>;
    zoomIn: () => void;
    zoomOut: () => void;
    selectedAGEBS: string[];
    setSelectedAGEBS: Dispatch<SetStateAction<string[]>>;
    selectedColonias: string[];
    setSelectedColonias: Dispatch<SetStateAction<string[]>>;
    selectedColonias_SET: Set<string>;
    setSelectedColonias_SET: Dispatch<SetStateAction<Set<string>>>;
    coloniasData: FeatureCollection;
    setColoniasData: Dispatch<SetStateAction<FeatureCollection>>;
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
    //una capa a la vez
    const [selectedLayer, setSelectedLayer] = useState("");
    //varias capas
    //const [selectedLayersMultiple, setSelectedLayersMultiple] = useState<string[]>([]);
    const [selectedBaseLayers, setSelectedBaseLayers] = useState<string[]>([]);

    //zoom
    const zoomIn = () => setViewState(prev => ({...prev, zoom: prev.zoom + 1}))
    const zoomOut = () => setViewState(prev => ({...prev, zoom: prev.zoom - 1}))

    const [selectedAGEBS, setSelectedAGEBS] = useState<string[]>([]);
    const [selectedColonias, setSelectedColonias] = useState<string[]>([]);
    const [selectedColonias_SET, setSelectedColonias_SET] = useState<Set<string>>(new Set());
    const [coloniasData, setColoniasData] = useState<FeatureCollection>({ type: "FeatureCollection", features: [] });

    return (
        <AppContext.Provider value={{
            viewState,
            setViewState,
            selectedLayer, 
            setSelectedLayer, 
            //selectedLayersMultiple,
            //setSelectedLayersMultiple,
            selectedBaseLayers,
            setSelectedBaseLayers,
            selectedColonias,
            setSelectedColonias,
            zoomIn,
            zoomOut,
            selectedAGEBS,
            setSelectedAGEBS,
            selectedColonias_SET,
            setSelectedColonias_SET,
            coloniasData,
            setColoniasData

        }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;