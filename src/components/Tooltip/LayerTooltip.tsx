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
            {/*Math.round(layerTooltip.content.release) + " kg"*/}
            <p className="tooltip__title"> {layerTooltip.content.industries.join(", ")} </p>
            <Table.Root className="table" showColumnBorder>
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
                                {industry.risks["On-site releases"][risk] === true ? <FaCheck /> : ""}
                            </Table.Cell>
                            <Table.Cell>
                                {industry.risks["Off-site releases"][risk] === true ? <FaCheck /> : ""}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                    <Table.Row>
                        <Table.Cell className="table__footer" style={{ fontWeight: "bold" }}> Total emitidos </Table.Cell>
                        <Table.Cell className="table__footer" style={{ fontWeight: "bold" }}> {Math.round(industry.total_releases["On-site releases"]).toLocaleString()} kg </Table.Cell>
                        <Table.Cell className="table__footer" style={{ fontWeight: "bold" }}> {Math.round(industry.total_releases["Off-site releases"]).toLocaleString()} kg </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table.Root>
        
        </div>
    );
}

export default LayerTooltip;