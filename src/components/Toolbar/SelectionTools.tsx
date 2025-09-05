import { useAppContext } from "../../context/AppContext";
import { Group, Button } from "@chakra-ui/react";
import { Tooltip } from "../ui/Tooltip";
import Selection from '/assets/Icono SELECCION.png'
import IconRadius from '/assets/Icono RADIO.png'
import Deselect from '/assets/Icono DESELECCION.png'
import "./Toolbar.scss"

const SelectionTools = () => {
    const {
        selectionMode, setSelectionMode,
        selectedAGEBS, setSelectedAGEBS,
        selectedColonias, setSelectedColonias,
        activeLayerKey
    } = useAppContext();

    return (
        <div>
            <Group attached className="button_group">
                <Tooltip content="Seleccionar AGEBS o Colonias">
                    <Button 
                        className={`button button--thin ${selectionMode === "agebs" ? "button--active" : ""}`} 
                        onClick={() => setSelectionMode("agebs")} 
                        style={{borderTopRightRadius: 0, borderBottomRightRadius: 0}}>
                        <img src={Selection} alt="Seleccionar" />
                    </Button>
                </Tooltip>
                <Tooltip content="Seleccionar Radio">
                    <Button 
                        className={`button button--thin ${selectionMode === "radius" ? "button--active" : ""}`} 
                        onClick={() => setSelectionMode("radius")} 
                        style={{ borderRadius: 0 }}
                    >
                        <img src={IconRadius} alt="Radio" />
                    </Button>
                </Tooltip>
                <Tooltip content="Deseleccionar">
                    <Button 
                        className="button button--thin"
                        onClick={() => activeLayerKey === "agebs" ? setSelectedAGEBS([]) : setSelectedColonias([])}
                        disabled={(
                            (activeLayerKey === "agebs" && selectedAGEBS.length === 0) || 
                            (activeLayerKey === "colonias" && selectedColonias.length === 0) || 
                            selectionMode !== "agebs"
                        )}
                        style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}
                    >
                        <img src={Deselect} alt="Deseleccionar" />
                    </Button>
                </Tooltip>
            </Group>
        </div>
    );
}

export default SelectionTools;
