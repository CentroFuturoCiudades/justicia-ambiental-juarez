import React from "react"
import "./Legend.scss"
import { scaleLinear } from "d3-scale";
import { LAYERS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";
import { text } from "d3";

type LegendProps = {
  title: string;
  colors: string[];
  decimalPlaces?: number;
  categorical?: boolean;
  categories?: string[];
  ranges: number[][] | number[] | string[];
  formatValue: (value: number) => string;
  isPointLayer?: boolean;
  textRanges?: string[];
  scaleType?: string;
};

// receives rgb values from colorRange(uses SchemeBlues) and range boundaries from colorScale(uses scaleQuantile)
const Legend = ({ ranges, title, colors, formatValue, categorical, isPointLayer, textRanges, scaleType }: LegendProps) => {
  

  const { selectedLayer, mapLayerInstance, tematicaData } = useAppContext();
  const selectedLayerData = selectedLayer ? LAYERS[selectedLayer as keyof typeof LAYERS] : undefined;
  const themeKey = selectedLayerData?.tematica;

   if (!ranges || ranges.length === 0) return null;
   if(!mapLayerInstance) return null;
    //if(!layer) return null;
    if(!tematicaData) return null;
    //if(title === "Industrias contaminantes") return null;

  // construct the amount of colors based on the colors provided
  const domain = categorical ? ranges.map((category, index) => category) : ranges.map((range) => range[1]);
  const colorMap = scaleLinear<string>().domain(domain).range(colors);

  const renderLegeindItem = (value: number[] | number | string, index: number,) => {

    const rangeText = categorical ? value : `${formatValue(value[0])} - ${formatValue(value[1])}`;

    return (
      <div key={index} className="legend-ranges__item">
        {rangeText}
      </div>
    );
  }

  const linearGradient = `linear-gradient(to bottom, ${Array.from({ length: ranges.length }, (_, i) => `${colorMap(domain[i])} ${i * 100 / ranges.length}%`).join(", ")})`;

  const gradientStyle: React.CSSProperties = {
    background: linearGradient,
    //width: "2vw",
    //height: 'auto',
    //borderRadius: '0.3dvw',
  };

  return (
    <div className={`legend legend--${themeKey}`} key={selectedLayerData?.title}>
      <div className={`legend__title legend__title--${themeKey}`}>
        {title}
      </div>
      <div className="legend-body" >
        {categorical || scaleType === "quantile" ?
          <div className="categoricalStyle">
            {ranges.map((category, index) => {
              return (
                <div
                  key={index}
                  className={`categoricalStyle__box `}
                  style={{
                    backgroundColor: colors[index % colors.length],
                    borderRadius: isPointLayer ? '50%' : '0',
                  }}
                />
              );
            })}
          </div>
        : <div  className="gradientStyle" style={gradientStyle}></div> }
        <div className="legend-ranges" >
          {textRanges ? 
            textRanges.map((text, index) => (
              <div key={index} className="legend-ranges__item">
                {text}
              </div>
            )) 
          : ranges?.length > 0 && ranges.map((value, index) => renderLegeindItem(value, index))} 
        </div>
      </div>
    </div>
  );
}

export default Legend;