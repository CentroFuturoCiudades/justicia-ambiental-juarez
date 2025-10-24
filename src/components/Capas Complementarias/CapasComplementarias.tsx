import { Accordion, Checkbox, Span } from "@chakra-ui/react";
import "./CapasComplementarias.scss";
import {  CAPAS_BASE_CODEBOOK } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";
import { AiOutlineDown } from "react-icons/ai";
import { useMediaQuery } from '@chakra-ui/react';
import { useEffect } from "react";


const CapasComplementarias = () => { 
    const { 
        selectedBaseLayers, setSelectedBaseLayers, 
        selectedEquipamientosFilters, setSelectedEquipamientosFilters 
    } = useAppContext();
    const mainLayers = Object.entries(CAPAS_BASE_CODEBOOK).filter(([_, value]) => !value.parent);
    const [isMobile] = useMediaQuery('(max-width: 800px)');

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
        if(!selectedBaseLayers.includes(layerKey)) {
            setSelectedEquipamientosFilters(['educacion', 'salud', 'recreacion', 'parques']);
        }
    };

    const handleChildren = (childKey: string) => {
        setSelectedEquipamientosFilters(prev => {
            if (prev.includes(childKey)) {
                return prev.filter(item => item !== childKey);
            } else {
                return [...prev, childKey];
            }
        });
    };

    return (
        <div>
            <Accordion.Root
                collapsible={!isMobile}
                //{...(isMobile ? { defaultValue: ["base"] } : {})}
                defaultValue={isMobile ? ["base"] : undefined}
                variant="enclosed"
                className="dropdown"
            >
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
                            {value.children && Object.entries(value.children).map(([childKey, title]) => {
                                        //const subLayer = CAPAS_BASE_CODEBOOK[childKey];
                                        return (
                                            <Checkbox.Root
                                                key={childKey}
                                                cursor="pointer"
                                                variant={"solid"}
                                                checked={selectedEquipamientosFilters.includes(childKey) && selectedBaseLayers.includes(layerKey)}
                                                onCheckedChange={() => handleChildren(childKey)}
                                                disabled={!selectedBaseLayers.includes(layerKey)}
                                                className="checkbox checkbox--right"
                                            >
                                                <Checkbox.HiddenInput />
                                                <Checkbox.Control />
                                                <Checkbox.Label className={`checkbox__label${selectedBaseLayers.some(item => item.key === childKey) ? " checkbox__label--bold" : ""}`}> {title} </Checkbox.Label>
                                            </Checkbox.Root>
                                        );
                                    })}
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