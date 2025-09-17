import { Accordion, Checkbox, Input, Span } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import "./BusquedaColonia.scss";
import { useAppContext } from "../../context/AppContext";
import { VariableSizeList as List } from "react-window";
import { AiOutlineDown } from "react-icons/ai";

const BusquedaColonia = () => {

    const { 
        coloniasGeoJson,
        selectedColonias, setSelectedColonias 
    } = useAppContext();
    const [colonias, setColonias] = useState<string[]>([]);
    const [coloniaBuscada, setColoniaBuscada] = useState<string>("");
    const charsPerLine = 29;

    const handleColoniaToggle = (colonia: string) => {
        setSelectedColonias(prev =>
            prev.includes(colonia) ? prev.filter(key => key !== colonia) : [...prev, colonia]
        );
    };

    useEffect(() => {
        if (coloniasGeoJson && coloniasGeoJson.features) {
            const nombres = coloniasGeoJson.features.map((f: any) => f.properties.name);
            setColonias(nombres);
        }
    }, [coloniasGeoJson]);

    const coloniasFiltradas = useMemo(() => {

        const filtradasBusqueda = colonias.filter((nombre: string) =>
            nombre.toLowerCase().includes(coloniaBuscada.toLowerCase())
        );

        const seleccionadas = selectedColonias.filter((nombre: string) =>
            filtradasBusqueda.includes(nombre))
            .sort((a, b) => a.localeCompare(b)
        );

        const noSeleccionadas = filtradasBusqueda.filter((nombre: string) =>
            !seleccionadas.includes(nombre))
            .sort((a, b) => a.localeCompare(b));

        return [...seleccionadas, ...noSeleccionadas];
    }, [colonias, coloniaBuscada, selectedColonias]);

    const getItemSize = (index: number) => {
        const colonia = coloniasFiltradas[index];
        const lines = Math.ceil(colonia.length / charsPerLine);
        const baseHeight = Math.min(window.innerHeight * 0.04, window.innerWidth * 0.02); // height: min(4dvh, 2dvw)
        if (lines === 1) return baseHeight;
        return baseHeight * 1.3;
    }

    return (
        <div>
            <Accordion.Root collapsible variant="enclosed" className="dropdown">
                <Accordion.Item value="busqueda-colonias" className="dropdown__mainItem  dropdown__mainItem--right" >

                    <Accordion.ItemTrigger className="trigger" >
                        <Span className="trigger__title"> búsqueda por colonia </Span>
                        <Accordion.ItemIndicator className="trigger__indicator">
                            <AiOutlineDown />
                        </Accordion.ItemIndicator>
                    </Accordion.ItemTrigger>

                    <Accordion.ItemContent className="dropdown__subContent dropdown__subContent--colonias">
                            {/* buscador de colonias */}
                            <Span className="searchBar" >
                                <Input
                                    placeholder="buscar colonia..."
                                    value={coloniaBuscada}
                                    onChange={(e) => setColoniaBuscada(e.target.value)}
                                    className="searchBar__input"
                                />
                            </Span>

                            {/* colonias filtradas */}
                            <List
                                key={window.innerHeight} // nuevo render con cada resize
                                height={window.innerHeight * 0.23}
                                itemCount={coloniasFiltradas.length}
                                itemSize={getItemSize}
                                className="accordion__coloniaList"
                            >
                                {({ index, style }: { index: number; style: any }) => {
                                    const colonia = coloniasFiltradas[index];
                                    const last = index === coloniasFiltradas.length - 1;
                                    const isSelected = selectedColonias.includes(colonia);
                                    return (
                                        <Span className={`checkbox-container ${isSelected ? "checkbox-container--selected" : ""}`} 
                                            style ={{ ...style }}
                                        >
                                            <Checkbox.Root
                                                cursor="pointer"
                                                variant="solid"
                                                checked={selectedColonias.includes(colonia)}
                                                key={colonia}
                                                className="checkbox checkbox-colonias"
                                                style={{ borderBottom: last ? "none" : "1px solid var(--background-dark)" }}
                                            >
                                                <Checkbox.HiddenInput
                                                    onChange={() => handleColoniaToggle(colonia)}
                                                />
                                                <Checkbox.Control />
                                                <Checkbox.Label className={`checkbox__label ${selectedColonias.includes(colonia) ? " checkbox__label--bold" : ""}`}>
                                                    {colonia}
                                                </Checkbox.Label>
                                            </Checkbox.Root>
                                        </Span>
                                    );
                                }}
                            </List>
                    </Accordion.ItemContent>
                </Accordion.Item>
            </Accordion.Root>
        </div>
    );
};

export default BusquedaColonia;