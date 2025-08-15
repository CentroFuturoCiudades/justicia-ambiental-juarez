import { Accordion, Box, Checkbox, Input } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import "./BusquedaColonia.scss";
import { COLORS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";
import { FixedSizeList as List } from "react-window";


const BusquedaColonia = () => {
    const REACT_APP_SAS_TOKEN = import.meta.env.VITE_AZURE_SAS_TOKEN;
    const endpoint = 'https://justiciaambientalstore.blob.core.windows.net/data/colonias.geojson';
    const url = `${endpoint}?${REACT_APP_SAS_TOKEN}`;
    const [colonias, setColonias] = useState<string[]>([]);
    const [coloniaBuscada, setColoniaBuscada] = useState<string>("");
    const { selectedColonias, setSelectedColonias, setColoniasData } = useAppContext();

    const handleColoniaToggle = (colonia: string) => {
        setSelectedColonias(prev =>
            prev.includes(colonia) ? prev.filter(key => key !== colonia) : [...prev, colonia]
        );
    };

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (!data || !data.features) { 
                    console.error("Invalid colonias data");
                    return;
                }
                const nombres = data.features.map((f: any) => f.properties.NOMBRE);
                setColonias(nombres);
                setColoniasData(data);
            })
            .catch(err => console.error("Error fetching colonias:", err));
    }, [url]);

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

    const seleccionadasCount = selectedColonias.filter((nombre: string) =>
        coloniasFiltradas.includes(nombre)
    ).length;


    return (
        <div className="busqueda-colonia-container">

            <Accordion.Root collapsible variant={"enclosed"} style={{ borderColor: "gray", borderRadius: "0rem", background: COLORS.GLOBAL.backgroundLight }}>
                <Accordion.Item value="main">
                    <Accordion.ItemTrigger className="busqueda-colonia-container__main-trigger">
                        <Box>
                            búsqueda por colonia
                        </Box>
                        <Accordion.ItemIndicator className="busqueda-colonia-container__main-indicator" />
                    </Accordion.ItemTrigger>

                    <Accordion.ItemContent className="busqueda-colonia-container__itemContent" style={{ background: COLORS.GLOBAL.backgroundLight }}>
                        {/* buscador de colonias */}
                        <Box  background={"#f5f5f5"}>
                            <Input 
                                placeholder="Buscar colonia..."
                                value={coloniaBuscada}
                                onChange={(e) => setColoniaBuscada(e.target.value)}
                                className="busqueda-colonia-container__input"
                                size={"sm"}
                                border= {`1px solid ${COLORS.GLOBAL.backgroundMedium}`}
                            />
                        </Box>
                        <Accordion.ItemBody
                            className="busqueda-colonia-container__itemBody"
                            style={{
                                overflowY: "auto",
                                padding: "0rem"
                            }}
                        >
                            {/* colonias filtradas */}
                            <List
                                height={155}
                                itemCount={coloniasFiltradas.length}
                                itemSize={35}
                            >
                                {({ index, style }: { index: number; style: any }) => {
                                    const colonia = coloniasFiltradas[index];
                                    const last = index === coloniasFiltradas.length - 1;
                                    //const isLastSeleccionada = index <= seleccionadasCount - 1;
                                    const isSelected = selectedColonias.includes(colonia);
                                    const isLastSeleccionada = selectedColonias.includes(colonia) && index === seleccionadasCount - 1;
                                    return (
                                        <Box
                                            key={colonia}
                                            style={style}
                                            className="busqueda-colonia-container__coloniaList"
                                            backgroundColor={isSelected ? COLORS.GLOBAL.backgroundMedium : COLORS.GLOBAL.backgroundLight}
                                            //backgroundColor= {isLastSeleccionada ? COLORS.GLOBAL.backgroundMedium : COLORS.GLOBAL.backgroundLight}
                                            borderBottom={ isLastSeleccionada ? `3px solid ${COLORS.GLOBAL.backgroundMedium}` : "none"}
                                        >
                                            <Box className="busqueda-colonia-container__checkbox" borderBottom={ (last || isLastSeleccionada) ? "none" : "1px solid #ccc"} >
                                                <Checkbox.Root
                                                    className="custom-green-checkbox"
                                                    cursor="pointer"
                                                    variant="solid"
                                                    size="sm"
                                                    disabled
                                                    checked={selectedColonias.includes(colonia)}
                                                >
                                                    <Checkbox.HiddenInput
                                                        onChange={() => handleColoniaToggle(colonia)}
                                                    />
                                                    <Checkbox.Control />
                                                    <Checkbox.Label className="busqueda-colonia-container__checkboxLabel">
                                                        {colonia}
                                                    </Checkbox.Label>
                                                </Checkbox.Root>
                                            </Box>
                                        </Box>
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