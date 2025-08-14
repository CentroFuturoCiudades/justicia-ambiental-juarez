import { GeoJsonLayer } from "@deck.gl/layers";
import { color, rgb } from "d3";
import Legend from "./../components/Legend/Legend";
import RangeGraph from "../components/RangeGraph/RangeGraph";
import { COLORS } from "../utils/constants";
import { scaleLinear } from "d3-scale";
import { formatNumber } from "../utils/utils";


export class MapLayer {
  opacity: number;
  maxVal = 0;
  minVal = 0;
  positiveAvg = 0;
  negativeAvg = 0;

  isLineLayer?: boolean;
  formatValue: (value: number) => string;

  colors: string[];
  amountOfColors: number;
  colorMap: any;
  legend: any = null;
  title: string;
  graphImage?: string;
  deckImage?: string;
  theme?: string;
  selectedAvg = 0;
  selectedDescription = "";


  constructor({ opacity = 0.7, colors = ["#f4f9ff", "#08316b"], title = "Map Layer", amountOfColors = 6, formatValue, ref = null, theme = "default" }: {
    opacity?: number;
    colors?: string[];
    title?: string;
    amountOfColors?: number;
    formatValue?: (value: number) => string;
    ref?: React.RefObject<HTMLDivElement> | null;
    theme?: string;
  }) {
    this.opacity = opacity;
    this.colors = colors;
    this.title = title;
    this.amountOfColors = amountOfColors;
    this.formatValue = formatValue || ((value: number) => formatNumber(value, 2));
    this.ref = ref;
    this.theme = theme;
  }

  async loadData(url: string) {
    const data = await fetch(url);
    return await data.json();
  }

  getLayer = (data: any, field: string, isLineLayer: boolean, trimOutliers: boolean, handleFeatureClick: (info: any) => void, selectedAGEBS: string[] = []): GeoJsonLayer => {

    this.isLineLayer = true;
    var getColor: any;

    if (field) {
      var mappedData: number[] = data.features.map((item: any) => { return item.properties[field] });
      mappedData = mappedData.filter((value) => value !== null && value !== undefined && !isNaN(value));
      /*if( trimOutliers ){
        mappedData = this.trimOutliers( mappedData );
      }*/
      const minVal = Math.min(...mappedData) || 0;
      const maxVal = Math.max(...mappedData) || 0;
      this.maxVal = maxVal;
      this.minVal = minVal;

      //creas domain
      const domain = [
        minVal,
        ...Array.from({ length: this.colors.length - 2 },
          (_, i) => minVal + (maxVal - minVal) * (i + 1) / (this.colors.length - 1)),
        maxVal,
      ];

      // color map
      this.colorMap = scaleLinear<string>().domain(domain).range(this.colors);


      this.legend = {
        title: this.title,
        categories: this.colors.map((color, i) => ({
          label: domain[i].toFixed(2),
          color,
          value: domain[i].toFixed(2)
        }))
      };

      const positiveAvg = mappedData.filter(n => n > 0).reduce((sum, n) => sum + n, 0) / mappedData.filter(n => n > 0).length;
      const negativeAvg = mappedData.filter(n => n < 0).reduce((sum, n) => sum + n, 0) / mappedData.filter(n => n < 0).length;

      this.positiveAvg = positiveAvg;
      this.negativeAvg = negativeAvg;



      getColor =
        (feature: any): [number, number, number] => {

          // const isSelected = selectedAGEBS.some(f => f === feature.properties.cvegeo);
          // if (isSelected) {
          //   return [34, 139, 34]; // green color for selected features
          // }

          const item = feature.properties[field];
          const rgbValue = color(this.colorMap(item))?.rgb();
          return rgbValue ? [rgbValue.r, rgbValue.g, rgbValue.b] : [255, 255, 255];

        }
    } else {
      getColor = (feature: any): [number, number, number] => {
        const bg = [255, 255, 255];
        const [r, g, b] = [200, 200, 200]; // Always returns RGBColor

        return [
          Math.round((1 - this.opacity) * bg[0] + this.opacity * r),
          Math.round((1 - this.opacity) * bg[1] + this.opacity * g),
          Math.round((1 - this.opacity) * bg[2] + this.opacity * b)
        ];
        //return [240, 240, 240]; 
      }
    }

    const geojsonLayer = new GeoJsonLayer({
      id: "geojson-layer",
      data: data,
      pickable: true,
      filled: true,
      stroked: true,
      opacity: this.opacity,
      getFillColor: getColor,
      autoHighlight: true,
      highlightColor: [250, 200, 0, 100],
      getLineColor: [255, 255, 255, 255],
      getLineWidth: 20,
      onClick: handleFeatureClick,
      updateTriggers: {
        getLineColor: [selectedAGEBS],
      }
    });

    return geojsonLayer;
  }

