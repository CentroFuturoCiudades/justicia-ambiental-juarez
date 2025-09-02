import { Accordion, Checkbox, Input, Span } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import "./BusquedaColonia.scss";
import { COLORS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";
import { FixedSizeList as List } from "react-window";
import { AiOutlineDown } from "react-icons/ai";
//import { VariableSizeList as List } from "react-window";


type ColoniasProps = {
    coloniasData: any;
};

const BusquedaColonia = ({ coloniasData }:  ColoniasProps) => {

    const [colonias, setColonias] = useState<string[]>([]);
    const [coloniaBuscada, setColoniaBuscada] = useState<string>("");
    const { selectedColonias, setSelectedColonias } = useAppContext();



    const handleColoniaToggle = (colonia: string) => {
        console.log("colonia length:", colonia.length);
        setSelectedColonias(prev =>
            prev.includes(colonia) ? prev.filter(key => key !== colonia) : [...prev, colonia]
        );
    };

    useEffect(() => {
        if (coloniasData && coloniasData.features) {
            const nombres = coloniasData.features.map((f: any) => f.properties.name);
            setColonias(nombres);
        }
    }, [coloniasData]);

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

    return (
        <div>
            <Accordion.Root collapsible className="right-accordion">
                <Accordion.Item value="main" className="accordion__item accordion__item--right" >
                    <Accordion.ItemTrigger className="dropdown dropdown--right" >
                        <Span className="dropdown__title"> búsqueda por colonia </Span>
                        <Accordion.ItemIndicator className="dropdown__indicator">
                            <AiOutlineDown />
                        </Accordion.ItemIndicator>
                    </Accordion.ItemTrigger>

                    <Accordion.ItemContent className="accordion__item" >
                        <Accordion.ItemBody className="right-accordion__body" style={{ padding: "0" }} >
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
                                height={155}
                                itemCount={coloniasFiltradas.length}
                                itemSize={window.innerHeight * 0.06}
                                className="accordion__coloniaList"
                            >
                                {({ index, style }: { index: number; style: any }) => {
                                    const colonia = coloniasFiltradas[index];
                                    const last = index === coloniasFiltradas.length - 1;
                                    const isSelected = selectedColonias.includes(colonia);
                                    return (
                                        <Span className="checkbox-container" 
                                            style={{ ...style, backgroundColor: isSelected ? `${COLORS.GLOBAL.backgroundMedium}` : "transparent" }}
                                        >
                                            <Checkbox.Root
                                                cursor="pointer"
                                                variant="solid"
                                                disabled
                                                checked={selectedColonias.includes(colonia)}
                                                key={colonia}
                                                className="checkbox checkbox-colonias"
                                                style={{ borderBottom: last ? "none" : "1px solid var(--background-dark)" }}
                                            >
                                                <Span className="checkbox__content" >
                                                    <Checkbox.HiddenInput
                                                        onChange={() => handleColoniaToggle(colonia)}
                                                    />
                                                    <Checkbox.Control />
                                                    <Checkbox.Label className="checkbox__label" >
                                                        {colonia}
                                                    </Checkbox.Label>
                                                </Span>
                                            </Checkbox.Root>
                                        </Span>
                                    );
                                }}
                            </List>
                        </Accordion.ItemBody>
                    </Accordion.ItemContent>
                </Accordion.Item>
            </Accordion.Root>
        </div>
    );
};

export default BusquedaColonia;