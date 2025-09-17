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

  const renderLegeindItem = (value: number[] | number, index: number,) => {

    const rangeText = categorical ? 
      `${formatValue(value)} - ${categories && categories[index] ? categories[index] : ""}`
      : `${formatValue(value[1])} - ${formatValue(value[0])}`;

    return (
      <div key={index} className="legend-body__item">
        {rangeText}
      </div>
    );
  }

  const linearGradient = `linear-gradient(to bottom, ${Array.from({ length: ranges.length }, (_, i) => `${colorMap(domain[i])} ${i * 100 / ranges.length}%`).join(", ")})`;
  //const linearGradient = `linear-gradient(to top, ${Array.from({ length: ranges.length }, (_, i) => `${colorMap(domain[ranges.length - 1 - i])} ${i * 100 / ranges.length}%`).join(", ")})`;

  const gradientStyle: React.CSSProperties = {
    background: linearGradient,
    width: "2vw",
    height: 'auto',
    borderRadius: '0.3dvw',
  };

  return (
    <div className={`legend legend--${themeKey}`}>
      <div className={`legend__title legend__title--${themeKey}`}>
        {title}
      </div>
      <div className="legend-body">
        {categorical ? <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              //gap: "0.5dvh",
              //padding: "6px",
              //background: "#fff",
              maxWidth: "80px"
            }}
          >
            {ranges.map((category, index) => {
              //const mid = (min + max) / 2 || min;
              //const color = colorMap(mid);
              return (
                <div
                  key={index}
                  style={{
                    //backgroundColor: color,
                    backgroundColor: colors[index % colors.length],
                    width: "min(2dvh, 1dvw)",
                    height: "min(2dvh, 1dvw)",
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: "2px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                  }}
                />
              );
            })}
          </div>
        </> : <div style={gradientStyle}></div>}
        <div className="legend-ranges">
          {ranges?.length && ranges.map((value, index) => renderLegeindItem(value, index))}
        </div>
      </div>
    </div>
  );
}

export default Legend;