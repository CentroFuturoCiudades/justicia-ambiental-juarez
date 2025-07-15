import { Accordion, AccordionItemBody, Box, Checkbox, Span } from "@chakra-ui/react";
import { SECTIONS, LAYERS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";
import "./Tematica.scss";

const Tematica = () => {

    const { selectedLayers, setSelectedLayers } = useAppContext();

    const handleLayerToggle = (layerKey: string) => {
        setSelectedLayers(prev => prev === layerKey ? "" : layerKey);
    }
 
    return (
        <div className="tematica-container">
            <Accordion.Root collapsible variant={"enclosed"} style={{ border:"none"}}>
                <Accordion.Item value="main" style={{ background: "#424242", border: "none" }}>
                    
                    <Accordion.ItemTrigger className="tematica-container__main-trigger" _expanded={{ bg: "#a1a1a1" }}>
                        <Box className="tematica-container__main-title">
                            Temática
                        </Box>
                        <Accordion.ItemIndicator className="tematica-container__main-indicator" />
                    </Accordion.ItemTrigger>

                    <Accordion.ItemContent>

                        <AccordionItemBody className="tematica-container__sub-accordion" >

                            <Accordion.Root collapsible variant={"enclosed"} border={"none"}>
                                {Object.entries(SECTIONS).map(([sectionKey, section]) => (
                                    <Accordion.Item key={sectionKey} value={sectionKey}>
                                        <Accordion.ItemTrigger className="tematica-container__section-trigger" _expanded={{ bg: "#363636" }}>
                                           <Span className="tematica-container__section-title">
                                                {section.label}
                                            </Span>
                                            <Accordion.ItemIndicator className="tematica-container__main-indicator"/>
                                        </Accordion.ItemTrigger>

                                        <Accordion.ItemContent>
                                            <AccordionItemBody className="tematica-container__sub-accordion" >
                                            {section.layers.map((layerKey, idx) => (
                                            <>
                                                <Box key={layerKey} p={2} display="flex" alignItems="center" cursor="pointer" width={"100%"} background={"#f5f5f5"}>
                                                    <Checkbox.Root>
                                                        <Checkbox.HiddenInput 
                                                            checked={selectedLayers === layerKey}
                                                            onChange={() => handleLayerToggle(layerKey)}
                                                        />
                                                        <Checkbox.Control />
                                                        <Checkbox.Label style={{fontSize:"0.8rem"}}> {LAYERS[layerKey]?.title || layerKey}</Checkbox.Label>
                                                    </Checkbox.Root>                                               
                                                </Box>
                                                {idx < section.layers.length - 1 && (
                                                    <Box
                                                        as="hr"
                                                        border="none"
                                                        borderBottom="1px solid #bdbdbd"
                                                        width="90%" // Ajusta el ancho para que no vaya de edge a edge
                                                        mx="auto"
                                                        my={0}
                                                    />
                                                )}
                                            </>
                                            ))}
                                            </AccordionItemBody>
                                            
                                        </Accordion.ItemContent>
                                    </Accordion.Item>
                                ))}
                            </Accordion.Root>

                        </AccordionItemBody>
                    </Accordion.ItemContent>
                </Accordion.Item>
            </Accordion.Root>
        </div>
    );
};

export default Tematica;