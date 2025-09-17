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

    constructor({ opacity = 0.7, colors = ["#f4f9ff", "#08316b"] }: {
    opacity?: number;
    colors?: string[];
  }) {
    this.opacity = opacity;
    this.colors = colors;
  }


    getLayer(data: any, field: string, isPointLayer: boolean, handleClick?: (info: any) => void) {
        let getColor: any;
        let mappedData: number[] = data.features.map((item: any) => { return item.properties[field] });
        mappedData = mappedData.filter((value) => value !== null && value !== undefined && !isNaN(value));
        
        // si recibe field (property) para alguna modificacion en la visualizacion
        if (field) {
            const minVal = Math.min(...mappedData) || 0;
            const maxVal = Math.max(...mappedData) || 0;
            this.minVal = minVal;
            this.maxVal = maxVal;
            
            const domain = [
            minVal,
            ...Array.from({ length: this.colors.length - 2 },
                (_, i) => minVal + (maxVal - minVal) * (i + 1) / (this.colors.length - 1)),
            maxVal,
            ];
                
            // color map
            this.colorMap = scaleLinear<string>().domain(domain).range(this.colors);
    

    
            const positiveAvg = mappedData.filter(n => n > 0).reduce((sum, n) => sum + n, 0) / mappedData.filter(n => n > 0).length;
            const negativeAvg = mappedData.filter(n => n < 0).reduce((sum, n) => sum + n, 0) / mappedData.filter(n => n < 0).length;
    
            this.positiveAvg = positiveAvg;
            this.negativeAvg = negativeAvg;
            
            
            
            getColor = (feature: any): [number, number, number, number] => {
                const item = feature.properties[field];
                const rgbValue = color(this.colorMap(item))?.rgb();
                return rgbValue ? [rgbValue.r, rgbValue.g, rgbValue.b, 100] : [255, 255, 255, 150];
            }
        } else {
            getColor = (feature: any): [number, number, number, number] => {
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
            id: `complementary-${field}`,
            data: data,
            pickable: handleClick ? true : false,
            filled: true,
            getFillColor: getColor,
            getLineColor: [255, 255, 255, 180],
            getRadius: isPointLayer ? f => {
                const value = f.properties.release;
                return value ? Math.sqrt(value) * 10 : 4;
            } : undefined,
            pointRadiusMinPixels: isPointLayer ? 4 : undefined,
            pointRadiusMaxPixels: isPointLayer ? 60 : undefined,
            onHover: (info) => {
                if (info.object) {
                    // Mostrar tooltip
                    handleClick?.(info);
                } else {
                    // Ocultar tooltip
                    handleClick?.(null);
                }
            }
        });
    }
}