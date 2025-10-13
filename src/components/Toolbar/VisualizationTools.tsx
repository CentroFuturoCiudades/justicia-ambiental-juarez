import { useAppContext } from "../../context/AppContext";
import { Group, Button } from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";
import IconAGEBS from '/assets/Icono AGEBS.png'
import IconColonias from '/assets/Icono COLONIAS.png'
import { LAYERS } from "../../utils/constants";

const VisualizationTools = () => {
    const { activeLayerKey, setActiveLayerKey, selectedLayer } = useAppContext();

    return (
        <div>
            <Group attached className="button_group">
                <Tooltip content="AGEBS">
                    <Button 
                        className={`button button--thin ${activeLayerKey === "agebs" ? "button--active" : ""}`} 
                        onClick={() => setActiveLayerKey("agebs")} 
                        style={{borderTopRightRadius: 0, borderBottomRightRadius: 0}}
                        disabled={!activeLayerKey}
                    >
                        <img src={IconAGEBS} alt="AGEBS" />
                    </Button>
                </Tooltip>
                <Tooltip content="Colonias">
                    <Button 
                        className={`button button--thin ${activeLayerKey === "colonias" ? "button--active" : ""}`} 
                        onClick={() => setActiveLayerKey("colonias")} 
                        style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}
                        disabled={!activeLayerKey || !LAYERS[selectedLayer].colonias}
                    >
                        <img src={IconColonias} alt="Colonias" />
                    </Button>
                </Tooltip>
            </Group>
        </div>
    );
}

export default VisualizationTools;
