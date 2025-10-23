import { GeoJsonLayer } from "@deck.gl/layers";
import { color, min, range, rgb, selection } from "d3";
import Legend from "./../components/Legend/Legend";
import RangeGraph from "../components/RangeGraph/RangeGraph";
import { scaleLinear, scaleOrdinal, scaleQuantile, scaleThreshold } from "d3-scale";
import { formatNumber } from "../utils/utils";
import { ascending, interpolateRgb, interpolateRgbBasis, quantileSorted, quantize} from "d3";

export class MapLayer {
  opacity: number;
  maxVal = 0;
  minVal = 0;
  positiveAvg = 0;
  negativeAvg = 0;
  averageJuarez = 0; // igual a positiveAvg
  absTotal_property = 0;
  absTotal_juarez = 0;

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
  categorical?: boolean;
  //categoryLabels?: any;
  categoryLegend?: any;
  domain?: number[];
  scaleType?: string;
  thresholds?: number[];


  constructor({ opacity = 0.7, colors = ["#f4f9ff", "#08316b"], title = "Map Layer", theme = "default", amountOfColors = 6, formatValue, categorical = false, categoryLegend = [], scaleType = "linear", thresholds = [] }: {
    opacity?: number;
    colors?: string[];
    title?: string;
    theme?: string;
    amountOfColors?: number;
    formatValue?: (value: number) => string;
    categorical?: boolean;
    //categoryLabels?: any;
    categoryLegend?: any;
    scaleType?: string;
    thresholds?: number[];
  }) {
    this.opacity = opacity;
    this.colors = colors;
    this.title = title;
    this.theme = theme;
    this.amountOfColors = amountOfColors;
    this.formatValue = formatValue || ((value: number) => formatNumber(value, 2));
    this.categorical = categorical;
    //this.categoryLabels = categoryLabels;
    this.categoryLegend = categoryLegend;
    this.scaleType = scaleType;
    this.thresholds = thresholds;
  }

  async loadData(url: string) {
    const data = await fetch(url);
    return await data.json();
  }

  // Elimina outliers
  trimOutliers = (values: number[]) => {
    const sorted = values.slice().filter( value => value != null ).sort(ascending);
    
    const p5 = quantileSorted(sorted, 0.05) ?? sorted[0];
    const p99 = quantileSorted(sorted, 0.95) ?? sorted[sorted.length - 1];
  
    const filteredData = sorted.filter((value) => {
      return value >= p5 && value <= p99;
    } );
  
    return filteredData;
  }

  //get domain (for lineal and quantile scales)
  getDomain = (mappedData: number[]) => {
    let domain;
    if(this.scaleType === "linear"){ //lineal domain [min, max]
      domain = [
          this.minVal,
          ...Array.from({ length: this.colors.length - 2 },
            (_, i) => this.minVal + (this.maxVal - this.minVal) * (i + 1) / (this.colors.length - 1)),
          this.maxVal,
        ];
    } else if (this.thresholds && this.thresholds.length > 0) { //quantile domain (thresholds)
      domain = this.thresholds;
    } else { //quantile domain (every value)
      domain = mappedData;
    }
    return domain;
  }

  //get color map (for lineal and quantile scales)
  getColorMap = (domain: number[]) => {
    let colorMap;
    if(this.scaleType === "linear"){
      colorMap = scaleLinear<string>().domain(domain).range(this.colors);
    } else if (this.thresholds && this.thresholds.length > 0) {
      //console.log('entro al elseif thresholds colormap', this.thresholds.length - 1 === this.colors.length);
      colorMap = scaleThreshold<number, string>().domain(domain).range(this.colors);
    } else {
      colorMap = scaleQuantile<string>().domain(domain).range(this.colors);
    }
    return colorMap;
  }

