import { Accordion, AccordionItemBody, Checkbox, Span } from "@chakra-ui/react";
import { SECTIONS, LAYERS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";
import "./Tematica.scss";
import SavedLayerIcon from "/assets/Icono CAPA AGREGADA.png"
import { AiOutlineDown } from "react-icons/ai";
import type { LayerKey } from "../../utils/constants";



const Tematica = () => {

    const { selectedLayer, setSelectedLayer, setActiveLayerKey, mapLayers, setSelectionMode } = useAppContext();    

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
            <Accordion.Root collapsible className="accordion">
                <Accordion.Item value="tematica" className="accordion__item" >

                    <Accordion.ItemTrigger className="dropdown dropdown--tematica">
                        <Span className="dropdown__title">temática</Span>
                        <Accordion.ItemIndicator  className="dropdown__indicator">
                            <AiOutlineDown/>
                        </Accordion.ItemIndicator>
                    </Accordion.ItemTrigger>

                    <Accordion.ItemContent className="accordion__item" >
                        <AccordionItemBody className="accordion__body" >
                            {Object.entries(SECTIONS).map(([sectionKey, section], idx, arr) => (
                            <Accordion.Root collapsible key={sectionKey}>
                                <Accordion.Item value={sectionKey} className="accordion__item">
                            
                                    <Accordion.ItemTrigger className={`dropdown dropdown--light${idx === arr.length - 1 ? " dropdown--last" : ""}`}>
                                        <Span className="dropdown__title"> {section.label} </Span>
                                        <Accordion.ItemIndicator  className="dropdown__indicator">
                                            <AiOutlineDown/>
                                        </Accordion.ItemIndicator>
                                    </Accordion.ItemTrigger>

                                    <Accordion.ItemContent className="accordion__content">
                                        <AccordionItemBody className="accordion__subcontent" >
                                            {section.layers.map((layerKey) => (
                                                <Checkbox.Root 
                                                    cursor={"pointer"} 
                                                    variant={"solid"} 
                                                    checked={selectedLayer === layerKey}
                                                    onCheckedChange={() => handleLayerToggle(layerKey)}
                                                    disabled={!LAYERS[layerKey]?.enabled}
                                                    className="checkbox"
                                                >
                                                    <Span className="checkbox__content">
                                                        <Checkbox.HiddenInput />
                                                        <Checkbox.Control />
                                                        <Checkbox.Label className={`checkbox__label ${selectedLayer === layerKey ? 'checkbox__label--bold' : ''}`} > {LAYERS[layerKey]?.title || layerKey}</Checkbox.Label>
                                                        {mapLayers.some(instance => instance.title === LAYERS[layerKey]?.title) && (
                                                            <span className="checkbox__image_container">
                                                                <img src={SavedLayerIcon} alt="Saved Layer" />
                                                            </span>
                                                        )}
                                                    </Span>
                                                </Checkbox.Root>
                                            ))}
                                        </AccordionItemBody>
                                    </Accordion.ItemContent>
                                </Accordion.Item>
                            </Accordion.Root>
                            ))}
                        </AccordionItemBody>
                    </Accordion.ItemContent>
                </Accordion.Item>
            </Accordion.Root>
        </div>
    );
};

export default Tematica;