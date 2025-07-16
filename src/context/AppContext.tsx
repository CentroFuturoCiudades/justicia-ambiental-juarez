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
    selectedLayers: string;
    setSelectedLayers: Dispatch<SetStateAction<string>>;
    selectedLayersMultiple: string[];
    setSelectedLayersMultiple: Dispatch<SetStateAction<string[]>>;
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
    const [selectedLayers, setSelectedLayers] = useState("");
    //varias capas
    const [selectedLayersMultiple, setSelectedLayersMultiple] = useState<string[]>([]);

    return (
        <AppContext.Provider value={{
            viewState,
            setViewState,
            selectedLayers,
            setSelectedLayers,
            selectedLayersMultiple,
            setSelectedLayersMultiple,

        }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;