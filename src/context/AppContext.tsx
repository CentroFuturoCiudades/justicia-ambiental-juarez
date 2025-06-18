import React, { createContext, useContext, useState, type ReactElement } from "react";

const AppContext = createContext({});

export const useAppContext = () => useContext( AppContext );

const AppContextProvider = ({ children }: { children: any }) => {
    const [viewState, setViewState] = useState({
        latitude: 0,
        longitude: 0,
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