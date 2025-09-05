//import { MdArrowDropDown } from "react-icons/md";
import ARROW_DOWN from "/assets/ARROW_DOWN_test.png"


type RangeGraph = {
    data: { [ key: string ]: number };
    averageAGEB: number;
    formatValue: (value: number) => string;
    colorsArray: string[];

};

// Estilos in line para la conversion a imagen con html2canvas
const RangeGraph = ({ data, averageAGEB, formatValue, colorsArray}: RangeGraph) => {

  return (
    <div style={{ 
      height: "auto",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}>
      {/* INDICADOR de promedio de la selección */}
      {averageAGEB && !isNaN(averageAGEB) && (() => {
        const percent = ((averageAGEB - data.minVal) / (data.maxVal - data.minVal)) * 100;
        const style: React.CSSProperties = {
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 2,
          height: "100%",
          justifyContent: "space-between",
        };

        if (percent <= 5) {
          style.left = 0;
          style.transform = "none";
          style.alignItems = "flex-start";
        } else if (percent >= 90) {
          style.right = 0;
          style.transform = "none";
          style.alignItems = "flex-end";
        } else {
          style.left = `calc(${percent}% )`;
          style.transform = "translateX(-50%)";
        }
        
        return (
          <div style={{ position: "relative", width: "100%", height: "4.5dvh"}}>
            <div style={ style }>
                <p style={{fontWeight: 700, fontSize: "var(--font-size-body)", lineHeight: "1"}}>{formatValue(averageAGEB)}</p>
                {/*<MdArrowDropDown style={{ color: "var(--close-button)", width: "3vw", height: "3vw", border: "1px solid red"}}/>*/}
                <span style={{ height: "1vw" }}>
                  <img src={ARROW_DOWN} style={{ width: "100%", height: "100%", objectFit: "cover"}}/>
                </span>
            </div>
          </div>
        );
      })()}

      {/* BARRA DE COLOR */}
      <div style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "5.5dvh",
          padding: "0 1vw",
          position: "relative",
      }}>

          {/* LINEA - Promedio Cd. Juárez */}
          {(() => {
            const percent = ((data.positiveAvg - data.minVal) / (data.maxVal - data.minVal)) * 100;
            const style: React.CSSProperties = {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "absolute",
              zIndex: 1,
            };

            if (percent <= 0) {
              style.left = 0;
              style.transform = "none";
            } else if (percent >= 100) {
              style.right = 0;
              style.transform = "none";
            } else {
              style.left = `${percent}%`;
              style.transform = "translateX(-50%)";
            }

            return (
              <div style={style}>
                <div style={{
                  width: "0.14vw",
                  height: "8.5dvh",
                  background: "black",
                  marginTop: "-1.5vh",
                }}/>
                  <div style={{
                    fontSize: "var(--font-size-button)",
                    fontWeight: "300",
                    alignContent: "center",
                    textAlign: "center",
                    marginTop: "1vh",
                    lineHeight: "1",
                  }}>
                    {formatValue(data.positiveAvg)}
                    <br />
                    Ciudad Juárez
                  </div>
              </div>
            );
          })()}

          {/* SEGMENTOS DE COLOR */}
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

      { /* LABELS - mayor y menor*/}
      <div style={{ 
        display: "flex", 
        flexDirection: "row", 
        justifyContent: "space-between",
      }}>
        {[data.minVal, data.maxVal].map((value, index) => (
          <div
            key={index}
            style={{
              fontSize: "var(--font-size-button)",
              fontWeight: "300",
              textAlign: "center",
              lineHeight: "1",
              paddingTop: "0.8vh",
            }}
          >
            {formatValue(value)}
            <br />
            {(index === 0 ? "Menor" : "Mayor")}
          </div>
        ))}
      </div>
    </div>      
  )
}

export default RangeGraph;