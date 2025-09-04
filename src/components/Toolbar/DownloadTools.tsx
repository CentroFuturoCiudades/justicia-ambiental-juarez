import { useAppContext } from "../../context/AppContext";
import { Group, Button } from "@chakra-ui/react";
import { toaster } from "../ui/toaster";
import html2canvas from "html2canvas";
import { MapLayer } from "../../classes/MapLayer";
import { getMapImage, blobToBase64 } from "../../utils/downloadFile";
import { defaultViewState } from "../../context/AppContext";
import SaveLayer from '/assets/Icono GUARDAR CAPA.png'
import IconDownload from '/assets/Icono DESCARGAR.png'
import { COLORS } from "../../utils/constants"; //pasar a css
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
            <Group attached style={{ height: "100%" }}>
                <Button className="button"
                    position={"relative"}
                    disabled={(selectedAGEBS.length === 0 && selectedColonias.length === 0)}
                    background={COLORS.GLOBAL.backgroundDark} 
                    onClick={() => {
                        saveLayerScreenshot(mapLayerInstance as MapLayer);
                        toaster.create({
                            description: "El indicador se ha guardado correctamente para el reporte.",
                            type: "info",
                            duration: 6000,
                        });
                    }}
                >
                    <img src={SaveLayer} alt="Guardar Capa" />
                    {mapLayers.length > 0 && <div className="circle">{mapLayers.length}</div>}
                </Button>

                <Button className="button"
                    disabled={mapLayers.length === 0}
                    background={COLORS.GLOBAL.backgroundDark}
                    onClick={() => {
                        setPopUp(true);
                    }}>
                    <img src={IconDownload} alt="Descargar" />
                </Button>
            </Group>
        </div>
    );
}

export default DownloadTools;
