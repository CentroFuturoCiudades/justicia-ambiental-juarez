import { Table } from "@chakra-ui/react";
import { useAppContext } from "../../context/AppContext";
import "./Tooltip.scss";
import { FaCheck } from "react-icons/fa6";
import { useEffect } from "react";


const LayerTooltip = () => {
    const { layerTooltip, jsonData, mapLayerInstance } = useAppContext();


    if (!layerTooltip || !jsonData || !mapLayerInstance) return null;
    const industry = jsonData ? jsonData[layerTooltip.content.ID] : null;

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
            {/*<Table.Root className="table" border={'none'}>
                <Table.Header style={{ backgroundColor: "var(--background-dark)" }}>
                    <Table.Row className="table__row">
                        <Table.ColumnHeader className="table__header" style={{color: "white"}}> Tipo de contaminante </Table.ColumnHeader>
                        <Table.ColumnHeader className="table__header" style={{color: "white"}}> En el sitio </Table.ColumnHeader>
                        <Table.ColumnHeader className="table__header" style={{color: "white"}}> Fuera del sitio </Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {industry && Object.keys(industry.risks["On-site releases"]).map((risk) => (
                        <Table.Row key={risk} className="table__row" >
                            <Table.Cell >
                                {risk}
                            </Table.Cell>
                            <Table.Cell>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    {industry.risks["On-site releases"][risk] === true ? <FaCheck /> : ""}
                                </div>
                            </Table.Cell>
                            <Table.Cell>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    {industry.risks["Off-site releases"][risk] === true ? <FaCheck /> : ""}
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                    <Table.Row border={'none'}>
                        <Table.Cell className="table__footer" style={{ fontWeight: "bold" }}> Total emitidos </Table.Cell>
                        <Table.Cell className="table__footer" style={{ fontWeight: "bold", textAlign: "center" }}> {Math.round(industry.total_releases["On-site releases"]).toLocaleString()} kg </Table.Cell>
                        <Table.Cell className="table__footer" style={{ fontWeight: "bold", textAlign: "center" }}> {Math.round(industry.total_releases["Off-site releases"]).toLocaleString()} kg </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table.Root>*/}
        
        </div>
    );
}

export default LayerTooltip;