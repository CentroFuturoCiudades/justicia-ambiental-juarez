import { GeoJsonLayer } from "@deck.gl/layers";
import { ascending, color, rgb } from "d3";
import Legend from "./../components/Legend/Legend";
import RangeGraph from "../components/RangeGraph/RangeGraph";
import { COLORS } from "../utils/constants";
import { scaleLinear } from "d3-scale";


export class MapLayer {
    opacity: number;
    colors: string[];
    colorMap: any;
    legend: any = null;
    maxVal = 0;
    minVal = 0;
    title: string ;
    amountOfColors: number;
    isLineLayer?: boolean;
    positiveAvg = 0;
    negativeAvg = 0;

    constructor( {opacity = 0.7, colors = ["#93c7ed", "#9fe3d6", "#ffdd75", "#ff6f61", "#ff4c4c"], title= "Map Layer", amountOfColors = 6} : {opacity?: number, colors?: string[], title?: string, amountOfColors?: number} ) {
        this.opacity = opacity;
        this.colors = colors;
        this.title = title;
        this.amountOfColors = amountOfColors;
    }

    async loadData(url: string) {
      const data = await fetch(url);
      return await data.json();
    }

    getLayer = ( data: any, field: string, isLineLayer: boolean, handleFeatureClick: (info: any) => void, selectedAGEBS: string[] = [] ): GeoJsonLayer => {
      
      this.isLineLayer = isLineLayer;
      let getColor: any;

      if( field ){

        const mappedData: number[] = data.features.map((item: any)=>{ return item.properties[field] });
        /*if( trimOutliers ){
          mappedData = this.trimOutliers( mappedData );
        }*/
        const minVal = Math.min(...mappedData) || 0;
        const maxVal = Math.max(...mappedData) || 0; 
        this.maxVal =  maxVal;
        this.minVal = minVal;

        const domain = [
          minVal,
          ...Array.from({ length: this.colors.length - 2 },
            (_, i) => minVal + (maxVal - minVal) * (i + 1) / (this.colors.length - 1)),
          maxVal,
        ];

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



        getColor = (feature: any): [number, number, number] => {

          if (selectedAGEBS.includes(feature.properties.cvegeo)) {
            return [34, 139, 34];
          }
          const item = feature.properties[field];
          const rgbValue = color(this.colorMap(item))?.rgb();
          return rgbValue ? [rgbValue.r, rgbValue.g, rgbValue.b] : [255, 255, 255];

        }

        } else {
          getColor = (feature: any): [number, number, number] => {
            const bg = [255, 255, 255];
            const [r, g, b] = [200,200,200]; // Always returns RGBColor

            return [
              Math.round((1 - this.opacity) * bg[0] + this.opacity * r),
              Math.round((1 - this.opacity) * bg[1] + this.opacity * g),
              Math.round((1 - this.opacity) * bg[2] + this.opacity * b)
            ];
          }
        }

        const geojsonLayer = new GeoJsonLayer({
          id: "geojson-layer",
          data: data,
          pickable: true,
          filled: true,
          stroked: true,
          opacity: this.opacity,
          getFillColor: !isLineLayer ? getColor : [255,255,255,200],
          getLineColor: isLineLayer ? getColor : [255, 255, 255, 200],
          getLineWidth: isLineLayer ? 100 : 16,
          onClick: handleFeatureClick,
          updateTriggers: {
            getFillColor: [selectedAGEBS]
          }
        });
    
        return geojsonLayer;
    }


    getRanges = () => {
      const domain = Array.from({ length: this.amountOfColors }, (_, i) => this.minVal + (this.maxVal - this.minVal) * (i) / this.amountOfColors);
      let quantiles = [this.minVal, ...domain, this.maxVal];
      quantiles = quantiles.filter((value, index, self) => self.indexOf(value) === index);

      return quantiles
        .slice(0, -1)
        .map((num, i) => [num, quantiles[i + 1]])
        .reverse(); // Reverse the order of the ranges
    };
    

    getLegend(title: string) {        
      if (!this.legend) return <></>;
      const ranges = this.getRanges();
      const completeColors = ranges.map((range) => this.colorMap(range[1]));
      
      return (
        <Legend
          title={title}
          colors={completeColors}
          legendColor={COLORS.GLOBAL.backgroundDark}
          ranges={ranges}
          decimalPlaces={2}
          categorical={false}
        />
      );
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
        data={ Data }
        averageAGEB={ avg }
        decimalPlaces={ 2 }
        colorsArray={ completeColors }
      />
    }
}