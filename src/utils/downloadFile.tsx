import type { Template } from '@pdfme/common';
import { generate } from '@pdfme/generator';
import { rectangle, text, image, table } from '@pdfme/schemas';
import { MapLayer } from "../classes/MapLayer";
import { RasterLayer } from "../classes/RasterLayer";
import { useAppContext } from "../context/AppContext";
import html2canvas from "html2canvas";
import { FaHouseLaptop } from 'react-icons/fa6';

export const plugins = {
  Rectangle: rectangle,
  Text: text,
  Image: image,
  Table: table,
};

export const template: Template = {
  schemas: [
    [
      {
        "name": "title",
        "type": "text",
        //"content": "Indicadores Ambientales",
        "content": "Visor de Indicadores Ambientales",
        "position": { "x": 17.95, "y": 20 },
        "width": 174.1, "height": 20.11, "rotate": 0, "alignment": "center", "verticalAlignment": "top", "fontSize": 25, "lineHeight": 1, "characterSpacing": 0, "fontColor": "#000000", "fontName": "Roboto", "backgroundColor": "", "opacity": 1, "strikethrough": false, "underline": false, "required": false, "readOnly": true
      },
      {
        "name": "subtitle",
        "type": "text",
        "content": "Reporte",
        "position": { "x": 21, "y": 29 },
        "width": 174.1, "height": 20.11, "rotate": 0, "alignment": "center", "verticalAlignment": "top", "fontSize": 40, "lineHeight": 1, "characterSpacing": 0, "fontColor": "#2d5534", "fontName": "Roboto", "backgroundColor": "", "opacity": 1, "strikethrough": false, "underline": false, "required": false, "readOnly": true
      },
      {
        "name": "indicadores",
        "type": "table",
        "position": { "x": 30, "y": 50 },
        "width": 150,
        "height": 43.75920000000001,
        "content": "[[\"{ind_name_1}\",\"{sel_val_1}\",\"{mun_val_1}\"],[\"{ind_name_2}\",\"{sel_val_2}\",\"{mun_val_2}\"]]",
        "showHead": true,
        "head": ["Indicador", "Puntaje", "Ciudad Juarez"],
        "headWidthPercentages": [52.20067049782067, 24.22174329508776, 23.577586207091574],
        "tableStyles": { "borderWidth": 0.1, "borderColor": "#4b5544" },
        "headStyles": { "fontName": "Roboto", "fontSize": 13, "characterSpacing": 0, "alignment": "left", "verticalAlignment": "middle", "lineHeight": 1, "fontColor": "#ffffff", "borderColor": "", "backgroundColor": "#4b6648", "borderWidth": { "top": 0, "right": 0, "bottom": 0, "left": 0 }, "padding": { "top": 5, "right": 5, "bottom": 5, "left": 5 } },
        "bodyStyles": { "fontName": "Roboto", "fontSize": 13, "characterSpacing": 0, "alignment": "left", "verticalAlignment": "middle", "lineHeight": 1, "fontColor": "#000000", "borderColor": "#888888", "backgroundColor": "", "alternateBackgroundColor": "#f5f5f5", "borderWidth": { "top": 0.1, "right": 0.1, "bottom": 0.1, "left": 0.1 }, "padding": { "top": 5, "right": 5, "bottom": 5, "left": 5 } },
        "columnStyles": {}, "required": true, "readOnly": false
      },
      {
        "name": "map_title",
        "type": "text",
        "content": "Mapas",
        "position": { "x": 20, "y": 100 },
        "width": 40,
        "height": 15,
        "rotate": 0,
        "alignment": "left",
        "verticalAlignment": "top",
        "fontSize": 30,
        "lineHeight": 1,
        "characterSpacing": 0,
        "fontColor": "#2d5534",
        "fontName": "Roboto",
        "backgroundColor": "",
        "opacity": 1,
        "strikethrough": false,
        "underline": false,
        "required": false,
        "readOnly": true
      }, {
        "name": "map",
        "type": "image",
        "position": { "x": 30, "y": 110 },
        "width": 150,
        "height": 100,
        "rotate": 0,
        "opacity": 1,
        "required": true,
        "readOnly": false
      }, {
        "name": "graph",
        "type": "image",
        "position": { "x": 70, "y": 220 },
        "width": 75,
        "height": 30,
        "rotate": 0,
        "opacity": 1,
        "required": false,
        "readOnly": false
      }
    ]
  ],
  basePdf: { "width": 210, "height": 297, "padding": [20, 10, 20, 10] },
};

