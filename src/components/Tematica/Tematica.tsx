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
        setSelectionMode,
        setSelectedPoint
    } = useAppContext();

    const [isMobile] = useMediaQuery('(max-width: 800px)');

    /* Al seleccionar una capa de Tematica:
        - Se actualiza la capa seleccionada
        - Se establece la clave de la capa activa (agebs/colonias)
        - Se establece el modo de selección
    */
    const handleLayerToggle = (layerKey: LayerKey) => {
        if (selectedLayer === layerKey) {
            setSelectedLayer("");
            setActiveLayerKey(null);
            setSelectionMode(null);
            setSelectedPoint(null);
        } else {
            setSelectedLayer(layerKey);
            setActiveLayerKey(prev => prev ?? "agebs");
            setSelectionMode(prev => prev ?? "agebs");
            setSelectedPoint(null);
        }
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
                                        {section.layers.map((layerKey, index) => {
                                            const firstCapa = LAYERS[layerKey]?.capa && section.layers.findIndex(key => LAYERS[key]?.capa) === index;
                                            return (
                                            <>
                                            {firstCapa && (
                                                <div style={{ borderBottom: '2px solid black', padding:0 }}>
                                                    Visión Global Ciudad Juárez
                                                </div>
                                            )}
                                            <Checkbox.Root 
                                                cursor={"pointer"} 
                                                variant={"solid"} 
                                                checked={selectedLayer === layerKey}
                                                onCheckedChange={() => handleLayerToggle(layerKey)}
                                                disabled={!LAYERS[layerKey]?.enabled}
                                                className={`checkbox ${LAYERS[layerKey]?.capa ? 'checkbox--capa' : ''}`}
                                            >
                                                
                                                <Checkbox.HiddenInput />
                                                <Checkbox.Control />
                                                    <Span className="checkbox__content">
                                                    <Checkbox.Label className={`checkbox__label ${selectedLayer === layerKey ? 'checkbox__label--bold' : ''}`} > {LAYERS[layerKey]?.title || layerKey}</Checkbox.Label>
                                                    {LAYERS[layerKey]?.capa && 
                                                        <p style={{ fontSize: 'min(1.2dvh, 1dvw)', alignSelf: 'flex-end', fontStyle: 'italic'}}>municipal</p>
                                                    }
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
                                            </>
                                            );
                                        })}
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