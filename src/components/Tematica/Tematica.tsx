import { Accordion, Checkbox, Span } from "@chakra-ui/react";
import { SECTIONS, LAYERS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";
import "./Tematica.scss";
import SavedLayerIcon from "/assets/Icono CAPA AGREGADA.png"
import { AiOutlineDown } from "react-icons/ai";
import type { LayerKey } from "../../utils/constants";
import { useMediaQuery } from '@chakra-ui/react';

const Tematica = () => {

    const { 
        selectedLayer, 
        setSelectedLayer, 
        setActiveLayerKey, 
        mapLayers, 
        setSelectionMode 
    } = useAppContext();

    const [isMobile] = useMediaQuery('(max-width: 800px)');

    /* Al seleccionar una capa de Tematica:
        - Se actualiza la capa seleccionada
        - Se establece la clave de la capa activa (agebs/colonias)
        - Se establece el modo de selección
    */
    const handleLayerToggle = (layerKey: LayerKey) => {
        setSelectedLayer(prev => prev === layerKey ? "" : layerKey);
        setActiveLayerKey( layerKey === selectedLayer ? null : "agebs");
        setSelectionMode( layerKey === selectedLayer ? null : "agebs");
    }

    return (
        <div>
            <Accordion.Root collapsible={!isMobile} className="dropdown" variant="enclosed" defaultValue={["tematica"]} multiple={false}>
                <Accordion.Item value="tematica" className="dropdown__mainItem" >

                    <Accordion.ItemTrigger className="trigger" >
                        <Span className="trigger__title">temática</Span>
                        <Accordion.ItemIndicator  className="trigger__indicator">
                            <AiOutlineDown/>
                        </Accordion.ItemIndicator>
                    </Accordion.ItemTrigger>

                    <Accordion.ItemContent className="dropdown__mainContent" >
                        <Accordion.Root collapsible defaultValue={["ambiental"]} multiple={false}>
                            {Object.entries(SECTIONS).map(([sectionKey, section], idx, arr) => (
                                <Accordion.Item value={sectionKey} className="dropdown__subItem" >
                                
                                    <Accordion.ItemTrigger className={`trigger trigger--light`}>
                                        <Span className="trigger__title"> {section.label} </Span>
                                        <Accordion.ItemIndicator  className="trigger__indicator">
                                            <AiOutlineDown/>
                                        </Accordion.ItemIndicator>
                                    </Accordion.ItemTrigger>

                                    <Accordion.ItemContent className="dropdown__subContent" >
                                        {section.layers.map((layerKey) => (
                                            <Checkbox.Root 
                                                cursor={"pointer"} 
                                                variant={"solid"} 
                                                checked={selectedLayer === layerKey}
                                                onCheckedChange={() => handleLayerToggle(layerKey)}
                                                disabled={!LAYERS[layerKey]?.enabled}
                                                className="checkbox"
                                            >
                                                
                                                <Checkbox.HiddenInput />
                                                <Checkbox.Control />
                                                    <Span className="checkbox__content">
                                                    <Checkbox.Label className={`checkbox__label ${selectedLayer === layerKey ? 'checkbox__label--bold' : ''}`} > {LAYERS[layerKey]?.title || layerKey}</Checkbox.Label>
                                                    {mapLayers.some(instance => instance.title === LAYERS[layerKey]?.title) && (
                                                        <span className="checkbox__image_container">
                                                            <img src={SavedLayerIcon} alt="Saved Layer" />
                                                        </span>
                                                    )}
                                                    {/*<span className="checkbox__image_container">
                                                            <img src={SavedLayerIcon} alt="Saved Layer" />
                                                        </span>*/}
                                                </Span>
                                            </Checkbox.Root>
                                        ))}
                                    </Accordion.ItemContent>
                                </Accordion.Item>
                            ))}
                        </Accordion.Root>
                    </Accordion.ItemContent>
                </Accordion.Item>
            </Accordion.Root>
        </div>
    );
};

export default Tematica;