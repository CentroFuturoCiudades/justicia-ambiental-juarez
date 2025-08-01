import { formatNumber } from "../../utils/utils";
import "./RangeGraph.scss"
//import { interpolateRgb } from "d3-interpolate";
import { IoCaretDown } from "react-icons/io5";

type RangeGraph = {
    data: { [ key: string ]: number };
    averageAGEB: number;
    formatValue: (value: number) => string;
    colorsArray: string[];

};

const RangeGraph = ({ data, averageAGEB, formatValue, colorsArray}: RangeGraph) => {

  return (
    <div className="rangeGraph" style={{ width: "100%", padding: "8px" , position: "relative", marginTop: "25px", pointerEvents: "none"}}>

      {/* CONTENEDOR DE BARRA GRÁFICA */}
      <div className="rangeGraph__barContainer"
        style={{
          display: "flex",
          width: "100%",
          height: "34px",
        }}
      >
        {/* PROMEDIO DE AGEB INDICADOR */}
        <div className="rangeGraph__agebLabel" style={{
          left: `${((averageAGEB - data.minVal) / (data.maxVal - data.minVal)) * 100}%`,
          top: -17,
          position: "absolute",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          <p style={{ fontSize: "14px", fontWeight: "bold", lineHeight:"1"}}>
            {formatValue(averageAGEB)}
          </p>
          <IoCaretDown size={24} style={{ color: "red", display:"block"}} />
        </div>

        {/* PROMEDIO CIUDAD JUAREZ */}
        <div className="rangeGraph__average" style={{
          position: "absolute",
          top: 0,
          left: `${((data.positiveAvg - data.minVal) / (data.maxVal - data.minVal)) * 100}%`,
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          <div style={{
            width: "2px",
            height: "54px",
            background: "black",
            marginBottom: "4px",
          }}
          />
          <div style={{fontSize: "10px", whiteSpace: "nowrap", alignContent: "center", textAlign: "center", fontWeight: "bold"}}> 
            {formatValue(data.positiveAvg)}
            <br />
            Ciudad Juárez
          </div>
        </div>


        {/* DIVISIONES DE LA GRÁFICA */}
        {[...colorsArray].reverse().map((color, idx) => ( 
          <div
            key={idx}
            style={{
              flex: 1,
              background: color,
              height: "100%",
            }}
          />     
        ))}
      </div>

      {/* MIN Y MAX */}
      <div style={{ position: "relative", width: "100%", marginTop: "4px", height: "24px", }}>
        {[data.minVal, data.maxVal].map((value, index) => (
            <div
            key={index}
            style={{
                position: "absolute",
                left: `${((value - data.minVal) / (data.maxVal - data.minVal)) * 100}%`,
                transform: "translateX(-50%)",
                fontSize: "10px",
                textAlign: "center",
            }}
            >
            {formatValue(value)}
            <br />
            {(index === 0 ? "Menor" : "Mayor")}            
            </div>
        ))}
        </div>
    </div>
  );
}

export default RangeGraph;