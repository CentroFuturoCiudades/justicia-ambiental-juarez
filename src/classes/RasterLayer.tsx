import { BitmapLayer } from "@deck.gl/layers";
import { scaleLinear } from "d3-scale";
import { rgb } from "d3-color";
import { fromUrl } from "geotiff";
import Legend from "../components/Legend/Legend";
import { COLORS } from "../utils/constants";

export class RasterLayer {
  opacity: number;
  colors: string[];
  colorMap: any;
  bounds: [number, number, number, number] | null = null;
  image: HTMLImageElement | null = null;
  legend: any = null;
  minVal: number = 0;
  maxVal: number = 0;
  title: string;
  amountOfColors: number;

  constructor({ opacity = 0.7, colors = ["blue", "cyan", "white", "yellow", "red"], title = "Raster Layer", amountOfColors = 6 }: { opacity?: number, colors?: string[], title?: string, amountOfColors?: number }) {
    this.opacity = opacity;
    this.colors = colors;
    this.title = title;
    this.amountOfColors = amountOfColors;
  }

  async loadRaster(url: string) {
    const tiff = await fromUrl(url);
    const img = await tiff.getImage();
    const [wX, wY, eX, eY] = img.getBoundingBox();
    const width = img.getWidth();
    const height = img.getHeight();
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const imageData = ctx?.createImageData(width, height);
    const rasters = await img.readRasters();
    const raster = rasters[0] as any;
    const validValues = raster.filter((v: any) => v !== Infinity && v !== -Infinity);
    const { min, max } = this.minMax(validValues);
    this.minVal = min;
    this.maxVal = max;
    const domain = [
      min,
      ...Array.from({ length: this.colors.length - 2 },
        (_, i) => min + (max - min) * (i + 1) / (this.colors.length - 1)),
      max,
    ];
    const colorMap = scaleLinear<string>().domain(domain).range(this.colors);
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
        label: domain[i].toFixed(2),
        color,
        value: domain[i].toFixed(2)
      }))
    };
  }

  getBitmapLayer() {
    if (!this.image || !this.bounds) return null;
    return new BitmapLayer({
      id: this.title,
      image: this.image,
      bounds: this.bounds as any,
      opacity: this.opacity,
      pickable: true,
      visible: true,
    });
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

  getColors = (amountOfColors: number = this.amountOfColors) => {
    return Array.from({ length: amountOfColors }, (_, i) => this.minVal + (this.maxVal - this.minVal) * (i) / amountOfColors);
  }

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
        categorical={true}
      />
    );
  }

  minMax(arr: number[]) {
    let min = arr[0], max = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < min) min = arr[i];
      if (arr[i] > max) max = arr[i];
    }
    return { min, max };
  }
}
