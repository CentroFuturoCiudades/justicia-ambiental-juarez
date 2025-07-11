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

    return (
        <AppContext.Provider value={{
            viewState,
            setViewState
        }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;