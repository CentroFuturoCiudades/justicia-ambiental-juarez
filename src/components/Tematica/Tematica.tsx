import { Accordion, AccordionItemBody, Box, Checkbox, Span } from "@chakra-ui/react";
import { SECTIONS, LAYERS, COLORS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";
import "./Tematica.scss";
import SavedLayerIcon from "/assets/Icono CAPA AGREGADA.png"


const Tematica = () => {

    const { selectedLayer, setSelectedLayer, setActiveLayerKey, mapLayers, setSelectionMode } = useAppContext();    

    const handleLayerToggle = (layerKey: string) => {
        setSelectedLayer(prev => prev === layerKey ? "" : layerKey);
        setActiveLayerKey( layerKey === selectedLayer ? null : "agebs");
        setSelectionMode( layerKey === selectedLayer ? null : "agebs");
    }

    return (
        <div className="tematica-container" >
            <Accordion.Root collapsible className="tematica">
                <Accordion.Item value="tematica" className="tematica__content" >
                    <Accordion.ItemTrigger className="tematica__accordion_tematica" style={{ backgroundColor: COLORS.GLOBAL.backgroundDark}}>
                        <Span flex="1">temática</Span>
                        <Accordion.ItemIndicator  className="tematica__indicator"/>
                    </Accordion.ItemTrigger>

                    <Accordion.ItemContent className="tematica__content">
                        <AccordionItemBody className="tematica__body_content" >
                            {Object.entries(SECTIONS).map(([sectionKey, section]) => (
                            <Accordion.Root collapsible>
                                <Accordion.Item value="hospitales">
                                    <Accordion.ItemTrigger className="tematica__sub_accordion" style={{ background: COLORS.GLOBAL.backgroundMedium }}>
                                        <Span flex="1" >{section.label}</Span>
                                        <Accordion.ItemIndicator className="indicator2"/>
                                    </Accordion.ItemTrigger>
                                    <Accordion.ItemContent style={{borderRadius: 0}}>
                                        <AccordionItemBody className="tematica__subcontent" >
                                            {section.layers.map((layerKey, idx) => (
                                                <Checkbox.Root 
                                                    cursor={"pointer"} 
                                                    variant={"solid"} 
                                                    checked={selectedLayer === layerKey}
                                                    onCheckedChange={() => handleLayerToggle(layerKey)}
                                                    disabled={!LAYERS[layerKey]?.enabled}
                                                    className="tematica__checkbox"
                                                >
                                                    <Span className="tematica__checkbox_content">
                                                        <Checkbox.HiddenInput />
                                                        <Checkbox.Control />
                                                        <Checkbox.Label className="tematica__label" style={{ fontWeight: selectedLayer === layerKey ? 'bold' : 'normal' }}> {LAYERS[layerKey]?.title || layerKey}</Checkbox.Label>
                                                        {mapLayers.some(instance => instance.title === LAYERS[layerKey]?.title) && (
                                                            <span className="tematica__image_container">
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