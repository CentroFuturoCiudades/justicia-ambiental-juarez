import { useAppContext } from "../../context/AppContext";
import { Button } from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";

const DownloadSummary = ( setPopUp : any ) => {
    const { mapLayers, setMapLayers } = useAppContext();

    return (
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
                                    <p> {instance.selected.join(", ")} </p>
                                </div>
                            )}
                            {/*instance.complementarias.length > 0 && (
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
                            )*/}
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
    )
}

export default DownloadSummary;