import { Accordion, AccordionItemBody, Box, Checkbox, Span } from "@chakra-ui/react";
import { SECTIONS, LAYERS, COLORS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";
import "./Tematica.scss";
import { useEffect } from "react";
import { MdFullscreen } from "react-icons/md";


const Tematica = () => {

    const { selectedLayer, setSelectedLayer, setActiveLayerKey, mapLayers } = useAppContext();
    const selectedLayerData = selectedLayer ? LAYERS[selectedLayer as keyof typeof LAYERS] : undefined;
    

    const handleLayerToggle = (layerKey: string) => {
        setSelectedLayer(prev => prev === layerKey ? "" : layerKey);
        setActiveLayerKey( layerKey === selectedLayer ? null : "agebs");
    }

    const dropdownLayerTitles = Object.values(LAYERS).map(l => l.title);
    const savedLayers = mapLayers.filter(instance => dropdownLayerTitles.includes(instance.title));
    const savedLayerTitles = savedLayers.map(inst => inst.title);
    //const savedLayers = mapLayers.filter(instance => instance.title === selectedLayerData?.title);
    //const savedLayerTitles = savedLayers.map(inst => inst.title);

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
                                                <Box key={layerKey} className="tematica-container__checkbox-content" >
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
                                                        <Checkbox.Label className={`tematica-container__checkbox-label${selectedLayer === layerKey ? " -selected" : ""}`}> {LAYERS[layerKey]?.title || layerKey}</Checkbox.Label>
                                                    </Checkbox.Root>   
                                                    {/*savedLayerTitles.length > 0 && savedLayerTitles.includes(LAYERS[layerKey]?.title) && <MdFullscreen style={{ fontSize: "1vh", minWidth: "1.3vw", minHeight: "3vh" }} />*/}
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