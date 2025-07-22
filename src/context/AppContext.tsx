import { type MapViewState } from "deck.gl";
import React, { createContext, useContext, useState, type Dispatch, type ReactElement, type SetStateAction } from "react";
import type { Feature } from "geojson";

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
}

const AppContext = createContext<AppContextI | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return context;
};


const AppContextProvider = ({ children }: { children: any }) => {
    const [viewState, setViewState] = useState<MapViewState>({
        latitude: 31.6904,
        longitude: -106.4245,
        zoom: 11,
    })
    //una capa a la vez
    const [selectedLayer, setSelectedLayer] = useState("");
    //varias capas
    //const [selectedLayersMultiple, setSelectedLayersMultiple] = useState<string[]>([]);
    const [selectedBaseLayers, setSelectedBaseLayers] = useState<string[]>([]);

    //zoom
    const zoomIn = () => setViewState(prev => ({...prev, zoom: prev.zoom + 1}))
    const zoomOut = () => setViewState(prev => ({...prev, zoom: prev.zoom - 1}))

    const [selectedAGEBS, setSelectedAGEBS] = useState<string[]>([]);

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
            zoomIn,
            zoomOut,
            selectedAGEBS,
            setSelectedAGEBS,

        }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;