  getLayer = (data: any, field: string, is_PointLayer: boolean, trimOutliers: boolean, handleFeatureClick: (info: any) => void, selectedAGEBS: string[] = [], selectionMode: string | null, isPickable: boolean): GeoJsonLayer => {
    //this.isLineLayer = true;
    let getColor: any;
    const featuresForStats = data.allFeatures;
    const categorias = Array.from(
      new Set(featuresForStats.map((f: any) => f.properties[field]))
    ).filter((c) => c != null);

    if (field) {
      let mappedData: any[] = featuresForStats.map((item: any) => item.properties[field]);
      mappedData = mappedData.filter((value) => value !== null && value !== undefined);

      /*if( trimOutliers ){
        mappedData = this.trimOutliers( mappedData );
      }*/

      //get min and max
      const minVal = Math.min(...mappedData) || 0;
      const maxVal = Math.max(...mappedData) || 0;
      this.maxVal = maxVal;
      this.minVal = minVal;

      //creas domain
      if (this.categorical && this.categoryLegend) {
        this.legend = {
          title: this.title,
          categories: this.categoryLegend
        }
        this.colorMap = (value: any) => {
          const category = this.categoryLegend.find((cat: any) => cat.value === value);
          return category ? category.color : "#ccc"; // color por defecto
        };
      }
      else {
        //not categorical
       // console.log('it had thresholds:', this.thresholds);
        this.domain = this.getDomain(mappedData);
        //console.log('Domain:', this.domain);

        //colormap
        this.colorMap = this.getColorMap(this.domain);

        this.legend = {
          title: this.title,
          categories: this.colors.map((color, i) => ({
            label: this.domain[i],
            color,  
            value: this.domain[i]
          }))
        };
      }
      const positiveAvg = mappedData.filter(n => n > 0).reduce((sum, n) => sum + n, 0) / mappedData.filter(n => n > 0).length;
      this.positiveAvg = positiveAvg;
      //const negativeAvg = mappedData.filter(n => n < 0).reduce((sum, n) => sum + n, 0) / mappedData.filter(n => n < 0).length;
      //this.negativeAvg = negativeAvg;


      getColor =
        (feature: any): [number, number, number, number?] => {

          const item = feature.properties[field];

          //para valores de 0, poner gris claro
          /*if (item == 0) {
            return [230, 230, 230, 200]; //gris con poca opacidad
          }*/
          const rgbValue = color(this.colorMap(item))?.rgb();
          const opacityFirstRange = this.scaleType === "quantile" && item <= this.colorMap.domain()[0] ? 200 : 255;
          return rgbValue ? [rgbValue.r, rgbValue.g, rgbValue.b, opacityFirstRange] : [255, 255, 255, 255];
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
      //pickable: true,
      pickable: (selectionMode === "radius" || !isPickable) ? false : true,
      filled: true,
      stroked: true,
      opacity: this.opacity,
      getFillColor: getColor,
      autoHighlight: true,
      highlightColor: [250, 200, 0, 100],
      getLineColor: [255, 255, 255, 255],
      getPointRadius: is_PointLayer ? 3 : undefined,
      pointRadiusUnits: is_PointLayer ? 'pixels' : undefined,
      //pointRadiusMinPixels: is_PointLayer ? 6 : undefined,
      //pointRadiusMaxPixels: is_PointLayer ? 50 : undefined,
      getLineWidth: !is_PointLayer ? 20 : undefined,
      onClick: handleFeatureClick,
      updateTriggers: {
        getLineColor: [selectedAGEBS],
      }
    });

    return geojsonLayer;
  }

  getRanges = (amountOfColors: number = 6) => {
    let quantiles: number[] = [];
    if(this.scaleType === "linear"){
        const domain = Array.from({ length: amountOfColors }, (_, i) => this.minVal + (this.maxVal - this.minVal) * (i) / amountOfColors);
        quantiles = [this.minVal, ...domain, this.maxVal];
        quantiles = quantiles.filter((value, index, self) => self.indexOf(value) === index);
    } else if (this.thresholds && this.thresholds.length > 0) {
      quantiles = [this.minVal, ...this.thresholds, this.maxVal];
    }
    else {
      quantiles = this.colorMap.quantiles();
      quantiles = [this.minVal, ...quantiles, this.maxVal];
    }

  //pares de rangos (inicio y fin) y revierte el orden
  return quantiles
    .slice(0, -1)
    .map((num, i) => [num, quantiles[i + 1]])
    .reverse(); // Opcional: invertir el orden si es necesario
  }

