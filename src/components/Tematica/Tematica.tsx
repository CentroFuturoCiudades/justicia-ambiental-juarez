import { Accordion, AccordionItemBody, Checkbox, Span } from "@chakra-ui/react";
import { SECTIONS, LAYERS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";
import "./Tematica.scss";
import SavedLayerIcon from "/assets/Icono CAPA AGREGADA.png"
import { AiOutlineDown } from "react-icons/ai";



const Tematica = () => {

    const { selectedLayer, setSelectedLayer, setActiveLayerKey, mapLayers, setSelectionMode } = useAppContext();    

    const handleLayerToggle = (layerKey: string) => {
        setSelectedLayer(prev => prev === layerKey ? "" : layerKey);
        setActiveLayerKey( layerKey === selectedLayer ? null : "agebs");
        setSelectionMode( layerKey === selectedLayer ? null : "agebs");
    }

    return (
        <div>
            <Accordion.Root collapsible className="accordion">
                <Accordion.Item value="tematica" className="accordion__item" >

                    <Accordion.ItemTrigger className="dropdown">
                        <Span className="dropdown__title">temática</Span>
                        <Accordion.ItemIndicator  className="dropdown__indicator">
                            <AiOutlineDown/>
                        </Accordion.ItemIndicator>
                    </Accordion.ItemTrigger>

                    <Accordion.ItemContent className="accordion__item">
                        <AccordionItemBody className="accordion__body" >
                            {Object.entries(SECTIONS).map(([sectionKey, section]) => (
                            <Accordion.Root collapsible>
                                <Accordion.Item value={sectionKey}>

                                    <Accordion.ItemTrigger className="dropdown dropdown--light">
                                        <Span className="dropdown__title"> {section.label} </Span>
                                        <Accordion.ItemIndicator  className="dropdown__indicator">
                                            <AiOutlineDown/>
                                        </Accordion.ItemIndicator>
                                    </Accordion.ItemTrigger>

                                    <Accordion.ItemContent className="accordion__content">
                                        <AccordionItemBody className="accordion__subcontent" >
                                            {section.layers.map((layerKey, idx) => (
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