import { useAppContext } from "../../context/AppContext";
import { Group, Button } from "@chakra-ui/react";
import { Tooltip } from "../ui/Tooltip";
import { toaster } from "../ui/toaster";
import html2canvas from "html2canvas";
import { MapLayer } from "../../classes/MapLayer";
import { getMapImage, blobToBase64 } from "../../utils/downloadFile";
import { defaultViewState } from "../../context/AppContext";
import SaveLayer from '/assets/Icono GUARDAR CAPA.png'
import IconDownload from '/assets/Icono DESCARGAR.png'
import type { DownloadProps } from "./Toolbar";

const DownloadTools = ({rangeGraphRef, deck, map, setPopUp} : DownloadProps) => {
    const { 
        setViewState,
        mapLayers, setMapLayers,
        mapLayerInstance,
        selectedAGEBS,
        selectedColonias,
        activeLayerKey,
        selectedBaseLayers,
    } = useAppContext();

    const hasSelection = (
        (activeLayerKey === "agebs" && selectedAGEBS.length > 0) || 
        (activeLayerKey === "colonias" && selectedColonias.length > 0)
    ) ? true : false;

    const hasScreenshots = (mapLayers.length > 0) ? true : false;

    const saveLayerScreenshot = async (instance: MapLayer) => {
        setViewState(defaultViewState);
        setTimeout(async() => {
            const imageUrl = getMapImage(deck.current, map.current, instance);

            if (imageUrl && instance) {
                const response = await fetch(imageUrl);
                const blobImage = await response.blob();
                const base64Image = await blobToBase64(blobImage) as string;
                instance.deckImage = base64Image;
            }

            if (rangeGraphRef.current) {
                const canvas = await html2canvas(rangeGraphRef.current);
                instance.graphImage = canvas.toDataURL("image/png");
            }

            const newInstance = { 
                ...instance,
                selected: (activeLayerKey === "agebs" ? selectedAGEBS : selectedColonias),
                complementarias: selectedBaseLayers,
                activeKey: activeLayerKey
            };
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
                        <img src={SaveLayer} alt="Guardar Capa" style={{maxWidth: "90%", maxHeight: "90%"}}/>
                        {mapLayers.length > 0 && <div className="circle">{mapLayers.length}</div>}
                    </Button>
                </Tooltip>

                <Tooltip content="Descargar Resumen" disabled={!hasScreenshots}>
                    <Button className="button"
                        disabled={!hasScreenshots}
                        onClick={() => {
                            setPopUp(true);
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
