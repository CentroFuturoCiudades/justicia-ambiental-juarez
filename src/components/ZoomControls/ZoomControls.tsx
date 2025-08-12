import { Button, Group } from "@chakra-ui/react";
import { COLORS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";
import { FaMinus } from "react-icons/fa";
import { FiPlus, FiMinus } from "react-icons/fi";

const ZoomControls = () => {
    const { zoomIn, zoomOut } = useAppContext();

    return (
        <div >
            <Group attached >
                <Button 
                    padding={1}
                    background={COLORS.GLOBAL.backgroundDark} 
                    borderRadius={0}
                    onClick={zoomIn}
                    minWidth="auto"
                >
                    <FiPlus size={38}/>
                </Button>
                <Button 
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