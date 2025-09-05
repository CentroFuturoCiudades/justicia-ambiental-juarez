import { useAppContext } from "../../context/AppContext";
import { Group, Button } from "@chakra-ui/react";
import Icon_ZoomIn from '/assets/Icono ZOOMIN.png'
import Icon_ZoomOut from '/assets/Icono ZOOMOUT.png'

const ZoomTools = () => {
    const { zoomIn, zoomOut } = useAppContext();
    return (
        <div>
            <Group attached className="button_group">
                <Button 
                    className="button button--thin"
                    background={'var(--background-dark)'}
                    onClick={zoomIn} 
                >
                    <img src={Icon_ZoomIn} alt="Zoom In" /> 
                </Button>
                <Button
                    className="button button--thin"
                    background={'var(--background-dark)'}
                    onClick={zoomOut}
                >
                    <img src={Icon_ZoomOut} alt="Zoom Out" />
                </Button>
            </Group>
        </div>
    );
}

export default ZoomTools;