import { Accordion, Box, Checkbox } from "@chakra-ui/react";
import "./CapasBase.scss";
import { CAPAS_BASE, COLORS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";

const CapasBase = () => { 
    const { selectedBaseLayers, setSelectedBaseLayers } = useAppContext();
    
    //seleccion de capas base
    const handleBaseLayerToggle = (layerKey: string) => {
        setSelectedBaseLayers(prev => 
            prev.includes(layerKey) ? prev.filter(key => key !== layerKey) : [...prev, layerKey]
        );
    };
    return (
        <div className="capas-base-container">
            <Accordion.Root collapsible variant={"enclosed"} style={{borderColor: "gray", borderRadius:"0rem", background: COLORS.GLOBAL.backgroundLight}}>
                <Accordion.Item value="main">

                    <Accordion.ItemTrigger className="capas-base-container__main-trigger">
                        <Box>
                            capas complementarias
                        </Box>
                        <Accordion.ItemIndicator className="capas-base-container__main-indicator"/>
                    </Accordion.ItemTrigger>

                    <Accordion.ItemContent className="capas-base-container__itemContent" style={{ background: COLORS.GLOBAL.backgroundLight }}>
                        <Accordion.ItemBody className="capas-base-container__itemBody" >
                            {Object.entries(CAPAS_BASE).map(([key, value]) => (
                                <>
                                <Box className="capas-base-container__checkboxContent" key={key}>
                                    <Checkbox.Root key={key} className="custom-green-checkbox" cursor="pointer" variant={"solid"} colorPalette={"green"} size={"sm"} disabled={!value.enabled}>
                                        <Checkbox.HiddenInput 
                                            checked={selectedBaseLayers.includes(key)}
                                            onChange={() => handleBaseLayerToggle(key)}
                                        />
                                        <Checkbox.Control />
                                        <Checkbox.Label className="capas-base-container__checkboxLabel">{value.title}</Checkbox.Label>
                                    </Checkbox.Root>
                                </Box>
                                </>
                            ))}
                        </Accordion.ItemBody>
                    </Accordion.ItemContent>

                </Accordion.Item>
            </Accordion.Root>
        </div>
    );
}

export default CapasBase;