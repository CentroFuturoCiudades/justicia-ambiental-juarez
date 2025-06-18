import React from "react"
import "./Legend.scss"

type LegendProps = {
    title: string;
    startColor: string;
    neutralColor: string;
    endColor: string;
    data: { [ key: string ]: number };
    decimalPlaces?: number;
    positiveRange: number[][];
    negativeRange: number[][];
};

// receives rgb values from colorRange(uses SchemeBlues) and range boundaries from colorScale(uses scaleQuantile)
const Legend = ({ 
  positiveRange,
  negativeRange,
  title, startColor, neutralColor, endColor, data, decimalPlaces }: LegendProps) => {
 
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
    
    return ( <div key={index} className="legend-item">
        <div className="legend-text">{rangeText}</div>
    </div> );
  }


  const gradientStyle: React.CSSProperties = {
    background: data.minVal < 0 
      ? `linear-gradient(to top, ${endColor} 0%, ${neutralColor} 50%, ${startColor} 100%)`
      : `linear-gradient(to top, ${endColor} 0%, ${startColor} 100%)`,
    width: '20px', 
    height: 'auto',  
    borderRadius: '4px',
    marginRight: "1rem"
  };

  return (
    <div className="legend-container">
      <h6 className="legend__title">{title}</h6>
      <div className="legend-body">
        <div style={gradientStyle}></div>
        <div >
          { positiveRange?.length && positiveRange.map( ( value, index )=> renderLegeindItem( value, index ) ) }
          { negativeRange?.length ? negativeRange.map( ( value, index )=> renderLegeindItem( value, index ) ) : <></>}
        </div>
      </div>
     
    </div>
  );
}

export default Legend;