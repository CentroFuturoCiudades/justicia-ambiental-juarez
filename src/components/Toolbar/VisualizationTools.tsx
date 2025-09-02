import { useAppContext } from "../../context/AppContext";
import { Group, Button } from "@chakra-ui/react";
import IconAGEBS from '/assets/Icono AGEBS.png'
import IconColonias from '/assets/Icono COLONIAS.png'
import { COLORS } from "../../utils/constants"; //cambiar a scss

const VisualizationTools = () => {
    const { activeLayerKey, setActiveLayerKey } = useAppContext();

    return (
        <div>
            <Group attached style={{ height: "100%" }}>
                <Button className="button button--thin" background={activeLayerKey === "agebs" ? COLORS.GLOBAL.backgroundDark : "#6f6f6f"} onClick={() => setActiveLayerKey("agebs")}>
                    <img src={IconAGEBS} alt="AGEBS" />
                </Button>
                <Button className="button button--thin" background={activeLayerKey === "colonias" ? COLORS.GLOBAL.backgroundDark : "#6f6f6f"} onClick={() => setActiveLayerKey("colonias")}>
                    <img src={IconColonias} alt="Colonias" />
                </Button>
            </Group>   
        </div>
    );
}

export default VisualizationTools;
