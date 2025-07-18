import { type MapViewState } from "deck.gl";
import React, { createContext, useContext, useState, type Dispatch, type ReactElement, type SetStateAction } from "react";

type ViewState = {
    latitude: number;
    longitude: number;
    zoom: number;
};

interface AppContextI {
    viewState: ViewState;
    setViewState: Dispatch<SetStateAction<ViewState>>;
    selectedLayers: string; // borrar si no se necesita
    setSelectedLayers: Dispatch<SetStateAction<string>>;    // borrar si no se necesita
    selectedLayersMultiple: string[];
    setSelectedLayersMultiple: Dispatch<SetStateAction<string[]>>;
    selectedBaseLayers: string[];
    setSelectedBaseLayers: Dispatch<SetStateAction<string[]>>;
    zoomIn: () => void;
    zoomOut: () => void;
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
    //una capa a la vez (BORRAR SI NO SE NECESITA)
    const [selectedLayers, setSelectedLayers] = useState("");
    //varias capas
    const [selectedLayersMultiple, setSelectedLayersMultiple] = useState<string[]>([]);
    const [selectedBaseLayers, setSelectedBaseLayers] = useState<string[]>([]);

    //zoom
    const zoomIn = () => setViewState(prev => ({...prev, zoom: prev.zoom + 1}))
    const zoomOut = () => setViewState(prev => ({...prev, zoom: prev.zoom - 1}))

    return (
        <AppContext.Provider value={{
            viewState,
            setViewState,
            selectedLayers, // borrar si no se necesita
            setSelectedLayers, // borrar si no se necesita
            selectedLayersMultiple,
            setSelectedLayersMultiple,
            selectedBaseLayers,
            setSelectedBaseLayers,
            zoomIn,
            zoomOut,

        }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;