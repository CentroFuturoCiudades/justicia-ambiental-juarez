import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { Button } from "@chakra-ui/react";
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
}

const Toolbar = ({ rangeGraphRef, deck, map, setPopUp }: DownloadProps) => {
    const navigate = useNavigate();
    const { selectedLayer } = useAppContext();
    return (
        <div className="button-row">

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
                    />
                </>
            }

        </div>
    );
}

export default Toolbar;