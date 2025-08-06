import { Button } from "@chakra-ui/react";
import { COLORS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";
import { FaMinus } from "react-icons/fa";
import { FiPlus, FiMinus } from "react-icons/fi";

const ZoomControls = () => {
    const { zoomIn, zoomOut } = useAppContext();

    return (
        <div >
            <Button 
                rounded={"lg"}
                //size={"sm"} 
                p={1} 
                background={COLORS.GLOBAL.backgroundDark} 
                borderRadius={0}
                borderTopRightRadius={"0.1rem"}
                borderBottomRightRadius={"0.1rem"}
                onClick={zoomIn}
            >
               <FiPlus />
            </Button>
            <Button 
                rounded={"lg"}
                //size={"sm"} 
                p={1}
                background={COLORS.GLOBAL.backgroundDark} 
                borderRadius={0}
                borderTopLeftRadius={"0.1rem"}
                borderBottomLeftRadius={"0.1rem"}
                onClick={zoomOut}
            >
                <FiMinus />
            </Button>
        </div>
    );
}

export default ZoomControls;