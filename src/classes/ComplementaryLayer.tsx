import { GeoJsonLayer } from "deck.gl";
import { scaleLinear } from "d3-scale";
import { color } from "d3";
import { Tooltip } from "../components/ui/tooltip";



export class ComplementaryLayer {
    opacity: number;
    maxVal = 0;
    minVal = 0;
    positiveAvg = 0;
    negativeAvg = 0;
    colors: string[];
    colorMap: any;
    title: string = "";

    constructor({ opacity = 0.7, colors = ["#f4f9ff", "#08316b"], title = "" }: {
    opacity?: number;
    colors?: string[];
    title?: string;
  }) {
    this.opacity = opacity;
    this.colors = colors;
    this.title = title;
  }

  async loadData(url: string) {
    const data = await fetch(url);
    return await data.json();
  }


    getLayer(data: any, field: string, isPointLayer: boolean, isLineLayer: boolean, handleClick?: (info: any) => void, categoryColors?: any, units?: string, lineWidth?: number, radius?: number): GeoJsonLayer {
        //console.log('data', data);
        let getColor: any;
        let mappedData: number[] = data.features.map((item: any) => { return item.properties[field] });
        mappedData = mappedData.filter((value) => value !== null && value !== undefined && !isNaN(value));
        
        // si recibe field (property) para alguna modificacion en la visualizacion
        if (field) {
            const minVal = Math.min(...mappedData) || 0;
            const maxVal = Math.max(...mappedData) || 0;
            this.minVal = minVal;
            this.maxVal = maxVal;
            
            const domain = this.colors.length > 1 ? [
                minVal,
                ...Array.from({ length: this.colors.length - 2 },
                    (_, i) => minVal + (maxVal - minVal) * (i + 1) / (this.colors.length - 1)),
                maxVal,
            ] : [minVal, maxVal];

            if(categoryColors) {
                this.colorMap = (value: string) => categoryColors[value] || "#cccccc";
                console.log('category colormap', this.colorMap);
            }else {
                this.colorMap = scaleLinear<string>().domain(domain).range(this.colors);
            }
    

    
            const positiveAvg = mappedData.filter(n => n > 0).reduce((sum, n) => sum + n, 0) / mappedData.filter(n => n > 0).length;
            const negativeAvg = mappedData.filter(n => n < 0).reduce((sum, n) => sum + n, 0) / mappedData.filter(n => n < 0).length;
    
            this.positiveAvg = positiveAvg;
            this.negativeAvg = negativeAvg;
            
            
            
            getColor = (feature: any): [number, number, number, number] => {
                const item = feature.properties[field];
                const rgbValue = this.colors.length === 1 ? color(this.colors[0])?.rgb() : color(this.colorMap(item))?.rgb();
                const alpha = Math.round(this.opacity * 255);
                return rgbValue ? [rgbValue.r, rgbValue.g, rgbValue.b, alpha] : [255, 255, 255, 150];
            }
        } else {
            getColor = (feature: any): [number, number, number, number] => {
                
                if (this.colors.length === 1) {
                    const rgbValue = color(this.colors[0])?.rgb();
                    const alpha = Math.round(this.opacity * 255);
                    return rgbValue ? [rgbValue.r, rgbValue.g, rgbValue.b, alpha] : [255, 255, 255, 150];
                }
                const bg = [96, 96, 96]; //si no recibe property field, pone gris claro, escoger otro color?
                const [r, g, b] = [200, 200, 200]; // Always returns RGBColor

                return [
                Math.round((1 - this.opacity) * bg[0] + this.opacity * r),
                Math.round((1 - this.opacity) * bg[1] + this.opacity * g),
                Math.round((1 - this.opacity) * bg[2] + this.opacity * b),
                255
                ];
            }
        }
        
        
        return new GeoJsonLayer({
            id: `complementary-${this.title}`,
            data: data,
            pickable: handleClick ? true : false,
            filled: isLineLayer ? false : true,
            stroked: true,
            getFillColor: getColor,
            //getLineColor: [255, 255, 255, 180],
            getLineColor: getColor,
            getLineWidth: lineWidth ? lineWidth : (feature: any) => {
                const item = feature.properties[field];
                return item ? item * 2: 3;
            },
            lineWidthUnits:  units === "meters" ? 'meters' : 'pixels',
            getPointRadius: radius ? radius : 2,
            pointRadiusUnits: 'pixels',
            onClick: handleClick,
        });
    }
}