  getColors = (amountOfColors: number = 6) => {
    const ranges = this.getRanges(amountOfColors);
    if(this.scaleType === "linear"){
      const domain = [
        this.minVal,
        ...Array.from({ length: this.colors.length - 2 },
          (_, i) => this.minVal + (this.maxVal - this.minVal) * (i + 1) / (this.colors.length - 1)),
        this.maxVal,
      ];
      const colorMap = scaleLinear<string>().domain(domain).range(this.colors);
      //const colors = ranges.map((range) => colorMap(range[1]));
      //const validColors = colors.filter((color) => color !== undefined);
      //return validColors.map((color) => rgb(color).formatHex());
      return ranges.map((range)=> colorMap(range[1]));
    } else {
      return ranges.map((range) => this.colorMap(range[1]));
      //return colors.filter((color) => color !== undefined).map((color) => rgb(color).formatHex());
    }
    /*const min = this.minVal;
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
    return validColors.map((color) => rgb(color).formatHex());*/
    // Mapea cada rango al color correspondiente en el colorMap
  //const colors = ranges.map((range) => this.colorMap(range[1]));

  // Filtra colores válidos y conviértelos a formato hexadecimal
  //return colors.filter((color) => color !== undefined).map((color) => rgb(color).formatHex());
  }

  //no me gusta que getlegend se llama cada vez que selecciono una ageb/colonia
  getLegend = (title: string, isPointLayer: boolean, legendTitle: string, textRanges?: string[]) => {
    if (!this.legend) return <></>;
    const ranges = this.categorical ? [...this.legend.categories].reverse() : this.getRanges() ;
    //console.log('Generating legend with ranges:', ranges);

    let completeColors, legendRanges;
    if (this.categorical) {
        completeColors = ranges.map(cat => cat.color);
        legendRanges = ranges.map(cat => cat.label);
    } else {
        //console.log('colors,', this.colors);
        //console.log('Legend ranges:', ranges);
        //completeColors = ranges.map((range) => this.colorMap(range[1]));
        completeColors = this.scaleType === "quantile" ? ranges.map((_, i) => this.colors[i]).reverse() : ranges.map((range) => this.colorMap(range[1]));
       // console.log('Legend colors:', completeColors);
        legendRanges = ranges;
    }

    return <Legend
      title={legendTitle ? legendTitle : title}
      colors={completeColors}
      ranges={legendRanges}
      formatValue={this.formatValue || ((value: number) => value.toString())}
      categorical={this.categorical}
      isPointLayer={isPointLayer}
      textRanges={textRanges}
      scaleType={this.scaleType}
    />
  }

