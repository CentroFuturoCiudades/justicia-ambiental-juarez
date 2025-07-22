import { GeoJsonLayer } from "@deck.gl/layers";
import { ascending, color, interpolateRgb, interpolateRgbBasis, quantileSorted, quantize, rgb,  type ScaleQuantile, scaleQuantile } from "d3";
import Legend from "./../components/Legend/Legend";
import { COLORS } from "../utils/constants";

export class MapLayer {
    positiveColor: string;
    negativeColor: string;
    neutralColor: string = "#7e5215";
    opacity: number;
    maxVal = 0;
    minVal = 0;
    positiveAvg = 0;
    negativeAvg = 0;
    colorScalePos?: ScaleQuantile<number,never>;
    colorScaleNeg?: ScaleQuantile<number,never>;
    isLineLayer?: boolean;

    constructor( positiveColor: string, negativeColor: string, opacity: number, neutralColor?: string){
        this.positiveColor = positiveColor;
        this.negativeColor = negativeColor;
        this.opacity = opacity;

        if( neutralColor ) {
          this.neutralColor = neutralColor
        }
    }

    trimOutliers = (values: number[]) => {
      const sorted = values.slice().filter( value => value != null ).sort(ascending);
      
      const p5 = quantileSorted(sorted, 0.05) ?? sorted[0];
      const p99 = quantileSorted(sorted, 0.95) ?? sorted[sorted.length - 1];
    
      const filteredData = sorted.filter((value) => {
        return value >= p5 && value <= p99;
      } );
    
      return filteredData;
    }

    async loadData(url: string) {
      const data = await fetch(url);
      return await data.json();
    }

    getLayer = ( data: any, field: string, isLineLayer: boolean, trimOutliers: boolean ): GeoJsonLayer => {
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
      
        const positiveAvg = mappedData.filter(n => n > 0).reduce((sum, n) => sum + n, 0) / mappedData.filter(n => n > 0).length;
        const negativeAvg = mappedData.filter(n => n < 0).reduce((sum, n) => sum + n, 0) / mappedData.filter(n => n < 0).length;
      
        this.positiveAvg = positiveAvg;
        this.negativeAvg = negativeAvg;

        const positiveValues =  mappedData.filter(n => n > 0);
        const negativeValues =  mappedData.filter(n => n < 0);
      
        const rangeSize = 3;
      
        const positiveColors = quantize(
            interpolateRgb(
                this.neutralColor,
                this.positiveColor,
            ),
            rangeSize
        );
      
        const negativeColors = quantize(
          interpolateRgb(
              this.negativeColor,
              this.neutralColor
          ),
          rangeSize
        );
      
        const generalColors = quantize(
          interpolateRgbBasis(
            [
              this.negativeColor,
              this.positiveColor
            ]
          ),
          rangeSize * 2
        )
      
      
        const colorScale = minVal < 0 
          ? scaleQuantile()
              .domain( mappedData )
              .range([...Array(rangeSize * 2).keys()])
          : scaleQuantile()
              .domain( mappedData ) // Only consider positive range when no negatives
              .range([...Array( rangeSize * 2 ).keys()]); 
      
        this.colorScalePos = minVal < 0  
          ? scaleQuantile()
              .domain( positiveValues )
              .range([...Array( rangeSize ).keys()])
          : scaleQuantile()
              .domain( mappedData )
              .range([...Array( rangeSize * 2 ).keys()]);
      
        this.colorScaleNeg = minVal < 0 
          ? scaleQuantile() 
              .domain( negativeValues )
              .range([...Array( rangeSize ).keys()])
          : scaleQuantile() 
              .domain([ minVal, positiveAvg ])
              .range([...Array( rangeSize ).keys()]);

        getColor =
          (feature: any): [number, number, number] => {
            const item = feature.properties[field];
            let rgbValue;

            if( this.colorScaleNeg != undefined && this.colorScalePos != undefined){

              if( minVal >= 0 ){
                const colorIndex = this.colorScalePos( item ) ;
                rgbValue = color( generalColors[ colorIndex ])?.rgb();
              } else {
                if( item > 0 ){
                  const colorIndex = this.colorScalePos(item);
                  rgbValue = color(positiveColors[ colorIndex ])?.rgb();
                } else {
                  const colorIndex = this.colorScaleNeg(item);
                  rgbValue = color(negativeColors[ colorIndex ])?.rgb();
                }
              }
            }
      
            return rgbValue ? [rgbValue.r, rgbValue.g, rgbValue.b] : [255, 255, 255];
          }
        } else {
          getColor = (feature: any): [number, number, number] => {
            const bg = [255, 255, 255];
            const { r, g, b } = rgb( this.neutralColor ); // Always returns RGBColor
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
        });
    
        return geojsonLayer;
    }

    getRanges = (colorScale: ScaleQuantile<number, never>, isPositive: boolean) => {
      let minRange = isPositive ? (this.minVal > 0 ? this.minVal : 0) : (this.minVal < 0 ? this.minVal : 0);
      let quantiles = [minRange, ...colorScale.quantiles(), isPositive ? this.maxVal : 0];
    
      return quantiles
        .slice(0, -1)
        .map((num, i) => [num, quantiles[i + 1]])
        .reverse(); // Reverse the order of the ranges
    };

    getLegend = ( title: string ) => {

      if( !this.colorScaleNeg || !this.colorScalePos )
        return <></>;

      const Data = {
        minVal: this.minVal,
        maxVal: this.maxVal,
        negativeAvg: this.negativeAvg,
        positiveAvg: this.positiveAvg
      }

      return <Legend
        title={ title } 
        colors={ [this.positiveColor, this.neutralColor] }
        legendColor={COLORS.GLOBAL.backgroundDark}
        positiveRange={ this.getRanges( this.colorScalePos, true) }
        negativeRange={ this.minVal < 0 ? this.getRanges( this.colorScaleNeg, false ) : [] }
        data={ Data }
        decimalPlaces={ this.isLineLayer ? 2 : 0 }
      />
    }
}