import { Button, Group } from "@chakra-ui/react";
import { COLORS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";
import "../Visor/Visor.scss"
import { SiTarget } from "react-icons/si";
import { MapLayer } from "../../classes/MapLayer";
import { getMapImage, blobToBase64 } from "../../utils/downloadFile";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import './Controls.scss'
import { useEffect } from "react";
import Home from '/assets/Icono HOME.png'
import Selection from '/assets/Icono SELECCION.png'
import SaveLayer from '/assets/Icono GUARDAR CAPA.png'
import Deselect from '/assets/Icono DESELECCION.png'
import IconAGEBS from '/assets/Icono AGEBS.png'
import IconColonias from '/assets/Icono COLONIAS.png'
import IconDownload from '/assets/Icono DESCARGAR.png'
import Icon_ZoomIn from '/assets/Icono ZOOMIN.png'
import Icon_ZoomOut from '/assets/Icono ZOOMOUT.png'

type ControlProps = {
    mapLayerInstance: any;
    rangeGraphRef: React.RefObject<HTMLDivElement | null>;
    deck: React.RefObject<HTMLDivElement>;
    map: React.RefObject<HTMLDivElement>;
    setPopUp: any;
}

const Controls = ({mapLayerInstance, rangeGraphRef, deck, map, setPopUp} : ControlProps) => {
    const navigate = useNavigate();
    const { 
        zoomIn, zoomOut, 
        activeLayerKey, 
        selectedAGEBS, setSelectedAGEBS,
        selectedColonias, setSelectedColonias,
        mapLayers, setMapLayers, 
        selectedBaseLayers, 
        setActiveLayerKey, selectedLayer
    } = useAppContext();

    const addInstanceToArray = async (instance: MapLayer) => {

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
        console.log("new instance", newInstance);
        setMapLayers(prev => [...prev, newInstance]);
    }

    useEffect(() => {
       console.log("selected layer", selectedLayer);
    }, [selectedLayer]);

    return (
        <div className="button-row">
            <Button className="button" background={COLORS.GLOBAL.backgroundDark}
                onClick={() => navigate("/")}>
                <img src={Home} alt="Home" />
            </Button>
                                
            <Group attached >
                <Button className="button"
                    width={"2vw"}
                    minWidth={0}
                    background={COLORS.GLOBAL.backgroundDark} 
                    onClick={zoomIn}
                >
                    <img src={Icon_ZoomIn} alt="Zoom In" /> 
                </Button>
                <Button className="button"
                    width={"2vw"}
                    minWidth={0}
                    background={COLORS.GLOBAL.backgroundDark} 
                    onClick={zoomOut}
                >
                    <img src={Icon_ZoomOut} alt="Zoom Out" />
                </Button>
            </Group>

            {selectedLayer &&
                <>
                    <Group attached>
                        <Button className="button" width={"2vw"} minWidth={"2vw"} background={COLORS.GLOBAL.backgroundDark} >
                            <img src={Selection} alt="Seleccionar" />
                        </Button>
                        <Button className="button" width={"2vw"} minWidth={"2vw"} background={ "#6f6f6f"}>
                            <SiTarget />
                        </Button>
                        <Button 
                            className="button"   
                            width={"2vw"}
                            minWidth={"2vw"}
                            background={"#6f6f6f"} 
                            onClick={() => activeLayerKey === "agebs" ? setSelectedAGEBS([]) : setSelectedColonias([])}
                            disabled={(selectedAGEBS.length === 0 && selectedColonias.length === 0)}
                        >
                            <img src={Deselect} alt="Deseleccionar" />
                        </Button>                       
                    </Group>

                    <Group attached>
                        <Button className="button" width={"2vw"} minWidth={"2vw"}  background={activeLayerKey === "agebs" ? COLORS.GLOBAL.backgroundDark : "#6f6f6f"} onClick={() => setActiveLayerKey("agebs")}>
                            <img src={IconAGEBS} alt="AGEBS" />
                        </Button>
                        <Button className="button" disabled={true} width={"2vw"} minWidth={"2vw"}  background={activeLayerKey === "colonias" ? COLORS.GLOBAL.backgroundDark : "#6f6f6f"} onClick={() => setActiveLayerKey("colonias")}>
                            <img src={IconColonias} alt="Colonias" />
                        </Button>
                    </Group>      

                    <Button className="button"
                        position={"relative"}
                        disabled={(selectedAGEBS.length === 0 && selectedColonias.length === 0)}
                        background={COLORS.GLOBAL.backgroundDark} 
                        onClick={() => {
                            addInstanceToArray(mapLayerInstance as MapLayer);
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
        
                </>
            }

        </div>
    );
}

export default Controls;