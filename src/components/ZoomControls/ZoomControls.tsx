import { Button } from "@chakra-ui/react";
import { COLORS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";

const ZoomControls = () => {
    const { zoomIn, zoomOut } = useAppContext();

    return (
        <div style={{position:"absolute", top:"1.5rem", left:"2rem", display:"flex", gap:"0", background:COLORS.GLOBAL.backgroundDark, borderRadius:"0.1rem", padding:"0rem"}}>
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