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
  ranges: number[][];
  formatValue: (value: number) => string;
};

// receives rgb values from colorRange(uses SchemeBlues) and range boundaries from colorScale(uses scaleQuantile)
const Legend = ({ ranges, title, colors, formatValue, categorical }: LegendProps) => {

  const { selectedLayer } = useAppContext();
  const selectedLayerData = selectedLayer ? LAYERS[selectedLayer as keyof typeof LAYERS] : undefined;
  const themeKey = selectedLayerData?.tematica;

  // construct the amount of colors based on the colors provided
  const domain = ranges.map((range) => range[1]);
  const colorMap = scaleLinear<string>().domain(domain).range(colors);

  const renderLegeindItem = (value: number[], index: number,) => {

    const rangeText = `${formatValue(value[1])} - ${formatValue(value[0])}`;

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
              gap: "8px",
              padding: "6px",
              background: "#fff",
              maxWidth: "80px"
            }}
          >
            {ranges.map(([min, max], index) => {
              const mid = (min + max) / 2 || min;
              const color = colorMap(mid);
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: color,
                    width: "18px",
                    height: "18px",
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