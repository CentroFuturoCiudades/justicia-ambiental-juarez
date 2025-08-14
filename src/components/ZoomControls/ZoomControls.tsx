import { Button, Group } from "@chakra-ui/react";
import { COLORS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";
import { FiPlus, FiMinus } from "react-icons/fi";
import "../Visor/Visor.scss"

const ZoomControls = () => {
    const { zoomIn, zoomOut } = useAppContext();

    return (
        <div >
            <Group attached >
                <Button className="visor__button"
                    padding={1}
                    background={COLORS.GLOBAL.backgroundDark} 
                    borderRadius={0}
                    onClick={zoomIn}
                    minWidth="auto"
                >
                    <FiPlus size={38}/>
                </Button>
                <Button className="visor__button"
                    padding={1}
                    background={COLORS.GLOBAL.backgroundDark} 
                    borderRadius={0}
                    onClick={zoomOut}
                    minWidth="auto"
                >
                    <FiMinus size={38}/>
                </Button>
            </Group>
        </div>
    );
}

export default ZoomControls;