   getAverage(features: Feature[], selected: string[], property: string, key: string, totalJuarez: any, filterFn: boolean) : number {
    
    //si recibe propertyAbsolute, es que quiere el promedio diferente (suma de propertyAbsolute / total juarez * 100)

    //const filteredFeatures = filterFn ? features.filter(f => f.properties.indice_bienestar === Math.trunc(this.positiveAvg)) : features;
    //console.log("filteredFeatures", filteredFeatures); //todos los features con indice de marginacion igual al promedio positivo 2

    this.absTotal_juarez = totalJuarez ? totalJuarez(features, this.positiveAvg) : 0; //total juarez
    //console.log('total juarez', this.absTotal_juarez);



    // suma de la property de todas las features (AGEBS/Colonias)
    this.absTotal_property = totalJuarez ? features.reduce((sum: number, f: Feature) => {
      const value = f.properties?.[property];
      return sum + value;
    }, 0) : 0;
    //console.log('en juarez hay un total de', this.absTotal_juarez, 'hogares y la suma de', property, 'es de', this.absTotal_property);
    this.averageJuarez = totalJuarez ? (this.absTotal_property / this.absTotal_juarez) * 100 : this.positiveAvg;

    // If no selected AGEBS/Colonias, return overall average
    if (selected.length === 0){
      return this.averageJuarez;
    }

    //If there are selected AGEBS/Colonias, get their average
    const idField = key === "agebs" ? "index" : "nombre";
    console.log("selected", selected);

    const selectedValues = features
    .filter((f: Feature) => selected.includes((f.properties as any)[idField]))
    //.filter(f => f.properties?.[property] != null)

    console.log("selectedvalues", selectedValues);

    const sum = selectedValues.reduce((sum: number, f: Feature) => sum + f.properties?.[property] || 0, 0);
    this.absTotal_property = sum;

    // if absolutes, divide by totalJuarez(selected), else divide by selectedValues.length
    const divisor = totalJuarez ? totalJuarez(selectedValues) : selectedValues.length;
    //if divisor is 0, average is 0 (to avoid division by 0 and nans)
    const average = divisor > 0 ? (totalJuarez ? (this.absTotal_property / divisor) * 100 : sum / divisor) : 0;

    /*const average = selectedValues.length > 0
      ? selectedValues.reduce((sum: number, num: number) => sum + num, 0) / selectedValues.length
      : 0;*/
    this.selectedAvg = average;

    return this.selectedAvg;
  }

  getDescription(selected: string[], key: string | null, average: number, descriptionCategories?: any, juarezCard: any, selectionCard: any, category: string) {

    //console.log("average", average);
    let singleSelected = "";
    let multipleSelected = "";
    if (key) {
      singleSelected = key === "agebs" ? "el AGEB seleccionado" : "la colonia seleccionada";
      multipleSelected = key === "agebs" ? "los AGEBs seleccionados" : "las colonias seleccionadas";

    }
    const introText = selected.length === 1 ? singleSelected : multipleSelected;
    const comparedToAvg = this.selectedAvg > this.averageJuarez ? "encima" : "debajo";

    const cardData = {
      avg: this.formatValue(average),
      num: Math.round(this.absTotal_property).toLocaleString(),
      //category: descriptionCategories?.[Math.trunc(average)] || "",
      category: category || "",
      introText: selected.length >= 1 ? introText : "",
      comparedToAvg: comparedToAvg,
      avgMap: this.formatValue(this.positiveAvg)
    }

    // Juarez Card (no ageb/col selected)
    if (selected.length === 0) {
      return juarezCard(cardData);
    } else { // Selection Card (w/ ageb/col selected)
      return selectionCard(cardData);
    }
  }

  getRangeGraph = (avg: number, selected: number) => {
    let completeColors;
    const ranges = this.categorical ? [...this.legend.categories].reverse() : this.getRanges() ;

    if (this.categorical) {
        const reversedCategories = [...this.legend.categories].reverse();
        completeColors = reversedCategories.map(cat => cat.color);
        //legendRanges = reversedCategories.map(cat => cat.value);
    } else {
      const ranges = this.getRanges();
        //completeColors = ranges.map((_, i) => this.colors[i]).reverse();
      completeColors = this.scaleType === "quantile" ? ranges.map((_, i) => this.colors[i]).reverse() : ranges.map((range) => this.colorMap(range[1]));
      // completeColors = ranges.map((range) => this.colorMap(range[1]));
    }

    const Data = {
      minVal: this.minVal,
      maxVal: this.maxVal,
      negativeAvg: this.negativeAvg,
      positiveAvg: this.averageJuarez
    }

    return <RangeGraph
      data={Data}
      averageAGEB={avg}
      formatValue={this.formatValue || ((value: number) => value.toString())}
      colorsArray={completeColors}
      selectedCount={selected}
      ranges={ranges}
      layerType={this.categorical ? "categorical" : "continuous"}
      colorMap={this.colorMap}
    />
  }
}