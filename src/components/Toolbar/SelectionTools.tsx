import { useAppContext } from "../../context/AppContext";
import { Group, Button } from "@chakra-ui/react";
import Selection from '/assets/Icono SELECCION.png'
import IconRadius from '/assets/Icono RADIO.png'
import Deselect from '/assets/Icono DESELECCION.png'
import { COLORS } from "../../utils/constants"; //pasar a css
import "./Toolbar.scss"

const SelectionTools = () => {
    const {
        selectionMode, setSelectionMode,
        selectedAGEBS, setSelectedAGEBS,
        selectedColonias, setSelectedColonias,
        activeLayerKey
    } = useAppContext();

    const handleSelectionMode = (mode: string) => {
        if (mode === selectionMode) {
            setSelectionMode(null);
        } else {
            setSelectionMode(mode);
        }
    }

    return (
        <div>
            <Group attached style={{ height: "100%" }}>
                <Button className="button button--thin" background={selectionMode === "agebs" ? COLORS.GLOBAL.backgroundDark : "#6f6f6f"} onClick={() => handleSelectionMode("agebs")}>
                    <img src={Selection} alt="Seleccionar" />
                </Button>
                <Button className="button button--thin" background={selectionMode === "radius" ? COLORS.GLOBAL.backgroundDark : "#6f6f6f"} onClick={() => handleSelectionMode("radius")}>
                    <img src={IconRadius} alt="Radio" />
                </Button>
                    <Button 
                        className="button button--thin"
                        background={"#6f6f6f"} 
                        onClick={() => activeLayerKey === "agebs" ? setSelectedAGEBS([]) : setSelectedColonias([])}
                        disabled={(selectedAGEBS.length === 0 && selectedColonias.length === 0 && selectionMode !== "agebs")}
                    >
                        <img src={Deselect} alt="Deseleccionar" />
                    </Button>                    
            </Group>
        </div>
    );
}

export default SelectionTools;
