import { Accordion, Checkbox, Span } from "@chakra-ui/react";
import "./CapasBase.scss";
import { CAPAS_BASE } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";
import { AiOutlineDown } from "react-icons/ai";

const CapasBase = () => { 
    const { selectedBaseLayers, setSelectedBaseLayers } = useAppContext();
    
    //seleccion de capas base
    /*const handleBaseLayerToggle = (layerKey: string, value: string) => {
        setSelectedBaseLayers(prev => 
            prev.includes(layerKey) ? prev.filter(key => key !== layerKey) : [...prev, layerKey]
        );
    };*/
    const handleBaseLayerToggle = (layerKey: string, url: string) => {
        setSelectedBaseLayers(prev =>
            prev.some(item => item.key === layerKey)
                ? prev.filter(item => item.key !== layerKey)
                : [...prev, { key: layerKey, url }]
        );
    };

    return (
        <div className="capas-base-container">
            <Accordion.Root collapsible variant={"enclosed"} style={{ borderRadius: "0.3dvw"}}>
                <Accordion.Item value="main">

                    <Accordion.ItemTrigger className="dropdown" style={{ height: "3.65vh" }}>
                        <Span className="dropdown__title"> capas complementarias </Span>
                        <Accordion.ItemIndicator className="dropdown__indicator">
                            <AiOutlineDown />
                        </Accordion.ItemIndicator>
                    </Accordion.ItemTrigger>

                    <Accordion.ItemContent className="capas-base-container__itemContent" >
                        <Accordion.ItemBody className="capas-base-container__itemBody" >
                            {Object.entries(CAPAS_BASE).map(([key, value]) => (
                                <>
                                <Checkbox.Root key={key} 
                                    cursor="pointer" 
                                    variant={"solid"} 
                                    checked={selectedBaseLayers.some(item => item.key === key)}
                                    onCheckedChange={() => handleBaseLayerToggle(key, value.url)}
                                    disabled={!value.enabled}
                                    className="checkbox"
                                    style={{ border: "none" }}
                                >
                                    <Span className="checkbox__content" style={{ minHeight: "0"}}>
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                        <Checkbox.Label className={`checkbox__label${selectedBaseLayers.some(item => item.key === key) ? " checkbox__label--bold" : ""}`} style={{ fontStyle: "normal"}}> {value.title} </Checkbox.Label>
                                    </Span>
                                </Checkbox.Root>
                                <div style={{ paddingLeft: '1dvw', display: 'flex', flexDirection: 'column' }}>
                                {value.layers && Object.entries(value.layers).map(([layerKey, layer]: any) => (
                                    <Checkbox.Root key={layerKey} 
                                        cursor="pointer" 
                                        variant={"solid"}
                                        checked={selectedBaseLayers.some(item => item.key === layerKey)}
                                        onCheckedChange={() => handleBaseLayerToggle(layerKey, layer.url)}
                                        disabled={!layer.enabled}
                                        className="checkbox"
                                        style={{ border: "none" }}
                                    >
                                        <Span className="checkbox__content" style={{ minHeight: "0"}}>
                                            <Checkbox.HiddenInput />
                                            <Checkbox.Control />
                                            <Checkbox.Label className={`checkbox__label${selectedBaseLayers.some(item => item.key === layerKey) ? " checkbox__label--bold" : ""}`} style={{ fontStyle: "normal" }}> {layer.title} </Checkbox.Label>
                                        </Span>
                                    </Checkbox.Root>
                                ))}
                                </div>
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