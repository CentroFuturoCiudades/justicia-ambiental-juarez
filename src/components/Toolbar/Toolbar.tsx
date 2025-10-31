import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { Button, Checkbox } from "@chakra-ui/react";
import Home from '/assets/Icono HOME.png'
import ZoomTools from "./ZoomTools";
import SelectionTools from "./SelectionTools";
import VisualizationTools from "./VisualizationTools";
import DownloadTools from "./DownloadTools";
import './Toolbar.scss'

export type DownloadProps = {
    rangeGraphRef: React.RefObject<HTMLDivElement | null>;
    deck: React.RefObject<HTMLDivElement>;
    map: React.RefObject<HTMLDivElement>;
    setPopUp: any;
    setMobileVisibleElement?: any;
}

const Toolbar = ({ rangeGraphRef, deck, map, setPopUp, setMobileVisibleElement }: DownloadProps) => {
    const navigate = useNavigate();
    const { selectedLayer, isSatellite, setSatellite } = useAppContext();
    return (
        <div className="toolbar">

            {/* Home */}
            <Button className="button"
                onClick={() => navigate("/")}>
                <img src={Home} alt="Home" />
            </Button>

            <ZoomTools />

            {selectedLayer && 
                <>
                    <SelectionTools />
                    <VisualizationTools />
                    <DownloadTools 
                        rangeGraphRef={rangeGraphRef}
                        deck={deck}
                        map={map}
                        setPopUp={setPopUp}
                        setMobileVisibleElement={setMobileVisibleElement}
                    />
                </>
            }
            <Checkbox.Root variant={"solid"} gap={"0.5dvw"} checked={isSatellite} onCheckedChange={() => setSatellite(!isSatellite)} color={isSatellite ? "white": "black"} >
                <Checkbox.HiddenInput />
                <Checkbox.Control width={"1.5dvw"} height={"1.5dvw"}/>
                <Checkbox.Label fontSize={"var(--font-size-subtitle)"}>Mapa Satelital</Checkbox.Label>
            </Checkbox.Root>

        </div>
    );
}

export default Toolbar;