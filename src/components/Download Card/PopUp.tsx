import { Button } from "@chakra-ui/react";
import { defaultViewState, useAppContext } from "../../context/AppContext";
import { MdOutlineFolderOpen } from "react-icons/md";
import { downloadPdf } from "../../utils/downloadFile";
import './PopUp.scss'
import Card from "../Landing/Card/Card";
import DownloadSummary from "./DownloadSummary";
import DownloadReport from "/assets/Icono DOWNLOAD.png"

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
        <div className="popUp" >
            <Card 
                content={DownloadSummary({ setPopUp })}
                setSelectedItem={setPopUp}
                downloadButton={
                    <Button type="button" className="downloadButton" onClick={handleDownload} >
                        <img src={DownloadReport} className="img" />
                    </Button>
                }
            />
        </div>
    )
}

export default PopUp;