import { formatNumber } from "../../utils/utils";
import { IoCaretDown } from "react-icons/io5";

type RangeGraph = {
    data: { [ key: string ]: number };
    averageAGEB: number;
    formatValue: (value: number) => string;
    colorsArray: string[];

};

const RangeGraph = ({ data, averageAGEB, formatValue, colorsArray}: RangeGraph) => {

  return (
    <div style={{ position: "relative", border: "1px solid red"}}>

      {/* promedio cd juarez */}
      {(() => {
        const percent = ((data.positiveAvg - data.minVal) / (data.maxVal - data.minVal)) * 100;
        const style: React.CSSProperties = {
          position: "absolute",
          border: "1px solid green",
          bottom: 0,
          //top: 5,
          //marginTop: "25px",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          padding: "0 8px",
          alignContent: "center",
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
              width: "2px",
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
      <div style={{border: "1px solid blue", height: "40px"}}>
        {/* PROMEDIO DE AGEB */}
        {averageAGEB && !isNaN(averageAGEB) && (() => {
          const percent = ((averageAGEB - data.minVal) / (data.maxVal - data.minVal)) * 100;
          const style: React.CSSProperties = {
            position: "absolute",
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            //border: "1px solid blue",
            zIndex: 2,
            fontSize: "14px",
            fontWeight: "bold",
            lineHeight: "1",
            
          };

          if (percent <= 5) {
            style.left = "0px"; // padding izquierdo
            style.transform = "none";
            style.alignItems = "flex-start";
          } else if (percent >= 90) {
            style.right = "0px"; // padding derecho
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
              //border: "1px solid red",
              //height: "auto",
              //paddingRight: "8rem"
              //padding: "0 8px",
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



      <div style={{  border: "1px solid purple"}}>
        
        {/* CUADRITOS */}
        <div style={{
            display: "flex",
            width: "100%",
            height: "100%",
            padding: "0 8px",
            //height: "44px",
            //height: "auto",
            //padding: "0 8px",
            //border: "1px solid red",
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

/*
return (
    <div style={{ 
      //width: "100%", 
      padding: "8px 0px" , 
      position: "relative", 
      pointerEvents: "none",
      marginTop: "25px",
      border: "1px solid red"
      }}
    >
      

       CONTENEDOR DE BARRA GRÁFICA 
      <div className="rangeGraph__barContainer"
        style={{
          display: "flex",
          width: "100%",
          height: "44px",
          //height: "auto",
          padding: "0 8px",
          border: "1px solid green",
        }}
      >
         PROMEDIO DE AGEB INDICADOR 
        {averageAGEB && !isNaN(averageAGEB) && 
          <div className="rangeGraph__agebLabel" 
          style={{
            left: `${((averageAGEB - data.minVal) / (data.maxVal - data.minVal)) * 100}%`,
            top: -17,
            position: "absolute",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid blue",
          }}>
          <p style={{ fontSize: "14px", fontWeight: "bold", lineHeight:"1"}}>
            {formatValue(averageAGEB)}
          </p>
          <IoCaretDown size={24} style={{ color: "red", display:"block"}} />
        </div>}

         PROMEDIO CIUDAD JUAREZ 
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
            height: "50px",
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


         DIVISIONES DE LA GRÁFICA 
        {[...colorsArray].reverse().map((color, idx) => ( 
          <div
            key={idx}
            style={{
              flex: 1,
              background: color,
              height: "80%",
            }}
          />     
        ))}
      </div>

       MIN Y MAX 
      <div style={{ position: "relative", width: "100%", marginTop: "0px", height: "24px", }}>
        {/*[data.minVal, data.maxVal].map((value, index) => (
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
        ))
        {/* Menor 
        <div
          style={{
            position: "absolute",
            left: 0,
            transform: "none",
            fontSize: "10px",
            textAlign: "left",
          }}
        >
          {formatValue(data.minVal)}
          <br />
          Menor
        </div>
        {/* Mayor 
        <div
          style={{
            position: "absolute",
            right: 0,
            transform: "none",
            fontSize: "10px",
            textAlign: "right",
          }}
        >
          {formatValue(data.maxVal)}
          <br />
          Mayor
        </div>
        </div>
    </div>
  );
  */