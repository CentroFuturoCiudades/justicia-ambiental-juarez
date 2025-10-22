import { Table } from "@chakra-ui/react";
import { useAppContext } from "../../context/AppContext";
import "./Tooltip.scss";
import { FaCheck } from "react-icons/fa6";
import { useEffect } from "react";


const LayerTooltip = () => {
    const { layerTooltip, layerInfoData, mapLayerInstance } = useAppContext();


    if (!layerTooltip || !layerInfoData){
        console.log("no layerTooltip or no layerInfoData or no mapLayerInstance");
        return null;
    }
    console.log("layerinfoData", layerInfoData);
    const jsonForLayer = layerInfoData[layerTooltip.layerKey || selectedLayer];
    const industry = jsonForLayer ? jsonForLayer[layerTooltip.content.ID] : null;

    return (
        <div className="tooltip" style={{ left: layerTooltip.x, top: layerTooltip.y }} >
            <p className="tooltip__title"> 
                {layerTooltip.content.industries.map((industry, index) => (
                    <span key={index}>
                        {industry}
                        <br />
                    </span>
                ))}
            </p>
            <table className="custom-table">
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left'}}> Tipo de contaminante </th>
                        <th> En el sitio </th>
                        <th> Fuera del sitio </th>
                    </tr>
                </thead>
                <tbody>
                    {industry && Object.keys(industry.risks["On-site releases"]).map((risk) => (
                        <tr key={risk} >
                            <td >{risk}</td>
                            <td style={{ textAlign: 'center'}}>
                                <div  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    {industry.risks["On-site releases"][risk] === true ? <FaCheck /> : ""}
                                </div>
                            </td>
                            <td>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    {industry.risks["Off-site releases"][risk] === true ? <FaCheck /> : ""}
                                </div>
                            </td>
                        </tr>
                    ))}
                    <tr style={{ borderBottom:'none'}}>
                        <td className="table__footer" style={{ textAlign: "left" }}> Total emitidos </td>
                        <td className="table__footer" > {Math.round(industry.total_releases["On-site releases"]).toLocaleString()} kg </td>
                        <td className="table__footer" > {Math.round(industry.total_releases["Off-site releases"]).toLocaleString()} kg </td>
                    </tr>
                </tbody>
            </table>
        
        </div>
    );
}

export default LayerTooltip;