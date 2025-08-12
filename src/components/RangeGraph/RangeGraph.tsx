import { formatNumber } from "../../utils/utils";
import { IoCaretDown } from "react-icons/io5";

type RangeGraph = {
    data: { [ key: string ]: number };
    averageAGEB: number;
    formatValue: (value: number) => string;
    colorsArray: string[];

};

//estilos in line para la conversion a imagen
const RangeGraph = ({ data, averageAGEB, formatValue, colorsArray}: RangeGraph) => {

  return (
    <div style={{ position: "relative"}}>

      {/* promedio cd juarez */}
      {(() => {
        const percent = ((data.positiveAvg - data.minVal) / (data.maxVal - data.minVal)) * 100;
        const style: React.CSSProperties = {
          position: "absolute",
          bottom: 0,
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          padding: "0 2vw",
          alignContent: "center",
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
              width: "0.15vw",
              height: "54px",
              background: "black",
              marginBottom: "4px",
            }} />
            <div style={{
              fontSize: "10px",
              whiteSpace: "nowrap",
              alignContent: "center",
              textAlign: "center",
              fontWeight: "bold"
            }}>
              {formatValue(data.positiveAvg)}
              <br />
              Ciudad Juárez
            </div>
          </div>
        );
      })()}
      <div style={{height: "30px"}}>
        {/* PROMEDIO DE AGEB */}
        {averageAGEB && !isNaN(averageAGEB) && (() => {
          const percent = ((averageAGEB - data.minVal) / (data.maxVal - data.minVal)) * 100;
          const style: React.CSSProperties = {
            position: "absolute",
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 2,
            fontSize: "14px",
            fontWeight: "bold",
            //lineHeight: "1",
            
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
            <div style={{
              width: "100%",
              height: "40px",
              position: "relative",
              padding: "0 8px",
            }}>
              <div className="rangeGraph__agebLabel" 
                style={
                  style
                }>
                  <p style={{ fontSize: "14px", fontWeight: "bold", lineHeight:"1"}}>
                    {formatValue(averageAGEB)}
                  </p>
                  <IoCaretDown size={24} style={{ color: "red", display:"block"}} />
              </div>
          </div>
          );
        })()}
      </div>



      <div >
        
        {/* CUADRITOS */}
        <div style={{
            display: "flex",
            width: "100%",
            height: "100%",
            padding: "0 8px",
            marginBottom: "8px",
          }}>
          {[...colorsArray].reverse().map((color, idx) => ( 
            <div
              key={idx}
              style={{
                flex: 1,
                background: color,
                height: "30px",
              }}
            />
          ))}
        </div>
        { /* mayor y menor */}
      <div style={{  display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        {[data.minVal, data.maxVal].map((value, index) => (
          <div
            key={index}
            style={{
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

      
      
    </div>
  )
}

export default RangeGraph;