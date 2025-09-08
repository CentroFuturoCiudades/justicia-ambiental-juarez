import { Button } from "@chakra-ui/react";
import { defaultViewState, useAppContext } from "../../context/AppContext";
import { MdOutlineFolderOpen } from "react-icons/md";
import { downloadPdf } from "../../utils/downloadFile";
import { CAPAS_BASE } from "../../utils/constants";
import './PopUp.scss'
import Card from "../Landing/Card/Card";
import { IoClose } from "react-icons/io5";



const downloadSummary = (mapLayers, setMapLayers, setPopUp) => (
    <div style={{ display: "flex", flexDirection: "column"}}>
        <p className="title">| descargas |</p>
        {mapLayers.map((instance, index) => (
            <div style={{ borderBottom: "1px solid black", display: "flex", flexDirection: "row", justifyContent: "space-between" , alignItems: "center"}} key={index}>
                <div style={{display: "flex", flexDirection: "column", padding: "1dvh"}}>
                    <div key={index} style={{ fontWeight: "bold" }}>
                        {instance.title}
                    </div>
                            
                    <div style={{ paddingLeft: "1dvh" }}>
                        {instance.selected.length > 0 && (
                            
                            <div >
                                <p>Temática: {instance.theme}</p>
                                <p>Promedio: {instance.formatValue(instance.selectedAvg)}</p>
                                <h3>{instance.activeKey === "colonias" ? "Colonias Seleccionadas:" : "AGEBS Seleccionadas:"}</h3>
                                <ul style={{ paddingLeft: "1dvh" }}>
                                    {instance.selected.map((colonia: any, idx: number) => (
                                        <li key={idx}>{colonia}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {instance.complementarias.length > 0 && (
                            <div>
                                <h3>Capas Complementarias:</h3>
                                <ul style={{ paddingLeft: "1dvh" }}>
                                    {instance.complementarias.map((capa: any, idx: number) => {
                                        const capaObj = CAPAS_BASE[capa as keyof typeof CAPAS_BASE];
                                        const titulo = capaObj ? capaObj.title : capa;
                                        return <li key={idx}>{titulo}</li>;
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
         
                <Button type="button" className="popUp-button" style={{ borderRadius: "50%", padding: 0, height: "6vh", backgroundColor: "transparent" }}
                    onClick={() => {
                        setMapLayers(prev => prev.filter((_, i) => i !== index));
                        if(mapLayers.length === 1){
                            setPopUp(false);
                        }
                    }} variant="ghost"  
                >
                    <IoClose />
                </Button>
            </div>
        ))}
    </div>
);

const downloadButton = (setViewState, deck, map, mapLayers) => (
    <Button type="button" className="downloadButton" onClick={() => {
            setViewState({
                ...defaultViewState,
                transitionDuration: 0,
            } as any);
            setTimeout(() => {
                    downloadPdf(deck, map, mapLayers);
                //downlaodFile("/assets/Template Reporte.pdf", "Template Reporte.pdf");
            }, 100);
        }} >
        <MdOutlineFolderOpen/>
    </Button>
);

const PopUp = ({deck, map, setPopUp}) => {

    const { mapLayers,setMapLayers, setViewState} = useAppContext();

    return (
        <div className="popUp" style={{
                position: "absolute",
                top: "10%",
                left: "2vw",
                width: "40dvw",
                height: "64dvh", 
                display: "flex",
            }}>
                <Card content={downloadSummary(mapLayers, setMapLayers, setPopUp)} setSelectedItem={setPopUp} downloadButton={downloadButton(setViewState, deck, map, mapLayers)}/>
        </div>
    )
}

export default PopUp;