import { useAppContext } from "../../context/AppContext";
import { Group, Button } from "@chakra-ui/react";
import Icon_ZoomIn from '/assets/Icono ZOOMIN.png'
import Icon_ZoomOut from '/assets/Icono ZOOMOUT.png'

const ZoomTools = () => {
    const { zoomIn, zoomOut } = useAppContext();
    return (
        <div>
            <Group attached style={{ height: "100%" }}>
                <Button className="button button--thin" onClick={zoomIn} >
                    <img src={Icon_ZoomIn} alt="Zoom In" /> 
                </Button>
                <Button className="button button--thin" onClick={zoomOut} >
                    <img src={Icon_ZoomOut} alt="Zoom Out" />
                </Button>
            </Group>
        </div>
    );
}

export default ZoomTools;