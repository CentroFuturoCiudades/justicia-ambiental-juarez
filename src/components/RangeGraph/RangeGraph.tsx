import Triangle from "/assets/Traingulito.png";
import { useMediaQuery } from '@chakra-ui/react';

type RangeGraph = {
    data: { [ key: string ]: number };
    averageAGEB: number;
    formatValue: (value: number) => string;
    colorsArray: string[];
    selectedCount: number;

};

// Estilos in line para la conversion a imagen con html2canvas
const RangeGraph = ({ data, averageAGEB, formatValue, colorsArray, selectedCount }: RangeGraph) => {

  const [isMobile] = useMediaQuery('(max-width: 800px)');

  //if (!data || !data.positiveAvg) return null;
  return (
    <div style={{ 
      height: "auto",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      //border: '1px solid green',
    }}>
      {/* INDICADOR de promedio de la selección */}
      {averageAGEB !=null && selectedCount > 0 && (() => {
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
          //style.alignItems = "flex-start";
          style.alignItems = "center";
        } else if (percent >= 90) {
          style.right = 0;
          style.transform = "none";
          //style.alignItems = "flex-end";
          style.alignItems = "center";
        } else {
          style.left = `calc(${percent}% )`;
          style.transform = "translateX(-50%)";
        }
        
        return (
          <div style={{ position: "relative", width: "100%", height: isMobile ? "min(5dvh, 10dvw)" : "min(4.3dvh, 2.5dvw)"}}>
            <div style={ style }>
                <p style={{fontWeight: 700, fontSize: "var(--font-size-body)", lineHeight: "1"}}>{formatValue(averageAGEB)}</p>
                <span style={{ height: isMobile ? "min(4dvh, 6dvw)" : "1.5dvw", transform: "translateY(20%)" }}>
                  <img src={Triangle} style={{ width: "100%", height: "100%", objectFit: "cover"}}/>
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
          height: isMobile ? "min(10dvh, 14dvw)" : "min(5.5dvh, 3.2dvw)",
          padding: "0 1dvw",
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
              width: "max-content",
            };

            if (percent <= 5) {
              style.left = '1dvw'; //extreme min
              style.transform = "none";
            } else if (percent >= 98) {
              style.right = '1.1dvw'; //extreme max
              style.transform = "none";
              style.alignItems = "flex-end";
            }
            else if (percent >= 90) { 
              style.right = 0; //extreme max
              style.transform = "none";
            } else {
              style.left = `${percent}%`;
              style.transform = "translateX(-50%)";
            }

            return (
              <div style={style}>
                <div style={{
                  width: isMobile ? "0.5dvw" : "0.14dvw",
                  height: isMobile ? "calc(min(10dvh, 14dvw) + min(4.1dvh, 2.8dvw))" : "calc(min(5.5dvh, 3.2dvw) + min(3.1dvh, 1.8dvw))",
                  background: "black",
                  marginTop: isMobile ? "calc(-0.5 * min(4.1dvh, 2.8dvw))" : "calc(-0.5 * min(3.1dvh, 1.8dvw))"
                }}/>
                  <div style={{
                    fontSize: "var(--font-size-button)",
                    fontWeight: "300",
                    alignContent: percent >= 98 ? "flex-end" : "center",
                    textAlign: percent >= 98 ? "right" : "center",
                    marginTop: "min(1.5dvh, 0.8dvw)",
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
              paddingTop: isMobile ? "min(0.8dvh, 1dvw)" : "min(0.5dvh, 0.2dvw)",
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