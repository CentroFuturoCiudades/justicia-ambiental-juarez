import React from "react"
import "./Legend.scss"
import { scaleLinear } from "d3-scale";
import { LAYERS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";

type LegendProps = {
  title: string;
  colors: string[];
  decimalPlaces?: number;
  categorical?: boolean;
  categories?: string[];
  ranges: number[][] | number[] | string[];
  formatValue: (value: number) => string;
};

// receives rgb values from colorRange(uses SchemeBlues) and range boundaries from colorScale(uses scaleQuantile)
const Legend = ({ ranges, title, colors, formatValue, categorical, categories }: LegendProps) => {
  //console.log("colors:", colors);

  const { selectedLayer } = useAppContext();
  const selectedLayerData = selectedLayer ? LAYERS[selectedLayer as keyof typeof LAYERS] : undefined;
  const themeKey = selectedLayerData?.tematica;

  // construct the amount of colors based on the colors provided
  const domain = categorical ? ranges.map((category, index) => category) : ranges.map((range) => range[1]);
  const colorMap = scaleLinear<string>().domain(domain).range(colors);

  const renderLegeindItem = (value: number[] | number | string, index: number,) => {

    const rangeText = categorical ? value : `${formatValue(value[1])} - ${formatValue(value[0])}`;

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
    <div className={`legend legend--${themeKey}`}>
      <div className={`legend__title legend__title--${themeKey}`}>
        {title}
      </div>
      <div className="legend-body">
        {categorical ?
          <div className="categoricalStyle">
            {ranges.map((category, index) => {
              return (
                <div
                  key={index}
                  className="categoricalStyle__box"
                  style={{
                    backgroundColor: colors[index % colors.length]
                  }}
                />
              );
            })}
          </div>
        : <div  className="gradientStyle" style={gradientStyle}></div> }
        <div className="legend-ranges">
          {ranges?.length && ranges.map((value, index) => renderLegeindItem(value, index))}
        </div>
      </div>
    </div>
  );
}

export default Legend;