export const templateLegendColor = {
  "type": "rectangle",
  "width": 3,
  "height": 3,
  "rotate": 0,
  "opacity": 1,
  "borderWidth": 0.1,
  "borderColor": "#dbdbdb",
  "color": "#ff0000",
  "readOnly": true,
  "radius": 0,
  "required": false
};
export const templateLegendText = {
  "type": "text",
  "width": 50,
  "height": 4,
  "rotate": 0,
  "alignment": "left",
  "verticalAlignment": "top",
  "fontSize": 10,
  "lineHeight": 1,
  "characterSpacing": 0,
  "fontColor": "#000000",
  "fontName": "Roboto",
  "backgroundColor": "",
  "opacity": 1,
  "strikethrough": false,
  "underline": false,
  "required": false,
  "readOnly": true
}

export const generatePdfLegend = (ranges: any[][], colors: any[], position: { x: number, y: number }) => {
  const legend: any[] = [];
  ranges.forEach((range, index) => {
    legend.push({
      ...templateLegendColor,
      "name": `field${index}Color`,
      "position": { "x": position.x, "y": position.y + index * 5 + 0.5 },
      "color": colors[index],
    });
    legend.push({
      ...templateLegendText,
      "name": `field${index}Text`,
      "content": `${range[1].toFixed(2)} - ${range[0].toFixed(2)}`,
      "position": { "x": position.x + 5, "y": position.y + index * 5 },
    });
  });
  return legend;
}

export const blobToBase64 = (blob: Blob) => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export const getMapImage = (deck: any, map: any, layerInstance: MapLayer | RasterLayer | null): string | undefined => {

  const deckglCanvas = deck.deck.canvas;
  const width = deckglCanvas.width;
  const height = deckglCanvas.height;

  let merge = document.createElement("canvas");
  merge.width = width;
  merge.height = height;

  var context = merge.getContext("2d");

  if (!context) {
    console.error("No context found");
    return;
  }

  context.globalAlpha = 1.0;
  context.drawImage(deckglCanvas, 0, 0, width, height);

  return merge.toDataURL();
};


export const downloadPdf = async (deck: any, map: any, layerInstance: MapLayer | null) => {
  const imageUrl = getMapImage(deck, map, layerInstance);
  if (!imageUrl) {
    console.error("No image URL found");
    return;
  }
  const response = await fetch(imageUrl);
  const blobImage = await response.blob();
  const base64Image = await blobToBase64(blobImage);
  //
  let graphImage = "";
  
  if (layerInstance && layerInstance.ref && layerInstance.ref.current) {
    const canvas = await html2canvas(layerInstance.ref.current);
    graphImage = canvas.toDataURL("image/png");
  }
  const inputs = [
    {
      "indicadores": [
        ['Islas de calor', '4.4 °C', '3.7 °C'],
        ['Aire contaminado', '100 μg/m', '50 μg/m³'],
      ],
      "map": base64Image,
      "graph": graphImage,
    },
  ];
  const amountOfColors = 6;
  const ranges = layerInstance?.getRanges(amountOfColors);
  const colors = layerInstance?.getColors(amountOfColors);
  console.log(layerInstance, ranges, colors);
  if (!ranges || !colors) {
    console.error("No ranges or colors found");
    return;
  }
  let newTemplate = JSON.parse(JSON.stringify(template))
  newTemplate.schemas[0] = [
    ...template.schemas[0],
    ...generatePdfLegend(ranges, colors, { x: 20, y: 180 }),
  ];
  const pdf = await generate({ template: newTemplate, inputs, plugins });

  const blobPdf = new Blob([pdf.buffer], { type: 'application/pdf' });
  window.open(URL.createObjectURL(blobPdf));
}