  getRanges = (amountOfColors: number = 6) => {
    const domain = Array.from({ length: amountOfColors }, (_, i) => this.minVal + (this.maxVal - this.minVal) * (i) / amountOfColors);
    let quantiles = [this.minVal, ...domain, this.maxVal];
    quantiles = quantiles.filter((value, index, self) => self.indexOf(value) === index);

    return quantiles
      .slice(0, -1)
      .map((num, i) => [num, quantiles[i + 1]])
      .reverse(); // Reverse the order of the ranges
  }

  getColors = (amountOfColors: number = 6) => {
    const ranges = this.getRanges(amountOfColors);
    const min = this.minVal;
    const max = this.maxVal;
    const domain = [
      min,
      ...Array.from({ length: this.colors.length - 2 },
        (_, i) => min + (max - min) * (i + 1) / (this.colors.length - 1)),
      max,
    ];
    const colorMap = scaleLinear<string>().domain(domain).range(this.colors);
    const colors = ranges.map((range) => colorMap(range[1]));
    const validColors = colors.filter((color) => color !== undefined);
    return validColors.map((color) => rgb(color).formatHex());
  }

  getLegend = (title: string) => {
    if (!this.legend) return <></>;
    const ranges = this.getRanges();
    const completeColors = ranges.map((range) => this.colorMap(range[1]));

    return <Legend
      title={title}
      colors={completeColors}
      legendColor={COLORS.GLOBAL.backgroundDark}
      ranges={ranges}
      formatValue={this.formatValue || ((value: number) => value.toString())}
      categorical={false}
    />
  }

   getAverage(features: Feature[], selected: string[], property: string, key: string) : number {

      if (selected.length === 0) return this.positiveAvg;

      const idField = key === "agebs" ? "cvegeo" : "name";
      const values = features
      .filter((f: Feature) => selected.includes((f.properties as any)[idField]))
      .map(f => f.properties?.[property])
      .filter(value => value != null);
      const average = values.length > 0
        ? values.reduce((sum: number, num: number) => sum + num, 0) / values.length
        : 0;
      this.selectedAvg = average;

      return this.selectedAvg;
  }

  getDescription(selected: string[], title: string, key: string, average: string) {

    const singleSelected = key === "agebs" ? "El AGEB seleccionado tiene" : "La colonia seleccionada tiene";
    const multipleSelected = key === "agebs" ? "Los AGEBs seleccionados tienen" : "Las colonias seleccionadas tienen";
    let description = ""

    if (selected.length === 0) {
        description = `Ciudad Juárez tiene un ${title} de ${average}.`;
        this.selectedDescription = description;
        return (
          <>Ciudad Juárez tiene un {title} de <strong>{average}</strong>.</>
        );

    } else {
        description = `${selected.length == 1 ? singleSelected : multipleSelected} un ${title} de ${average}; por ${this.selectedAvg > this.positiveAvg ? "ENCIMA" : "DEBAJO"} de la media de Ciudad Juárez.`;
        this.selectedDescription = description;
        return (
          <>
            {selected.length === 1 ? singleSelected : multipleSelected} un {title} de <strong>{average}</strong>; por <strong>{this.selectedAvg > this.positiveAvg ? "ENCIMA" : "DEBAJO"}</strong> de la media de Ciudad Juárez.
          </>
        )
      }
  }

  getRangeGraph = (avg: number) => {
    const ranges = this.getRanges();
    const completeColors = ranges.map((range) => this.colorMap(range[1]));

    const Data = {
      minVal: this.minVal,
      maxVal: this.maxVal,
      negativeAvg: this.negativeAvg,
      positiveAvg: this.positiveAvg
    }

    return <RangeGraph
      data={Data}
      averageAGEB={avg}
      formatValue={this.formatValue || ((value: number) => value.toString())}
      colorsArray={completeColors}
    />
  }
}