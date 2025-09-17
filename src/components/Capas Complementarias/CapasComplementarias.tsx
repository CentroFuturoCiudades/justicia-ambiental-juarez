import { Accordion, Checkbox, Span } from "@chakra-ui/react";
import "./CapasComplementarias.scss";
import { COMPLEMENTARY_LAYERS, CAPAS_BASE_CODEBOOK } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";
import { AiOutlineDown } from "react-icons/ai";

const CapasComplementarias = () => { 
    const { selectedBaseLayers, setSelectedBaseLayers } = useAppContext();
    const mainLayers = Object.entries(CAPAS_BASE_CODEBOOK).filter(([_, value]) => !value.parent);
    const subLayers = Object.entries(CAPAS_BASE_CODEBOOK).filter(([_, value]) => value.parent);

    /*
        Seleccion y deseleccion de CAPAS COMPLEMENTARIAS
        - Array de keys de capas complementarias
        - Si ya hay un key igual a layerKey, se elimina del array
        - Si no, se agrega key
    */

    const handleComplementaryLayerToggle = (layerKey: string) => {
        setSelectedBaseLayers(prev =>
            prev.includes(layerKey)
                ? prev.filter(item => item !== layerKey)
                : [...prev, layerKey]
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
                        {mainLayers.map(([layerKey, value]) => (
                            <>
                            <Checkbox.Root key={layerKey} 
                                cursor="pointer" 
                                variant={"solid"} 
                                checked={selectedBaseLayers.includes(layerKey)}
                                onCheckedChange={() => handleComplementaryLayerToggle(layerKey)}
                                disabled={!value.enabled}
                                className="checkbox checkbox--right"
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                                <Checkbox.Label className={`checkbox__label${selectedBaseLayers.some(item => item.key === layerKey) ? " checkbox__label--bold" : ""}`} > {value.title} </Checkbox.Label>
                            </Checkbox.Root>
                            <div className="sub-checkbox">
                            {subLayers
                             .filter(([_, subLayer]) => subLayer.parent === layerKey)
                             .map(([subKey, subLayer]) => (
                                <Checkbox.Root key={subKey} 
                                    cursor="pointer" 
                                    variant={"solid"}
                                    checked={selectedBaseLayers.includes(subKey)}
                                    onCheckedChange={() => handleComplementaryLayerToggle(subKey)}
                                    disabled={!subLayer.enabled}
                                    className="checkbox checkbox--right"
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label className={`checkbox__label${selectedBaseLayers.some(item => item.key === subKey) ? " checkbox__label--bold" : ""}`}> {subLayer.title} </Checkbox.Label>
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