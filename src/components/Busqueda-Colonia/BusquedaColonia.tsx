import { Accordion, Box, Checkbox } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "./BusquedaColonia.scss";
import { COLORS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";


const BusquedaColonia = () => {
    const REACT_APP_SAS_TOKEN = import.meta.env.VITE_AZURE_SAS_TOKEN;
    const endpoint = 'https://justiciaambientalstore.blob.core.windows.net/data/colonias.geojson';
    const url = `${endpoint}?${REACT_APP_SAS_TOKEN}`;

    const [colonias, setColonias] = useState<string[]>([]);
    const { selectedColonias, setSelectedColonias } = useAppContext();

    const handleColoniaToggle = (colonia: string) => {
        setSelectedColonias(prev =>
            prev.includes(colonia) ? prev.filter(key => key !== colonia) : [...prev, colonia]
        );
    };

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log("Colonias data:", data);
                if (!data || !data.features) { 
                    console.error("Invalid colonias data");
                    return;
                }
                const nombres = data.features.map((f: any) => f.properties.NOMBRE);
                setColonias(nombres.sort());
            })
            .catch(err => console.error("Error fetching colonias:", err));
    }, [url]);

    return (
        <div className="busqueda-colonia-container">
            <Accordion.Root collapsible variant={"enclosed"} style={{ border: "none", borderRadius: "0rem", background: COLORS.GLOBAL.backgroundMedium }}>
                <Accordion.Item value="main">
                    <Accordion.ItemTrigger className="busqueda-colonia-container__main-trigger">
                        <Box className="busqueda-colonia-container__main-title">
                            Búsqueda por Colonia
                        </Box>
                        <Accordion.ItemIndicator className="busqueda-colonia-container__main-indicator" />
                    </Accordion.ItemTrigger>

                    <Accordion.ItemContent className="busqueda-colonia-container__itemContent" style={{ background: COLORS.GLOBAL.backgroundMedium }}>
                        <Accordion.ItemBody
                            className="busqueda-colonia-container__itemBody"
                            style={{
                                maxHeight: "9rem",
                                overflowY: "auto",
                                paddingRight: "0.5rem"
                            }}
                        >
                            {colonias.slice(0, 5).map((colonia) => (
                                <Box key={colonia} display="flex" alignItems="center" width={"100%"} p={0}>
                                    <Checkbox.Root
                                        className="busqueda-colonia-container__checkbox"
                                        cursor="pointer"
                                        variant={"solid"}
                                        colorPalette={"green"}
                                        size={"sm"}
                                    >
                                        <Checkbox.HiddenInput
                                            checked={selectedColonias.includes(colonia)}
                                            onChange={() => handleColoniaToggle(colonia)}
                                        />
                                        <Checkbox.Control />
                                        <Checkbox.Label style={{ fontSize: "0.7rem" }}>{colonia}</Checkbox.Label>
                                    </Checkbox.Root>
                                </Box>
                            ))}
                        </Accordion.ItemBody>
                    </Accordion.ItemContent>
                </Accordion.Item>
            </Accordion.Root>
        </div>
    );
};

export default BusquedaColonia;