import {createContext, useContext, useState, type Dispatch, type SetStateAction} from 'react';

interface ColoniasContextI {
    selectedColonias: string[];
    setSelectedColonias: Dispatch<SetStateAction<string[]>>;
}

const ColoniasContext= createContext<ColoniasContextI | undefined>(undefined);

export const useColoniasContext = () => {
    const context = useContext(ColoniasContext);
    if (!context) {
        throw new Error("useColoniasContext must be used within a ColoniasContextProvider");
    }
    return context;
}

export const ColoniasContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedColonias, setSelectedColonias] = useState<string[]>([]);

    return (
        <ColoniasContext.Provider value={{ selectedColonias, setSelectedColonias }}>
            {children}
        </ColoniasContext.Provider>
    );
}

export default ColoniasContextProvider;