export const downloadPdf_LAYERS = async (deck: any, map: any, layerInstances: MapLayer[]) => {

  const amountOfColors = 6;

  //Para cada layerInstance
  const sections = await Promise.all(layerInstances.map(async (layerInstance, idx) => {
    //Map image
    const imageUrl = getMapImage(deck, map, layerInstance);
    if (!imageUrl) {
      console.error("No image URL found");
      return;
    }
    const response = await fetch(imageUrl);
    const blobImage = await response.blob();
    const base64Image = await blobToBase64(blobImage);

    //Legend
    const ranges = layerInstance?.getRanges(amountOfColors);
    const colors = layerInstance?.getColors(amountOfColors);

    //Graph
    const graphImage = layerInstance.graphImage || "";

    //juarez total avg
    const juarezAvg = layerInstance.formatValue(layerInstance.positiveAvg)

    return {
      map: base64Image,
      graph: graphImage,
      ranges,
      colors,
      title: layerInstance.title || `Capa ${idx + 1}`,
      theme: layerInstance.theme || "default",
      description: layerInstance.selectedDescription || "",
      puntaje: layerInstance.selectedAvg || 0,    //indicador
      positiveAvg: juarezAvg || 0,  //indicador
      //indicadores: layerInstance.getIndicadores?.() || []
    };

  }));

  //Agrupar por tematica
  const groupedSections: Record<string, typeof sections> = {};
  sections.forEach(section => {
    const theme = section.theme || "Sin tema";
    if (!groupedSections[theme]) groupedSections[theme] = [];
    groupedSections[theme].push(section);
  });

  const fields = [
    {
      name: "title",
      type: "text",
      content: "Visor de Indicadores Ambientales",
      position: { x: 17.95, y: 20 },
      width: 174.1, height: 20.11, fontSize: 25, alignment: "center",
      fontColor: "#000000", fontName: "Roboto", opacity: 1, readOnly: true
    },
    {
      name: "subtitle",
      type: "text",
      content: "Reporte",
      position: { x: 21, y: 29 },
      width: 174.1, height: 20.11, fontSize: 40, alignment: "center",
      fontColor: "#2d5534", fontName: "Roboto", opacity: 1, readOnly: true
    }
  ];

  let y = 50;
  //sections.forEach((section, idx) => {
  Object.entries(groupedSections).forEach(([theme, themeSections]) => {
    // Título de la sección
    fields.push({
      name: `section${theme}_title`,
      type: "text",
      content: theme,
      position: { x: 20, y },
      width: 170, height: 15, fontSize: 30, alignment: "left",
      fontColor: "#2d5534", fontName: "Roboto", opacity: 1, readOnly: true
    });
    y += 12;

    themeSections.forEach((section, idx) => {
    // Título de la sección
      fields.push({
        name: `section_${theme}_${idx}_title`,
        type: "text",
        content: section.title,
        position: { x: 20, y },
        width: 170, height: 15, fontSize: 25, alignment: "left",
        fontColor: "#2d5534", fontName: "Roboto", opacity: 1, readOnly: true
      });
      y += 18;

      // Mapa
      fields.push({
        name: `section_${theme}_${idx}_map`,
        type: "image",
        position: { x: 30, y },
        width: 150, height: 100, opacity: 1, required: true, readOnly: false
      });
      y += 105;

      // Gráfico
      fields.push({
        name: `section_${theme}_${idx}_graph`,
        type: "image",
        position: { x: 70, y },
        width: 75, height: 30, opacity: 1, required: false, readOnly: false
      });
      y += 35;

      //Description
      fields.push({
        name: `section_${theme}_${idx}_description`,
        type: "text",
        content: section.description,
        position: { x: 20, y },
        width: 170, height: 15, fontSize: 14, alignment: "center",
        fontColor: "#2d5534", fontName: "Roboto", opacity: 1, readOnly: true
      });
      y += 20;

      // Leyenda
      fields.push(...generatePdfLegend(section.ranges, section.colors, { x: 20, y }));
      y += section.ranges.length * 5 + 10;
    });
      
  });

  y += 10;

  //INDICADORES
  fields.push({
    name: "section indicadores",
    type: "text",
    content: "Tablas de indicadores por temática",
    position: { x: 20, y },
    width: 170, height: 15, fontSize: 30, alignment: "left",
    fontColor: "#2d5534", fontName: "Roboto", opacity: 1, readOnly: true
  });
  y += 12;
  
  

  Object.entries(groupedSections).forEach(([theme, themeSections]) => {
    fields.push({
          name: `section${theme}_title`,
          type: "text",
          content: theme,
          position: { x: 20, y },
          width: 170, height: 15, fontSize: 25, alignment: "left", verticalAlignment: "top",
          fontColor: "#2d5534", fontName: "Roboto", opacity: 1, readOnly: true
        });
        y += 12;
    fields.push({
      name: `indicadores_${theme}`,
      type: "table",
      position: { x: 30, y },
      width: 150,
      //height: themeSections.length * 15 + 30, // ajusta según filas
      height: 43.75920000000001,
      content: `{{indicadores_${theme}}}`,
      required: true,
      showHead: true,
      head: ["Indicador", "Puntaje", "Ciudad Juarez"],
      headWidthPercentages: [52.2, 24.2, 23.6],
      tableStyles: { borderWidth: 0.1, borderColor: "#4b5544" },
      headStyles: { fontName: "Roboto", fontSize: 13, characterSpacing: 0, alignment: "left", verticalAlignment: "middle", lineHeight: 1, fontColor: "#ffffff", "borderColor": "", backgroundColor: "#4b6648", borderWidth: { "top": 0, "right": 0, "bottom": 0, "left": 0 }, padding: {  top: 5, right: 5, bottom: 5, left: 5 } },
      bodyStyles: { fontName: "Roboto", fontSize: 13, characterSpacing: 0, alignment: "left", verticalAlignment: "middle", lineHeight: 1, fontColor: "#000000", borderColor: "#888888", alternateBackgroundColor: "#f5f5f5", borderWidth: { top: 0.1, right: 0.1, bottom: 0.1, left: 0.1 }, padding: {  top: 5, right: 5, bottom: 5, left: 5 } },

      columnStyles: {}, readOnly: false
    });
    y += themeSections.length * 15 + 30;
  });

  const inputs = [
    Object.fromEntries([
      
      // Si necesitas agregar los campos de cada sección:
      ...Object.entries(groupedSections).flatMap(([theme, themeSections]) =>
        themeSections.map((section, idx) => [
          [`section_${theme}_${idx}_title`, section.title],
          [`section_${theme}_${idx}_map`, section.map],
          [`section_${theme}_${idx}_graph`, section.graph],
          [`section_${theme}_${idx}_description`, section.description],
          
        ])
      ).flat(),
      ...Object.entries(groupedSections).map(([theme, themeSections]) => [
        `indicadores_${theme}`,
        themeSections.map(section => [
          section.title ?? "",
          section.puntaje !== undefined ? section.puntaje.toString() : "",
          section.positiveAvg !== undefined ? section.positiveAvg.toString() : ""
        ])
      ]),
    ])
  ];

  const template = {
    schemas: [fields],
    basePdf: { width: 210, height: 297, padding: [20, 10, 20, 10] }
  };


  const pdf = await generate({ template, inputs, plugins });
  const blobPdf = new Blob([pdf.buffer], { type: 'application/pdf' });
  window.open(URL.createObjectURL(blobPdf));
}


export const downlaodFile = (url: string, filename: string) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}