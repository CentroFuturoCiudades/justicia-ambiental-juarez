import { Button } from "@chakra-ui/react";
import { defaultViewState, useAppContext } from "../../context/AppContext";
import { MdOutlineFolderOpen } from "react-icons/md";
import { downloadPdf } from "../../utils/downloadFile";
import './PopUp.scss'
import Card from "../Landing/Card/Card";
import DownloadSummary from "./DownloadSummary";

type PopupProps = {
    deck: React.RefObject<HTMLDivElement>;
    map: React.RefObject<HTMLDivElement>;
    setPopUp: any;
}

const PopUp = ({deck, map, setPopUp} : PopupProps) => {

    const { mapLayers, setViewState } = useAppContext();
    const handleDownload = () => {
        setViewState({
            ...defaultViewState,
            transitionDuration: 0,
        } as any);
        setTimeout(() => {
            downloadPdf(deck, map, mapLayers);
            //downlaodFile("/assets/Template Reporte.pdf", "Template Reporte.pdf");
        }, 100);
    }

    return (
        <div className="popUp" style={{
                position: "absolute",
                top: "10%",
                left: "2vw",
                width: "40dvw",
                height: "64dvh", 
                display: "flex",
                zIndex: 10,
            }}>
                <Card 
                    content={DownloadSummary({ setPopUp })}
                    setSelectedItem={setPopUp}
                    downloadButton={
                        <Button type="button" className="downloadButton" onClick={handleDownload} >
                            <MdOutlineFolderOpen/>
                        </Button>
                    }
                />
        </div>
    )
}

export default PopUp;