import { Accordion, AccordionItemBody, Box, Checkbox, Span } from "@chakra-ui/react";
import { SECTIONS, LAYERS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";
import "./Tematica.scss";

const Tematica = () => {

    //const { selectedLayers, setSelectedLayers } = useAppContext();
    const { selectedLayersMultiple, setSelectedLayersMultiple } = useAppContext();

    //una sola capa seleccionada a la vez
    /*const handleLayerToggle = (layerKey: string) => {
        setSelectedLayers(prev => prev === layerKey ? "" : layerKey);
    }*/

    //varias capas seleccionadas
    const handleMultipleLayerToggle = (layerKey: string) => {
        setSelectedLayersMultiple(prev => 
            prev.includes(layerKey) ? prev.filter(key => key !== layerKey) : [...prev, layerKey]
        );
    };
 
    return (
        <div className="tematica-container">
            <Accordion.Root collapsible variant={"enclosed"} style={{ border:"none"}}>
                <Accordion.Item value="main" style={{ background: "#424242"}}>
                    
                    <Accordion.ItemTrigger className="tematica-container__main-trigger" _expanded={{ bg: "#a1a1a1" }}>
                        <Box className="tematica-container__main-title">
                            Temática
                        </Box>
                        <Accordion.ItemIndicator className="tematica-container__main-indicator" />
                    </Accordion.ItemTrigger>

                    <Accordion.ItemContent style={{padding:"0rem", borderTopLeftRadius:"0rem", borderTopRightRadius:"0rem"}}>
                        <AccordionItemBody style={{padding:"0rem"}} >

                            <Accordion.Root collapsible variant={"enclosed"} style={{borderRadius:"0rem", border:"none"}}>
                                {Object.entries(SECTIONS).map(([sectionKey, section]) => (
                                    <Accordion.Item key={sectionKey} value={sectionKey} style={{background:"#f5f5f5"}}>
                                        <Accordion.ItemTrigger className="tematica-container__section-trigger" _expanded={{ bg: "#363636" }}>
                                           <Span className="tematica-container__section-title">
                                                {section.label}
                                            </Span>
                                            <Accordion.ItemIndicator className="tematica-container__main-indicator"/>
                                        </Accordion.ItemTrigger>

                                        <Accordion.ItemContent style={{padding:"0rem", borderRadius:"0rem"}}>
                                            <AccordionItemBody className="tematica-container__sub-accordion" >
                                            {section.layers.map((layerKey, idx) => (
                                            <>
                                                <Box key={layerKey} p={2} display="flex" alignItems="center" width={"100%"} background={"#f5f5f5"}>
                                                    <Checkbox.Root cursor={"pointer"}>
                                                        <Checkbox.HiddenInput 
                                                            //checked={selectedLayers === layerKey}
                                                            checked={selectedLayersMultiple.includes(layerKey)}
                                                            onChange={() => handleMultipleLayerToggle(layerKey)}
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