import { Accordion, AccordionItemBody, Box, Checkbox, Span } from "@chakra-ui/react";
import { SECTIONS, LAYERS, COLORS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";
import "./Tematica.scss";

const Tematica = () => {

    const { selectedLayer, setSelectedLayer } = useAppContext();
    //const { selectedLayersMultiple, setSelectedLayersMultiple } = useAppContext();

    //una sola capa seleccionada a la vez
    const handleLayerToggle = (layerKey: string) => {
        setSelectedLayer(prev => prev === layerKey ? "" : layerKey);
    }

    //varias capas seleccionadas
    /*const handleMultipleLayerToggle = (layerKey: string) => {
        setSelectedLayersMultiple(prev => 
            prev.includes(layerKey) ? prev.filter(key => key !== layerKey) : [...prev, layerKey]
        );
    };*/
 
    return (
        <div className="tematica-container">
            <Accordion.Root collapsible variant={"enclosed"} style={{ borderColor:"gray"}}>
                <Accordion.Item value="main" style={{ background: "#c6c6c6"}}>
                    
                    <Accordion.ItemTrigger className="tematica-container__main-trigger" style={{background: COLORS.GLOBAL.backgroundDark}}>
                        <Box className="tematica-container__main-title">
                            temática
                        </Box>
                        <Accordion.ItemIndicator className="tematica-container__main-indicator" />
                    </Accordion.ItemTrigger>

                    <Accordion.ItemContent className="tematica-container__itemContent">
                        <AccordionItemBody style={{padding:"0rem"}} >

                            <Accordion.Root collapsible variant={"enclosed"} style={{borderRadius:"0rem", border:"none"}}>
                                {Object.entries(SECTIONS).map(([sectionKey, section]) => (
                                    <Accordion.Item key={sectionKey} value={sectionKey} style={{background: COLORS.GLOBAL.backgroundLight}}>
                                        <Accordion.ItemTrigger className="tematica-container__section-trigger" style={{background: COLORS.GLOBAL.backgroundMedium}}>
                                           <Span className="tematica-container__section-title">
                                                {section.label}
                                            </Span>
                                            <Accordion.ItemIndicator className="tematica-container__section-indicator"/>
                                        </Accordion.ItemTrigger>

                                        <Accordion.ItemContent className="tematica-container__itemContent">
                                            <AccordionItemBody className="tematica-container__sub-accordion" >
                                            {section.layers.map((layerKey, idx) => (
                                            <>
                                                <Box key={layerKey} p={2} display="flex" alignItems="center" width={"100%"} >
                                                    <Checkbox.Root 
                                                        cursor={"pointer"} 
                                                        variant={"solid"} 
                                                        className="custom-green-checkbox"
                                                        checked={selectedLayer === layerKey}
                                                        onCheckedChange={() => handleLayerToggle(layerKey)}
                                                    >
                                                        <Checkbox.HiddenInput />
                                                        <Checkbox.Control />
                                                        <Checkbox.Label className="tematica-container__checkbox-label"> {LAYERS[layerKey]?.title || layerKey}</Checkbox.Label>
                                                    </Checkbox.Root>                                               
                                                </Box>
                                                {idx < section.layers.length - 1 && (
                                                    <Box
                                                        as="hr"
                                                        border="none"
                                                        borderBottom="1px solid #bdbdbd"
                                                        width="90%"
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