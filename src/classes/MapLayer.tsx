import { GeoJsonLayer } from "@deck.gl/layers";
import { ascending, color, rgb } from "d3";
import Legend from "./../components/Legend/Legend";
import RangeGraph from "../components/RangeGraph/RangeGraph";
import { COLORS } from "../utils/constants";
import { scaleLinear } from "d3-scale";


export class MapLayer {
    opacity: number;
    maxVal = 0;
    minVal = 0;
    positiveAvg = 0;
    negativeAvg = 0;

    isLineLayer?: boolean;

    colors: string[];
    amountOfColors: number;
    colorMap: any;
    legend: any = null;
    title: string = "Map Layer";
    

    constructor(  opacity: number, colors = ["#93c7ed", "#9fe3d6", "#ffdd75"], amountOfColors = 6 ) {

        this.opacity = opacity;
        this.colors = colors;
        this.amountOfColors = amountOfColors;
    }

    async loadData(url: string) {
      const data = await fetch(url);
      return await data.json();
    }

    getLayer = ( data: any, field: string, isLineLayer: boolean, trimOutliers: boolean, handleFeatureClick: (info: any) => void, selectedAGEBS: string[] = [] ): GeoJsonLayer => {
      this.isLineLayer = true;
      var getColor: any;

      if( field ){
        var mappedData: number[] = data.features.map((item: any)=>{ return item.properties[field] });
        if( trimOutliers ){
          mappedData = this.trimOutliers( mappedData );
        }
        const minVal = Math.min(...mappedData) || 0;
        const maxVal = Math.max(...mappedData) || 0; 
        this.maxVal =  maxVal;
        this.minVal = minVal;

        //creas domain
        const domain = [
          minVal,
          ...Array.from({ length: this.colors.length - 2 },
            (_, i) => minVal + (maxVal - minVal) * (i + 1) / (this.colors.length - 1)),
          maxVal,
        ];

        // color map
        const colorMap = scaleLinear<string>().domain(domain).range(this.colors);
        this.colorMap = colorMap;
        

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

            const isSelected = selectedAGEBS.some(f => f === feature.properties.cvegeo); 
            if (isSelected) {
              return [34, 139, 34];
            }

            const item = feature.properties[field];
            const rgbValue = color(this.colorMap(item))?.rgb();
            return rgbValue ? [rgbValue.r, rgbValue.g, rgbValue.b] : [255, 255, 255];

          }
        } else {
          getColor = (feature: any): [number, number, number] => {
            const bg = [255, 255, 255];
            const { r, g, b } = rgb( this.colors[0] ); // Always returns RGBColor
            if (!color) throw new Error("Invalid color");
          
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