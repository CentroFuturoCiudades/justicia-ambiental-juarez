import { HoverCard } from "@chakra-ui/react";

const InfoTooltip = () => {
    return (
  <div
    style={{
      position: "absolute",
      bottom: "5dvh", // ajusta según lo que necesites
      left: "2dvw",
      background: "white",
      border: "1px solid #ccc",
      padding: "8px",
      borderRadius: "4px",
      width: "20dvw"
    }}
  >
    Las Islas de Calor ... Estas se calculan a partir de ... A mayor XX, mayor XXX
  </div>
    );
};

export default InfoTooltip;