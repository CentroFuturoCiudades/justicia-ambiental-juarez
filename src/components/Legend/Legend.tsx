import React from "react"
import "./Legend.scss"
import { scaleLinear } from "d3-scale";

type LegendProps = {
    title: string;
    colors: string[];
    data: { [ key: string ]: number };
    decimalPlaces?: number;
    positiveRange: number[][];
    negativeRange: number[][];
    legendColor: string;
    categorical: boolean;
};

// receives rgb values from colorRange(uses SchemeBlues) and range boundaries from colorScale(uses scaleQuantile)
const Legend = ({ 
  positiveRange,
  negativeRange,
  title, colors, data, decimalPlaces, legendColor, categorical }: LegendProps) => {

  // construct the amount of colors based on the colors provided
  const amountOfColors = 5;
  const min = data.minVal;
  const max = data.maxVal;
  const domain = Array.from({ length: amountOfColors }, (_, i) => min + (max - min) * (i + 1) / amountOfColors);
  const colorMap = scaleLinear<string>().domain(domain).range(colors);
 
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

  const renderLegeindItem = ( value: number[], index: number, ) => {

    const rangeText = `${ numberToString( value[ 1 ] ) } - ${ numberToString( value[0] ) }`;
    
    return ( <div key={index} className="legend-item" >
        <div className="legend-text" >{rangeText}</div>
    </div> );
  }

  const linearGradient = `linear-gradient(to top, ${Array.from({ length: amountOfColors }, (_, i) => `${colorMap(domain[i])} ${i * 100 / amountOfColors}%`).join(", ")})`;


  const gradientStyle: React.CSSProperties = {
    background: linearGradient,
    width: '20px', 
    height: 'auto',  
    borderRadius: '4px',
    marginRight: "1rem"
  };

  return (
    <div className="legend-container" style={{ border: `1px solid ${legendColor}` }}>
      <div className="legend__title-container" style={{ backgroundColor: legendColor }}>
        <h6 className="legend__title">{title}</h6>
      </div>
      <div className="legend-body" >
        {categorical ? <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              padding: "2px",
              background: "#fff",
              maxWidth: "80px"
            }}
          >
            {colors.map((color, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: color,
                  width: "20px",
                  height: "20px",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "2px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                }}
              />
            ))}
          </div>
        </> : <div style={gradientStyle}></div>}
        <div >
          { positiveRange?.length && positiveRange.map( ( value, index )=> renderLegeindItem( value, index ) ) }
          { negativeRange?.length ? negativeRange.map( ( value, index )=> renderLegeindItem( value, index ) ) : <></>}
        </div>
      </div>
     
    </div>
  );
}

export default Legend;