
//lista de savedInstances
// -title
// -agrupar por theme
// -selected average
// - capas complementarias
//- agebs seleccionados

import { Button } from "@chakra-ui/react";
import { defaultViewState, useAppContext } from "../../context/AppContext";
import { IoIosCloseCircle } from "react-icons/io";
import { MdOutlineFolderOpen } from "react-icons/md";
import { downloadPdf } from "../../utils/downloadFile";
import CloseIcon from "/assets/Icono CERRAR.png"
import { CAPAS_BASE } from "../../utils/constants";
import './PopUp.scss'
import { useEffect } from "react";





const PopUp = ({deck, map, setPopUp}) => {

    const { mapLayers,setMapLayers, setViewState} = useAppContext();

    return (
        <div className="popUp" style={{
                position: "absolute",
                top: "10%",
                left: "2vw",
                width: "40dvw",
                height: "40dvw", 
                maxWidth: "90vw",
                maxHeight: "90vh",
                backgroundColor: "white",
                zIndex: 100,
                display: "flex",
                flexDirection: "column",
                padding: "2dvh",
                border: "1px solid black",
                paddingBottom: "10dvh",
            }}>
            <p className="title">| descargas |</p>

            <div style={{ overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column", gap: "2dvh" }}>

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
         
                        <Button type="button"  style={{ borderRadius: "50%", padding: 0, height: "6vh", backgroundColor: "transparent" }}
                            onClick={() => {
                                setMapLayers(prev => prev.filter((_, i) => i !== index));
                                setPopUp(false);
                            }} variant="ghost"  
                        >
                            <img src={CloseIcon} alt="Cerrar" className="body__closeIcon" />
                        </Button>
                    </div>
                ))}
            </div>

            {/*boton de descarga*/}
            <Button className="download-button"onClick={() => {
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

            <Button type="button" className="body__closeButton" onClick={() => {setPopUp(false) }} variant="ghost" p={0} minW={0} height="auto" top={"0.1dvh"} right={"0.1dvh"}>
                <img src={CloseIcon} alt="Cerrar" className="body__closeIcon" />
            </Button>
        </div>
    )
}

export default PopUp;