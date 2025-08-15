import { Accordion, AccordionItemBody, Box, Checkbox, Span } from "@chakra-ui/react";
import { SECTIONS, LAYERS, COLORS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";
import "./Tematica.scss";

const Tematica = () => {

    const { selectedLayer, setSelectedLayer, setActiveLayerKey } = useAppContext();

    const handleLayerToggle = (layerKey: string) => {
        setSelectedLayer(prev => prev === layerKey ? "" : layerKey);
        setActiveLayerKey( layerKey === selectedLayer ? "juarez" : "agebs");
    }
 
    return (
        <div className="tematica-container">
            {/* 1st level accordion */}
            <Accordion.Root className="tematica-container__accordion" collapsible variant={"enclosed"}>
                <Accordion.Item value="main" style={{ background: "#c6c6c6"}}>
                    
                    <Accordion.ItemTrigger className="tematica-container__main-trigger" style={{background: COLORS.GLOBAL.backgroundDark}}>
                        <Box>
                            temática
                        </Box>
                        <Accordion.ItemIndicator className="tematica-container__dropdown-indicator" />
                    </Accordion.ItemTrigger>

                    <Accordion.ItemContent className="tematica-container__itemContent">
                        <AccordionItemBody style={{padding:"0rem"}} >

                            {/* 2nd level accordion */}
                            <Accordion.Root collapsible variant={"enclosed"} style={{borderRadius:"0rem", border:"none"}}>
                                {Object.entries(SECTIONS).map(([sectionKey, section]) => (
                                    <Accordion.Item key={sectionKey} value={sectionKey} style={{background: "white"}}>
                                        <Accordion.ItemTrigger className="tematica-container__section-trigger" style={{background: COLORS.GLOBAL.backgroundMedium}}>
                                           <Span>
                                                {section.label}
                                            </Span>
                                            <Accordion.ItemIndicator className="tematica-container__dropdown-indicator"/>
                                        </Accordion.ItemTrigger>

                                        <Accordion.ItemContent className="tematica-container__itemContent">
                                            <AccordionItemBody className="tematica-container__sub-accordion" >
                                            {section.layers.map((layerKey, idx) => (
                                            <>
                                                <Box key={layerKey} className="tematica-container__checkbox-content">
                                                    <Checkbox.Root 
                                                        cursor={"pointer"} 
                                                        variant={"solid"} 
                                                        className="custom-green-checkbox"
                                                        checked={selectedLayer === layerKey}
                                                        onCheckedChange={() => handleLayerToggle(layerKey)}
                                                        disabled={!LAYERS[layerKey]?.enabled}
                                                    >
                                                        <Checkbox.HiddenInput />
                                                        <Checkbox.Control />
                                                        <Checkbox.Label style={selectedLayer === layerKey ? { fontWeight: "bold" } : {}}> {LAYERS[layerKey]?.title || layerKey}</Checkbox.Label>
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