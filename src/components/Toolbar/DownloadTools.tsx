import { useAppContext } from "../../context/AppContext";
import { Group, Button, Float, Circle } from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";
import { toaster } from "../ui/toaster";
import html2canvas from "html2canvas";
import { MapLayer } from "../../classes/MapLayer";
import { getMapImage, blobToBase64 } from "../../utils/downloadFile";
import { defaultViewState } from "../../context/AppContext";
import SaveLayer from '/assets/Icono GUARDAR CAPA.png'
import IconDownload from '/assets/Icono DESCARGAR.png'
import type { DownloadProps } from "./Toolbar";
import { useMediaQuery } from '@chakra-ui/react';


const DownloadTools = ({rangeGraphRef, deck, map, setPopUp, setMobileVisibleElement} : DownloadProps) => {
    const { 
        setViewState,
        mapLayers, setMapLayers,
        mapLayerInstance,
        selectedAGEBS,
        selectedColonias,
        activeLayerKey,
        //selectedBaseLayers,
    } = useAppContext();
    const [isMobile] = useMediaQuery('(max-width: 800px)')
    

    const hasSelection = (
        (activeLayerKey === "agebs" && selectedAGEBS.length > 0) || 
        (activeLayerKey === "colonias" && selectedColonias.length > 0)
    ) ? true : false;

    const hasScreenshots = (mapLayers.length > 0) ? true : false;

    const saveLayerScreenshot = async (instance: MapLayer) => {
        setViewState(defaultViewState);
        const newInstance = { 
            ...instance,
            selected: (activeLayerKey === "agebs" ? selectedAGEBS : selectedColonias),
            //complementarias: selectedBaseLayers,
            activeKey: activeLayerKey
        };

        setTimeout(async() => {
            const imageUrl = getMapImage(deck.current, map.current, instance);

            if (imageUrl && instance) {
                const response = await fetch(imageUrl);
                const blobImage = await response.blob();
                const base64Image = await blobToBase64(blobImage) as string;
                newInstance.deckImage = base64Image;
            }

            if (rangeGraphRef.current) {
                //"Unable to clone WebGL context as it has preserveDrawingBuffer=false" ??
                const canvas = await html2canvas(rangeGraphRef.current);
                newInstance.graphImage = canvas.toDataURL("image/png");
            }

            setMapLayers(prev => [...prev, newInstance]);
        }, 300);
    };

    return (
        <div>
            <Group attached className="button_group">
                <Tooltip content="Guardar Capa" disabled={!hasSelection}>
                    <Button 
                        className="button"
                        position={"relative"}
                        disabled={!hasSelection}
                        onClick={() => {
                            saveLayerScreenshot(mapLayerInstance as MapLayer);
                            toaster.create({
                                description: "El indicador se ha guardado correctamente para el reporte.",
                                type: "info",
                                duration: 6000,
                            });
                        }}
                        style={{borderTopRightRadius: 0, borderBottomRightRadius: 0}}
                    >
                        <img src={SaveLayer} />
                        {mapLayers.length > 0 && 
                            <Float offset={isMobile ? "min(1dvh, 1.2dvw)" : "min(0.7dvh, 0.4dvw)"}>
                                <Circle bg="red" size={isMobile ? "min(1.5dvh, 2dvw)" : "min(1.2dvh, 0.7dvw)"} fontSize={isMobile ? "min(0.8dvh, 1dvw)" : "min(0.8dvh, 0.5dvw)"} >
                                    {mapLayers.length}
                                </Circle>
                            </Float>
                        }
                    </Button>
                </Tooltip>

                <Tooltip content="Descargar Resumen" disabled={!hasScreenshots}>
                    <Button className="button"
                        disabled={!hasScreenshots}
                        onClick={() => {
                            setPopUp(true);
                            if (setMobileVisibleElement) setMobileVisibleElement("download");
                        }}
                        style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}
                    >
                        <img src={IconDownload} alt="Descargar" />
                    </Button>
                </Tooltip>
            </Group>
        </div>
    );
}

export default DownloadTools;
