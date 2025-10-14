import { GeoJsonLayer } from "@deck.gl/layers";
import { color, rgb, selection } from "d3";
import Legend from "./../components/Legend/Legend";
import RangeGraph from "../components/RangeGraph/RangeGraph";
import { scaleLinear, scaleOrdinal } from "d3-scale";
import { formatNumber } from "../utils/utils";
import { ascending, interpolateRgb, interpolateRgbBasis, quantileSorted, quantize,  type ScaleQuantile, scaleQuantile } from "d3";

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
  categoryLabels?: any;
  categoryLegend?: any;
  domain?: number[];


  constructor({ opacity = 0.7, colors = ["#f4f9ff", "#08316b"], title = "Map Layer", amountOfColors = 6, formatValue, categorical = false, categoryLabels = {}, categoryLegend = [] }: {
    opacity?: number;
    colors?: string[];
    title?: string;
    amountOfColors?: number;
    formatValue?: (value: number) => string;
    categorical?: boolean;
    categoryLabels?: any;
    categoryLegend?: any;
  }) {
    this.opacity = opacity;
    this.colors = colors;
    this.title = title;
    this.amountOfColors = amountOfColors;
    this.formatValue = formatValue || ((value: number) => formatNumber(value, 2));
    this.categorical = categorical;
    this.categoryLabels = categoryLabels;
    this.categoryLegend = categoryLegend;
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

  getLayer = (data: any, field: string, is_PointLayer: boolean, trimOutliers: boolean, handleFeatureClick: (info: any) => void, selectedAGEBS: string[] = [], selectionMode: string | null): GeoJsonLayer => {


    this.isLineLayer = true;
    let getColor: any;
    const featuresForStats = data.allFeatures;
    const categorias = Array.from(
      new Set(featuresForStats.map((f: any) => f.properties[field]))
    ).filter((c) => c != null);
    //console.log("categorias", categorias);
    //console.log("featuresForStats", featuresForStats);

    if (field) {
      let mappedData: any[] = featuresForStats.map((item: any) => item.properties[field]);
      mappedData = mappedData.filter((value) => value !== null && value !== undefined);

      //console.log("mappedData", mappedData);
      if( trimOutliers ){
        mappedData = this.trimOutliers( mappedData );
      }

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
      else if (this.categorical) {
        //domain = categorias unicas
        const categories = Array.from(new Set(mappedData)).sort((a, b) => a - b);
        this.domain = categories;
        //console.log("entro a this.categorical y sus categories", categories);

        if (this.colors.length === categories.length) {
          // mapeo directo de colores a categorías (mismo num de colores que categorias)
          this.colorMap = scaleOrdinal<string>()
            .domain(categories.map(String))
            .range(this.colors);
        } else {
          //interpolacion de colores para categorias (diferente num de colores que categorias)
          this.colorMap = scaleLinear<string>()
            .domain([categories[0], categories[categories.length - 1]])
            .range(this.colors);
        }

        this.legend = {
          title: this.title,
          categories: categories.map((cat, i) => ({
            //label: cat.toString(),
            label: cat.toString() + " - " + this.categoryLabels?.[cat] || cat.toString(),
            color: this.colorMap(cat),
            value: cat
          }))
        };
      } else {
        //not categorical
        //domain = [min, max]
        const domain = [
          minVal,
          ...Array.from({ length: this.colors.length - 2 },
            (_, i) => minVal + (maxVal - minVal) * (i + 1) / (this.colors.length - 1)),
          maxVal,
        ];
        this.domain = domain;
        this.colorMap = scaleLinear<string>().domain(this.domain).range(this.colors);

        this.legend = {
          title: this.title,
          categories: this.colors.map((color, i) => ({
            label: domain[i].toFixed(2),
            color,
            value: domain[i].toFixed(2)
          }))
        };
      }
      const positiveAvg = mappedData.filter(n => n > 0).reduce((sum, n) => sum + n, 0) / mappedData.filter(n => n > 0).length;
      const negativeAvg = mappedData.filter(n => n < 0).reduce((sum, n) => sum + n, 0) / mappedData.filter(n => n < 0).length;

      this.positiveAvg = positiveAvg;
      this.negativeAvg = negativeAvg;


      getColor =
        (feature: any): [number, number, number, number?] => {

          const item = feature.properties[field];
          //para valores de 0, poner gris claro
          if (item == 0) {
            return [230, 230, 230, 200]; //gris con poca opacidad
          }
          const rgbValue = color(this.colorMap(item))?.rgb();
          return rgbValue ? [rgbValue.r, rgbValue.g, rgbValue.b] : [255, 255, 255];
         // }
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
      pickable: selectionMode === "radius" ? false : true,
      filled: true,
      stroked: true,
      opacity: this.opacity,
      getFillColor: getColor,
      autoHighlight: true,
      highlightColor: [250, 200, 0, 100],
      getLineColor: [255, 255, 255, 255],
      //getPointRadius: is_PointLayer ? 100 : undefined,
      pointRadiusMinPixels: is_PointLayer ? 6 : undefined,
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

  //no me gusta que getlegend se llama cada vez que selecciono una ageb/colonia
  getLegend = (title: string, isPointLayer: boolean) => {
    if (!this.legend) return <></>;
    //const ranges = this.getRanges();
    const ranges = this.categorical ? [...this.legend.categories].reverse() : this.getRanges() ;
    //console.log("ranges for legend", ranges);

    let completeColors, legendRanges;
    if (this.categorical) {
        completeColors = ranges.map(cat => cat.color);
        legendRanges = ranges.map(cat => cat.label);
    } else {
        completeColors = ranges.map((range) => this.colorMap(range[1]));
        legendRanges = ranges;
    }

    return <Legend
      title={title}
      colors={completeColors}
      ranges={legendRanges}
      formatValue={this.formatValue || ((value: number) => value.toString())}
      categorical={this.categorical}
      isPointLayer={isPointLayer}
    />
  }

   getAverage(features: Feature[], selected: string[], property: string, key: string, totalJuarez: any) : number {
    //si recibe propertyAbsolute, es que quiere el promedio diferente (suma de propertyAbsolute / total juarez * 100)

    this.absTotal_juarez = totalJuarez ? totalJuarez(features) : 0; //total juarez
    // suma de la property de todas las features (AGEBS/Colonias)
    this.absTotal_property = totalJuarez ? features.reduce((sum: number, f: Feature) => {
      const value = f.properties?.[property];
      return sum + value;
    }, 0) : 0;
    this.averageJuarez = totalJuarez ? (this.absTotal_property / this.absTotal_juarez) * 100 : this.positiveAvg;

    // If no selected AGEBS/Colonias, return overall average
    if (selected.length === 0){
      return this.averageJuarez;
    }

    //If there are selected AGEBS/Colonias, get their average
    const idField = key === "agebs" ? "index" : "nombre";
    const selectedValues = features
    .filter((f: Feature) => selected.includes((f.properties as any)[idField]))
    //.map(f => f.properties?.[property])
    //.filter(value => value != null);
    .filter(f => f.properties?.[property] != null)

    //console.log("selectedvalues", selectedValues);

    const sum = selectedValues.reduce((sum: number, f: Feature) => sum + f.properties?.[property] || 0, 0);
    this.absTotal_property = sum;
    // (this.absTotal_property / this.absTotal_juarez) * 100 o  (this.absTotal_property / this.absTotalAGEB) * 100
    //const average = totalJuarez ? (this.absTotal_property / this.absTotal_juarez) * 100 : sum / selectedValues.length;
    const average = totalJuarez ? (this.absTotal_property / totalJuarez(selectedValues)) * 100 : sum / selectedValues.length;

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
      num: (this.absTotal_property).toLocaleString(),
      //category: descriptionCategories?.[Math.trunc(average)] || "",
      category: category || "",
      introText: selected.length >= 1 ? introText : "",
      comparedToAvg: comparedToAvg
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
    if (this.categorical) {
        const reversedCategories = [...this.legend.categories].reverse();
        completeColors = reversedCategories.map(cat => cat.color);
        //legendRanges = reversedCategories.map(cat => cat.value);
    } else {
      const ranges = this.getRanges();
       completeColors = ranges.map((range) => this.colorMap(range[1]));
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
    />
  }
}