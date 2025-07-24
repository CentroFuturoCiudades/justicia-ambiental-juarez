import "./RangeGraph.scss"
import { interpolateRgb } from "d3-interpolate";
import { IoCaretDown } from "react-icons/io5";

type RangeGraph = {
    startColor: string;
    neutralColor: string;
    endColor: string;
    positiveRange: number[][];
    negativeRange: number[][];
    data: { [ key: string ]: number };
    averageAGEB: number;
    decimalPlaces?: number;

};

const RangeGraph = ({ 
  startColor, neutralColor, endColor, positiveRange,
  negativeRange, data, averageAGEB, decimalPlaces }: RangeGraph) => {
    
    const numberToString = ( value: number ) => {
      if( value == undefined ) return ""

      if( decimalPlaces == undefined ) {
        decimalPlaces = 2;
      }

      if ( decimalPlaces == 0 ){
        value = Math.trunc( value )
      }

      if( value < 0 ){
        return `( ${ value.toLocaleString( "es-MX", { maximumFractionDigits: decimalPlaces, minimumFractionDigits: decimalPlaces }   ) })`
      } else {
        return value.toLocaleString( "es-MX", { maximumFractionDigits: decimalPlaces, minimumFractionDigits: decimalPlaces } )
      }
    }

    const allRanges = [
        ...(negativeRange || []),
        ...(positiveRange || [])
    ].slice().reverse();

    const getSegmentColor = (index: number) => {
        const total = allRanges.length;
        // empieza en endColor y termina en startColor
        return interpolateRgb(endColor, startColor)(index / Math.max(total - 1, 1));
    };

  return (
    <div className="rangeGraph" style={{ width: "100%", padding: "8px 0px" , position: "relative", marginTop: "25px", pointerEvents: "none"}}>

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
          width: "max-content",
          position: "absolute",
          transform: "translateX(-50%)",
          textAlign: "center",
          padding: "0%",
          display: "flex",
          flexDirection: "column",
          gap: "0px",
          alignItems: "center",
          margin: "0px",
        }}>
          <span style={{ fontSize: "14px", fontWeight: "bold", lineHeight:"1"}}>
            {numberToString(averageAGEB)}
          </span>
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
          <div style={{fontSize: "10px", whiteSpace: "nowrap", alignContent: "center", textAlign: "center"}}> 
            {numberToString(data.positiveAvg)}
            <br />
            Ciudad Juárez
          </div>
        </div>


        {/* DIVISIONES DE LA GRÁFICA */}
        {allRanges.map((_, idx) => ( 
          <div
            key={idx}
            style={{
              flex: 1,
              background: getSegmentColor(idx),
              borderRight: idx < allRanges.length - 1 ? `1px solid ${neutralColor}` : "none",
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
                width: "max-content",
                fontSize: "10px",
                color: "#333",
                top: 0,
                whiteSpace: "nowrap",
                textAlign: "center",
            }}
            >
            {numberToString(value)}
            <br />
            {(index === 0 ? "Menor" : "Mayor")}            
            </div>
        ))}
        </div>
    </div>
  );
}

export default RangeGraph;