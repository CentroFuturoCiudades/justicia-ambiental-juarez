import { Accordion, Checkbox, Span } from "@chakra-ui/react";
import "./CapasComplementerias.scss";
import { CAPAS_BASE } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";
import { AiOutlineDown } from "react-icons/ai";

const CapasComplementarias = () => { 
    const { selectedBaseLayers, setSelectedBaseLayers } = useAppContext();
    
    /*
        Seleccion y deseleccion de CAPAS COMPLEMENTARIAS
        - Array de objetos {key, url}
        - Si ya hay un key igual a layerKey, se elimina del array
        - Si no, se agrega key y url
    */
    const handleBaseLayerToggle = (layerKey: string, url: string) => {
        setSelectedBaseLayers(prev =>
            prev.some(item => item.key === layerKey)
                ? prev.filter(item => item.key !== layerKey)
                : [...prev, { key: layerKey, url }]
        );
    };

    return (
        <div>
            <Accordion.Root collapsible variant="enclosed" className="dropdown" >
                <Accordion.Item value="base" className="dropdown__mainItem  dropdown__mainItem--right" >

                    <Accordion.ItemTrigger className="trigger" >
                        <Span className="trigger__title"> capas complementarias </Span>
                        <Accordion.ItemIndicator className="trigger__indicator">
                            <AiOutlineDown />
                        </Accordion.ItemIndicator>
                    </Accordion.ItemTrigger>

                    <Accordion.ItemContent className="dropdown__subContent dropdown__subContent--complementarias" >
                        {Object.entries(CAPAS_BASE).map(([key, value]) => (
                            <>
                            <Checkbox.Root key={key} 
                                cursor="pointer" 
                                variant={"solid"} 
                                checked={selectedBaseLayers.some(item => item.key === key)}
                                onCheckedChange={() => handleBaseLayerToggle(key, value.url)}
                                disabled={!value.enabled}
                                className="checkbox checkbox--right"
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                                <Checkbox.Label className={`checkbox__label${selectedBaseLayers.some(item => item.key === key) ? " checkbox__label--bold" : ""}`} > {value.title} </Checkbox.Label>
                            </Checkbox.Root>
                            <div className="sub-checkbox">
                            {value.layers && Object.entries(value.layers).map(([layerKey, layer]: any) => (
                                <Checkbox.Root key={layerKey} 
                                    cursor="pointer" 
                                    variant={"solid"}
                                    checked={selectedBaseLayers.some(item => item.key === layerKey)}
                                    onCheckedChange={() => handleBaseLayerToggle(layerKey, layer.url)}
                                    disabled={!layer.enabled}
                                    className="checkbox checkbox--right"
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label className={`checkbox__label${selectedBaseLayers.some(item => item.key === layerKey) ? " checkbox__label--bold" : ""}`}> {layer.title} </Checkbox.Label>
                                </Checkbox.Root>
                            ))}
                            </div>
                            </>
                        ))}
                    </Accordion.ItemContent>

                </Accordion.Item>
            </Accordion.Root>
        </div>
    );
}

export default CapasComplementarias;