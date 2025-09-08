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
            <Accordion.Root collapsible className="right-accordion">
                <Accordion.Item value="base" className="accordion__item  accordion__item--right" >

                    <Accordion.ItemTrigger className="dropdown dropdown--right" >
                        <Span className="dropdown__title"> capas complementarias </Span>
                        <Accordion.ItemIndicator className="dropdown__indicator">
                            <AiOutlineDown />
                        </Accordion.ItemIndicator>
                    </Accordion.ItemTrigger>

                    <Accordion.ItemContent className="accordion__item" >
                        <Accordion.ItemBody className="right-accordion__body" >
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
                                    <Span className="checkbox__content ">
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                        <Checkbox.Label className={`checkbox__label${selectedBaseLayers.some(item => item.key === key) ? " checkbox__label--bold" : ""}`} > {value.title} </Checkbox.Label>
                                    </Span>
                                </Checkbox.Root>
                                <div style={{ paddingLeft: '1.3dvw', display: 'flex', flexDirection: 'column' }}>
                                {value.layers && Object.entries(value.layers).map(([layerKey, layer]: any) => (
                                    <Checkbox.Root key={layerKey} 
                                        cursor="pointer" 
                                        variant={"solid"}
                                        checked={selectedBaseLayers.some(item => item.key === layerKey)}
                                        onCheckedChange={() => handleBaseLayerToggle(layerKey, layer.url)}
                                        disabled={!layer.enabled}
                                        className="checkbox checkbox--right"
                                    >
                                        <Span className="checkbox__content" >
                                            <Checkbox.HiddenInput />
                                            <Checkbox.Control />
                                            <Checkbox.Label className={`checkbox__label${selectedBaseLayers.some(item => item.key === layerKey) ? " checkbox__label--bold" : ""}`}> {layer.title} </Checkbox.Label>
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

export default CapasComplementarias;