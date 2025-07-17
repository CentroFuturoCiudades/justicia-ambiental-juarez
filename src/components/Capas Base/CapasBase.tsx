import { Accordion, Box, Checkbox } from "@chakra-ui/react";
import "./CapasBase.scss";
import { CAPAS_BASE } from "../../utils/constants";
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
            <Accordion.Root collapsible variant={"enclosed"} style={{border:"none"}}>
                <Accordion.Item value="main">

                    <Accordion.ItemContent className="capas-base-container__itemContent" >
                        <Accordion.ItemBody className="capas-base-container__itemBody" >
                            {Object.entries(CAPAS_BASE).map(([key, value], idx, arr) => (
                                <>
                                <Box key={key} p={2} display="flex" alignItems="center" width={"100%"} >
                                    <Checkbox.Root key={key} className="capas-base-container__checkbox" cursor="pointer" variant={"solid"} colorPalette={"green"}>
                                        <Checkbox.HiddenInput 
                                            checked={selectedBaseLayers.includes(key)}
                                            onChange={() => handleBaseLayerToggle(key)}
                                        />
                                        <Checkbox.Control />
                                        <Checkbox.Label style={{fontSize:"0.8rem"}}>{value.title}</Checkbox.Label>
                                    </Checkbox.Root>
                                </Box>
                                {idx < arr.length -1 && (
                                    <Box
                                        as="hr"
                                        border="none"
                                        borderBottom="1px solid #bdbdbd"
                                        width="90%"
                                        mx="auto"
                                        my={1}
                                    />
                                )}
                                </>
                            ))}
                        </Accordion.ItemBody>
                    </Accordion.ItemContent>

                    <Accordion.ItemTrigger className="capas-base-container__main-trigger">
                        <Box className="capas-base-container__main-title">
                            Capas Base
                        </Box>
                        <Accordion.ItemIndicator className="capas-base-container__main-indicator"/>
                    </Accordion.ItemTrigger>

                </Accordion.Item>
            </Accordion.Root>
        </div>
    );
}

export default CapasBase;