import { Button } from "@chakra-ui/react";
import { COLORS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";

const ZoomControls = () => {
    const { zoomIn, zoomOut } = useAppContext();

    return (
        <div >
            <Button 
                rounded={"lg"}
                //size={"sm"} 
                p={2} 
                background={COLORS.GLOBAL.backgroundDark} 
                //borderRadius={"0.1rem"}
                borderTopRightRadius={"0.1rem"}
                borderBottomRightRadius={"0.1rem"}
                onClick={zoomIn}
            >
                +
            </Button>
            <Button 
                rounded={"lg"}
                //size={"sm"} 
                p={2}
                background={COLORS.GLOBAL.backgroundDark} 
                //borderRadius={"0.1rem"}
                borderTopLeftRadius={"0.1rem"}
                borderBottomLeftRadius={"0.1rem"}
                onClick={zoomOut}
            >
                -
            </Button>
        </div>
    );
}

export default ZoomControls;