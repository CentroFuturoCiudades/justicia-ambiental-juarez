import { Accordion, Box, Checkbox, Span} from "@chakra-ui/react";
import "./CapasBase.scss";
import { CAPAS_BASE, COLORS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";

const CapasBase = () => { 
    const { selectedBaseLayers, setSelectedBaseLayers } = useAppContext();
    
    //seleccion de capas base
    const handleBaseLayerToggle = (layerKey: string, value: any) => {
        setSelectedBaseLayers(prev => 
            prev.includes(layerKey) ? prev.filter(key => key !== layerKey) : [...prev, layerKey]
        );
    };
    return (
        <div className="capas-base-container">
            <Accordion.Root collapsible variant={"enclosed"} className="capas-base" style={{ borderRadius: "0.3dvw"}}>
                <Accordion.Item value="main" style={{  borderRadius: "0.5em" }}>

                    <Accordion.ItemTrigger className="capas-base-container__main-trigger">
                        <Span flex={1}> capas complementarias </Span>
                        <Accordion.ItemIndicator className="capas-base-container__main-indicator"/>
                    </Accordion.ItemTrigger>

                    <Accordion.ItemContent className="capas-base-container__itemContent" >
                        <Accordion.ItemBody className="capas-base-container__itemBody" >
                            {Object.entries(CAPAS_BASE).map(([key, value]) => (
                                <Checkbox.Root key={key} 
                                    className="checkbox"
                                    cursor="pointer" 
                                    variant={"solid"} 
                                    colorPalette={"green"} 
                                    size={"sm"} 
                                    disabled={!value.enabled}
                                >
                                    <Span className="checkbox_content">
                                        <Checkbox.HiddenInput 
                                            checked={selectedBaseLayers.includes(key)}
                                            onChange={() => handleBaseLayerToggle(key, value)}
                                        />
                                        <Checkbox.Control />
                                        <Checkbox.Label className="label">{value.title}</Checkbox.Label>
                                    </Span>
                                </Checkbox.Root>
                            ))}
                        </Accordion.ItemBody>
                    </Accordion.ItemContent>

                </Accordion.Item>
            </Accordion.Root>
        </div>
    );
}

export default CapasBase;