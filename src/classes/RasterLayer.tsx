import { BitmapLayer } from "@deck.gl/layers";
import { scaleLinear, scaleThreshold, scaleQuantile } from "d3-scale";
import { rgb } from "d3-color";
import { fromUrl } from "geotiff";
import Legend from "../components/Legend/Legend";
import { COLORS } from "../utils/constants";
import RangeGraph from "../components/RangeGraph/RangeGraph";
import { formatNumber } from "../utils/utils";

export class RasterLayer {
  opacity: number;
  colors: string[];
  colorMap: any;
  bounds: [number, number, number, number] | null = null;
  image: HTMLImageElement | null = null;
  legend: any = null;
  minVal: number = 0;
  maxVal: number = 0;
  positiveAvg: number = 0;
  title: string;
  amountOfColors: number;
  formatValue: (value: number) => string;
  scaleType: string;
  thresholds: number[] | null = null;
  quantiles: number[] = []; 

  constructor({ opacity = 0.7, colors = ["blue", "cyan", "white", "yellow", "red"], title = "Raster Layer", scaleType = "linear", thresholds = null, amountOfColors = 6, formatValue }: { opacity?: number, colors?: string[], title?: string, scaleType?: string, thresholds?: number[] | null, amountOfColors?: number, formatValue?: (value: number) => string }) {
    this.opacity = opacity;
    this.colors = colors;
    this.title = title;
    this.scaleType = scaleType;
    this.thresholds = thresholds;
    this.amountOfColors = amountOfColors;
    this.formatValue = formatValue || ((value: number) => formatNumber(value, 2));
  }

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
        colorMap = scaleThreshold<number, string>().domain(domain).range(this.colors);
      } else {
        colorMap = scaleQuantile<string>().domain(domain).range(this.colors);
      }
      return colorMap;
    }

  async loadRaster(url: string) {
    try {
    const tiff = await fromUrl(url);
    const img = await tiff.getImage();
    const [wX, wY, eX, eY] = img.getBoundingBox();
    const width = img.getWidth();
    const height = img.getHeight();    
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get canvas context");
    const imageData = ctx?.createImageData(width, height);
    const rasters = await img.readRasters();
    const raster = rasters[0] as any;
    const validValues = raster.filter((v: any) => v !== Infinity && v !== -Infinity);
    const { min, max } = this.minMax(validValues);
    const avg = validValues.reduce((a: number, b: number) => a + b, 0) / validValues.length;
    this.minVal = min;
    this.maxVal = max;
    this.positiveAvg = avg;
    //Domain
    /*const domain = [
      min,
      ...Array.from({ length: this.colors.length - 2 },
        (_, i) => min + (max - min) * (i + 1) / (this.colors.length - 1)),
      max,
    ];*/
    const domain = this.getDomain(validValues);

    //const colorMap = scaleLinear<string>().domain(domain).range(this.colors);
    const colorMap = this.getColorMap(domain);


    raster.forEach((v: any, i: number) => {
      if (v === Infinity || v === -Infinity || v === null || v === undefined || isNaN(v) || v === 0) {
        imageData?.data.set([0, 0, 0, 0], i * 4);
        return;
      }
      const colorArray = rgb(colorMap(v));
      imageData?.data.set([colorArray.r, colorArray.g, colorArray.b, 255], i * 4);
    });
    if (imageData && ctx) {
      ctx.putImageData(imageData, 0, 0);
    }
    const newUrl = canvas.toDataURL("image/png");
    const imgEl = new Image();
    imgEl.src = newUrl;
    await new Promise((resolve) => { imgEl.onload = resolve; });
    this.image = imgEl;
    this.bounds = [wX, wY, eX, eY] as [number, number, number, number];
    this.colorMap = colorMap;
    this.legend = {
      title: this.title,
      categories: this.colors.map((color, i) => ({
        label: domain[i],
        color,
        value: domain[i]
      }))
    };
    //console.log("Raster image created", this.image, this.bounds);
  } catch (error) {
    console.error("Error loading raster:", error);
  }
  }

  getBitmapLayer() {
    if (!this.image || !this.bounds){
      console.error("Raster image or bounds not loaded");
      return null;
    };
    return new BitmapLayer({
      id: this.title,
      image: this.image,
      bounds: this.bounds as any,
      opacity: this.opacity,
      pickable: true,
      visible: true,
    });
  }

  getRanges = (amountOfColors: number = this.amountOfColors) => {
    const domain = Array.from({ length: amountOfColors }, (_, i) => this.minVal + (this.maxVal - this.minVal) * (i) / amountOfColors);
    let quantiles = [this.minVal, ...domain, this.maxVal];
    quantiles = quantiles.filter((value, index, self) => self.indexOf(value) === index);

    return quantiles
      .slice(0, -1)
      .map((num, i) => [num, quantiles[i + 1]])
      .reverse(); // Reverse the order of the ranges
  };

   getRanges2 = (amountOfColors: number = 6) => {
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

    this.quantiles = quantiles;
    //pares de rangos (inicio y fin) y revierte el orden
    return quantiles
      .slice(0, -1)
      .map((num, i) => [num, quantiles[i + 1]])
      .reverse(); // Opcional: invertir el orden si es necesario
  }

  getColors = (amountOfColors: number = this.amountOfColors) => {
    const ranges = this.getRanges(amountOfColors);
    const completeColors = ranges.map((range) => this.colorMap(range[1]));
    return completeColors.map((color) => rgb(color).formatHex());
  }

  getLegend(title: string, isPointLayer: boolean, legendTitle: string, textRanges?: string[]) {
    if (!this.legend) return <></>;
    const ranges = this.getRanges2();
    //const completeColors = this.getColors();
    //const completeColors = ranges.map((range) => this.colorMap(range[1]));
    const completeColors = this.scaleType === "quantile" ? ranges.map((_, i) => this.colors[i]).reverse() : ranges.map((range) => this.colorMap(range[1]));
    /*return (
      <Legend
        title={title}
        colors={completeColors}
        ranges={ranges}
        formatValue={this.formatValue}
        categorical={true}
      />
    );*/
    return <Legend
      title={legendTitle ? legendTitle : title}
      colors={completeColors}
      ranges={ranges}
      formatValue={this.formatValue || ((value: number) => value.toString())}
      categorical={false}
      isPointLayer={isPointLayer}
      textRanges={textRanges}
      scaleType={this.scaleType}
    />
  }

  minMax(arr: number[]) {
    let min = arr[0], max = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < min) min = arr[i];
      if (arr[i] > max) max = arr[i];
    }
    return { min, max };
  }

  getRangeGraph = (avg: number) => {
    if (!this.colorMap) return <></>;
    const ranges = this.getRanges();
    const completeColors = ranges.map((range) => this.colorMap(range[1]));
    /*return <RangeGraph
      colorsArray={completeColors}
      data={{ minVal: this.minVal, maxVal: this.maxVal }}
      averageAGEB={avg}
      formatValue={this.formatValue}
    />*/
    const Data = {
      minVal: this.minVal,
      maxVal: this.maxVal,
      //negativeAvg: this.negativeAvg,
      positiveAvg: this.positiveAvg
    }
    return <RangeGraph
      data={Data}
      averageAGEB={avg}
      formatValue={this.formatValue || ((value: number) => value.toString())}
      colorsArray={completeColors}
      selectedCount={0}
      ranges={[]}
      scaleType={"linear"}
    />
  }
}

