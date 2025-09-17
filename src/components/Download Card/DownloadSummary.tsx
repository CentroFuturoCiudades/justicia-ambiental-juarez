import { useAppContext } from "../../context/AppContext";
import { Button } from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";


const DownloadSummary = ( setPopUp : any ) => {
    const { mapLayers, setMapLayers } = useAppContext();

    return (
        <div className="downloadCard">
            <p className="title">| descarga |</p>
            {mapLayers.map((instance, index) => (
                <div className="downloadCard__item" key={index}>
                    <div className="downloadCard__content">
                        <p style={{ fontWeight: "bold", fontSize: "var(--font-size-subtitle)" }}>
                            {instance.title}
                        </p>
                                
                        <div style={{ paddingLeft: "1dvh" }}>
                            {instance.selected.length > 0 && (
                                
                                <div >
                                    <p> <strong>Temática: </strong>{instance.theme}</p>
                                    <p> <strong>Promedio: </strong>{instance.formatValue(instance.selectedAvg)}</p>
                                    <h3> <strong>{instance.activeKey === "colonias" ? "Colonias Seleccionadas:" : "AGEBS Seleccionadas:"}</strong></h3>
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
                
                    <Button type="button" className="downloadCard__close"
                        onClick={() => {
                            setMapLayers(prev => prev.filter((_, i) => i !== index));
                            if(mapLayers.length === 1){
                                setPopUp(false);
                            }
                        }}
                    >
                       <IoClose style={{ width: "2dvw", height: "2dvw" }}/>
                    </Button>
                </div>
            ))}
        </div>
    )
}

export default DownloadSummary;