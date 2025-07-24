import { Button } from "@chakra-ui/react";
import { COLORS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";

const ZoomControls = () => {
    const { zoomIn, zoomOut } = useAppContext();

    return (
        <div >
            <Button 
                size={"sm"} 
                p={0} 
                background={COLORS.GLOBAL.backgroundDark} 
                borderRadius={"0.1rem"}
                onClick={zoomIn}
            >
                +
            </Button>
            <Button 
                size={"sm"} 
                p={0}
                background={COLORS.GLOBAL.backgroundDark} 
                borderRadius={"0.1rem"}
                onClick={zoomOut}
            >
                -
            </Button>
        </div>
    );
}

export default ZoomControls;