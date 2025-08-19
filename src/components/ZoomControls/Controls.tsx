import { Button, Group } from "@chakra-ui/react";
import { COLORS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";
import { FiPlus, FiMinus } from "react-icons/fi";
import "../Visor/Visor.scss"
import { RiHome2Line, RiDownloadLine } from "react-icons/ri"; 
import { AiOutlineSelect } from "react-icons/ai";
import { SiTarget } from "react-icons/si";
import { LuSquareDashed } from "react-icons/lu";
import { ImFilePicture } from "react-icons/im";
import { PiIntersectSquareDuotone, PiIntersectSquareFill } from "react-icons/pi";
import { MapLayer } from "../../classes/MapLayer";
import { getMapImage, blobToBase64 } from "../../utils/downloadFile";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import './Controls.scss'
import { useEffect } from "react";



const Controls = ({mapLayerInstance, rangeGraphRef, deck, map, setPopUp}) => {
    const navigate = useNavigate();
    const { zoomIn, zoomOut, activeLayerKey, selectedAGEBS, selectedColonias, mapLayers, setMapLayers, selectedBaseLayers, setSelectedAGEBS, setSelectedColonias, setActiveLayerKey, selectedLayer} = useAppContext();
    //const [popUp, setPopUp] = useState<boolean>(false);

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

     const handleLayerToggle = (layerKey: string) => {
        if(layerKey === activeLayerKey) {
            setActiveLayerKey(null);
        } else {
            setActiveLayerKey(layerKey);
        }
    };

    useEffect(() => {
       console.log("selected layer", selectedLayer);
    }, [selectedLayer]);

    return (
        <div className="button-row">
            <Button className="button" background={COLORS.GLOBAL.backgroundDark}
                onClick={() => navigate("/")}>
                <RiHome2Line/>
            </Button>
                                
            <Group attached >
                <Button className="button"
                    background={COLORS.GLOBAL.backgroundDark} 
                    onClick={zoomIn}
                >
                    <FiPlus />
                </Button>
                <Button className="button"
                    background={COLORS.GLOBAL.backgroundDark} 
                    onClick={zoomOut}
                >
                    <FiMinus />
                </Button>
            </Group>

            {selectedLayer &&
            <>
            <Group style={{ gap: "0.1vw" }}>
                <Button className="button"  background={activeLayerKey === "agebs" ? COLORS.GLOBAL.backgroundDark : COLORS.GLOBAL.backgroundMedium} onClick={() => handleLayerToggle("agebs")}>
                    <AiOutlineSelect />
                </Button>
                <Button className="button"  background={activeLayerKey === "colonias" ? COLORS.GLOBAL.backgroundDark : COLORS.GLOBAL.backgroundMedium} onClick={() => handleLayerToggle("colonias")}>
                    <SiTarget />
                </Button>
                {(selectedAGEBS.length > 0 || selectedColonias.length > 0 ) &&
                    <Button className="button"   background={COLORS.GLOBAL.backgroundMedium } onClick={() => activeLayerKey === "agebs" ? setSelectedAGEBS([]) : setSelectedColonias([])}>
                        <LuSquareDashed />
                    </Button>                       
                }
            </Group>
            
            <Group style={{ gap: "0.1vw" }}>
                <Button className="button" minWidth="auto" background={activeLayerKey === "agebs" ? COLORS.GLOBAL.backgroundDark : COLORS.GLOBAL.backgroundMedium} onClick={() => handleLayerToggle("agebs")}>
                    <PiIntersectSquareDuotone  />
                </Button>
                <Button className="button" minWidth="auto"  background={activeLayerKey === "colonias" ? COLORS.GLOBAL.backgroundDark : COLORS.GLOBAL.backgroundMedium} onClick={() => handleLayerToggle("colonias")}>
                    <PiIntersectSquareFill     />
                </Button>
            </Group>      
            
            <Button className="button" 

                background={COLORS.GLOBAL.backgroundDark} 
                onClick={() => {
                    addInstanceToArray(mapLayerInstance as MapLayer);
                }}>
                <ImFilePicture />
            </Button>


            {mapLayers.length > 0 && 
            <Button className="button"
                background={COLORS.GLOBAL.backgroundDark}
                onClick={() => {
                    setPopUp(true);
                }}>
                <RiDownloadLine />
            </Button>
            }
            </>
}

        </div>
    );
}

export default Controls;