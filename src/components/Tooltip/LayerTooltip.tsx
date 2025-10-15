import { Table } from "@chakra-ui/react";
import { useAppContext } from "../../context/AppContext";
import "./Tooltip.scss";
import { FaCheck } from "react-icons/fa6";
import { useEffect } from "react";


const LayerTooltip = () => {
    const { layerTooltip, jsonData } = useAppContext();


    if (!layerTooltip) return null;
    const industry = jsonData ? jsonData[layerTooltip.content.ID] : null;

    return (
        <div className="tooltip" style={{ left: layerTooltip.x, top: layerTooltip.y }} >
            {/*Math.round(layerTooltip.content.release) + " kg"*/}
            <p className="tooltip__title"> {layerTooltip.content.ID} </p>
            <Table.Root className="table" showColumnBorder>
                <Table.Header style={{ backgroundColor: "var(--background-dark)" }}>
                    <Table.Row className="table__row">
                        <Table.ColumnHeader className="table__header" style={{color: "white"}}> Contaminante </Table.ColumnHeader>
                        <Table.ColumnHeader className="table__header" style={{color: "white"}}> On-Site </Table.ColumnHeader>
                        <Table.ColumnHeader className="table__header" style={{color: "white"}}> Off-Site </Table.ColumnHeader>
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
                        <Table.Cell className="table__footer" style={{ fontWeight: "bold" }}> Total (kg) </Table.Cell>
                        <Table.Cell className="table__footer" style={{ fontWeight: "bold" }}> {industry.total_releases["On-site releases"]} </Table.Cell>
                        <Table.Cell className="table__footer" style={{ fontWeight: "bold" }}> {industry.total_releases["Off-site releases"]} </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table.Root>
        
        </div>
    );
}

export default LayerTooltip;