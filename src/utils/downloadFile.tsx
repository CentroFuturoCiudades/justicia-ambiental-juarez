import type { Template } from '@pdfme/common';
import { generate } from '@pdfme/generator';
import { rectangle, text, image, table } from '@pdfme/schemas';
import { MapLayer } from "../classes/MapLayer";
import { RasterLayer } from "../classes/RasterLayer";

type Section = {
  map: string;
  graph: string;
  ranges: any[];
  colors: any[];
  title: string;
  theme: string;
  description: string;
  puntaje: string | number;
  juarezAvg: string | number;
}

export const plugins = {
  Rectangle: rectangle,
  Text: text,
  Image: image,
  Table: table,

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
  //const mapboxCanvas = map.getMap().getCanvas();

  //console.log("deckglCanvas:", deckglCanvas);
  //console.log("mapboxCanvas:", mapboxCanvas);

  const width = deckglCanvas.width;
  const height = deckglCanvas.height;
  console.log("getMapImage width:", width, "height:", height);

  const merge = document.createElement("canvas");
  merge.width = width;
  merge.height = height;

  const context = merge.getContext("2d");

  if (!context) {
    console.error("No context found");
    return;
  }

  //context.globalAlpha = 1.0;
  //context.drawImage(mapboxCanvas, 0, 0, width, height);

  context.globalAlpha = 1.0;
  context.drawImage(deckglCanvas, 0, 0, width, height);

  return merge.toDataURL();
};

function groupByTheme(sections : Section[]) {
  const groupedSections : Record<string, Section[]>  = {};
  sections.forEach(section => {
    const theme = section.theme || "";
    if (!groupedSections[theme]) groupedSections[theme] = [];
    groupedSections[theme].push(section);
  });
  return groupedSections;
}

//Datos por pagina (1era seccion MAPAS)
function buildSectionPage(section: Section, theme: string, idx: number, y: number) {
  const pageHeight = 297 - 20; //page height - bottom margin
  const elementsCount = 4; //# page elements

  const elementHeights = [15, 140, 35, 15];
  const totalElementsHeight = elementHeights.reduce((a, b) => a + b, 0);
  const leftoverSpace = pageHeight - y - totalElementsHeight;
  const gap = leftoverSpace / (elementsCount - 1); //espaciado dinamico para abarcar toda la pagina

  const pageFields = []

  //section title
  pageFields.push({
    name: `section_${theme}_${idx}_title`,
    type: "text",
    content: section.title,
    position: { x: 10, y },
    width: 170, height: elementHeights[0], fontSize: 25, alignment: "left",
    fontColor: "#2d5534", fontName: "Roboto", opacity: 1, readOnly: true
  })
  y += elementHeights[0] + gap;

  //map
  pageFields.push({
    name: `section_${theme}_${idx}_map`,
    type: "image",
    position: { x: 10, y },
    width: 200, height: elementHeights[1], opacity: 1, required: true, readOnly: false
  })
  y += elementHeights[1] + gap;

  //graph
  pageFields.push({
    name: `section_${theme}_${idx}_graph`,
    type: "image",
    position: { x: 50, y },
    width: 110, height: elementHeights[2], opacity: 1, required: false, readOnly: false
  })
  y += elementHeights[2] + gap;

  //description
  pageFields.push({
    name: `section_${theme}_${idx}_description`,
    type: "text",
    content: section.description,
    position: { x: 20, y },
    width: 170, height: elementHeights[3], fontSize: 14, alignment: "center",
    fontColor: "#2d5534", fontName: "Roboto", opacity: 1, readOnly: true
  })

  //legend?? (no venia en el diseño)
  //pageFields.push(...generatePdfLegend(section.ranges, section.colors, { x: 20, y }));

  return pageFields;

}

//Tabla de indicadores POR TEMA
function buildIndicatorsTable(theme: string, y: number) {
  return {
    name: `indicadores_${theme}`,
    type: "table",
    position: { x: 20, y },
    width: 170,
    height: 43.75920000000001,
    content: `{{indicadores_${theme}}}`,
    required: true,
    showHead: true,
    head: ["Indicador", "Puntaje", "Ciudad Juarez"],
    headWidthPercentages: [52.2, 24.2, 23.6],
    tableStyles: { borderWidth: 0.1, borderColor: "#4b5544" },
    headStyles: { fontName: "Roboto", fontSize: 13, characterSpacing: 0, alignment: "left", verticalAlignment: "middle", lineHeight: 1, fontColor: "#ffffff", borderColor: "", backgroundColor: "#4b6648", borderWidth: { top: 0, right: 0, bottom: 0, left: 0 }, padding: { top: 5, right: 5, bottom: 5, left: 5 } },
    bodyStyles: { fontName: "Roboto", fontSize: 13, characterSpacing: 0, alignment: "left", verticalAlignment: "middle", lineHeight: 1, fontColor: "#000000", borderColor: "#888888", alternateBackgroundColor: "#f5f5f5", borderWidth: { top: 0.1, right: 0.1, bottom: 0.1, left: 0.1 }, padding: { top: 5, right: 5, bottom: 5, left: 5 } },
    columnStyles: {},
    readOnly: false,
    fontSize: 13,
    alignment: "left",
    fontColor: "#000000",
    fontName: "Roboto",
    opacity: 1
  };
}

function buildInputs(groupedSections: Record<string, Section[]>) {
  return [
    Object.fromEntries([
      ...Object.entries(groupedSections).flatMap(([theme, themeSections]) =>
        themeSections.map((section, idx) => [
          [`section_${theme}_${idx}_title`, section.title],
          [`section_${theme}_${idx}_map`, section.map],
          [`section_${theme}_${idx}_graph`, section.graph],
          [`section_${theme}_${idx}_description`, section.description],
          [`section_${theme}_${idx}_legend`, generatePdfLegend(section.ranges, section.colors, { x: 20, y: 180 + idx * 5 })]
        ])
      ).flat(),
      ...Object.entries(groupedSections).map(([theme, themeSections]) => [
        `indicadores_${theme}`,
        themeSections.map(section => [
          section.title ?? "",
          section.puntaje !== undefined ? section.puntaje.toString() : "",
          section.juarezAvg !== undefined ? section.juarezAvg.toString() : ""
        ])
      ]),
    ])
  ];
}

//REPORTE DINAMICO
export const downloadPdf = async (deck: any, map: any, layerInstances: MapLayer[]) => {

  const amountOfColors = 6;

  //PARA CADA INSTANCE
  const sections: Section[] = await Promise.all(layerInstances.map(async (layerInstance) => {

    return {
      map: layerInstance.deckImage ?? "",
      graph: layerInstance.graphImage ?? "",
      ranges: layerInstance?.getRanges(amountOfColors),
      colors: layerInstance?.getColors(amountOfColors),
      title: layerInstance.title,
      theme: layerInstance.theme ?? "",
      description: layerInstance.selectedDescription,
      puntaje: layerInstance.formatValue(layerInstance.selectedAvg),
      juarezAvg: layerInstance.formatValue(layerInstance.positiveAvg),
    };

  }));

  const pdfTtitle = [
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

  const schemas = [];

  //Agrupar por tematica
  const groupedSections = groupByTheme(sections);

  const themeNames = Object.keys(groupedSections);
  const firstTheme = themeNames[0];
  

  //SECCION DE MAPAS/LAYERS
  Object.entries(groupedSections).forEach(([theme, themeSections]) => {
    const themeTitle = {
      name: `section_${theme}_title`,
      type: "text",
      content: theme,
      position: { x: 10, y: (firstTheme === theme ? 50 : 10) },
      width: 170, height: 15, fontSize: 30, alignment: "left",
      fontColor: "#2d5534", fontName: "Roboto", opacity: 1, readOnly: true
    };

    themeSections.forEach((section, idx) => {
      const pageFields = buildSectionPage(section, theme, idx, (theme === firstTheme && idx === 0) ? 65 : 25);

      if (theme === firstTheme && idx === 0){
        schemas.push([...pdfTtitle, themeTitle, ...pageFields]);
      } else if (idx === 0) {
        schemas.push([themeTitle, ...pageFields]);
      } else {
        schemas.push(pageFields);
      }
    });
  });

  //SECCION INDICADORES TABLAS 
  const indicadores = [
    {
      name: "section_indicadores_title",
      type: "text",
      content: "Tablas de indicadores por temática",
      position: { x: 20, y: 20 },
      width: 170, height: 15, fontSize: 30, alignment: "left",
      fontColor: "#2d5534", fontName: "Roboto", opacity: 1, readOnly: true
    }
  ];

  let y = 35;

  //tablas de indicadores en una misma pag (page break automatico)
  Object.entries(groupedSections).forEach(([theme, themeSections]) => {
    indicadores.push({
      name: `section_${theme}_title`,
      type: "text",
      content: theme,
      position: { x: 20, y },
      width: 170, height: 15, fontSize: 25, alignment: "left",
      fontColor: "#2d5534", fontName: "Roboto", opacity: 1, readOnly: true
    });
    y += 15;

    indicadores.push(buildIndicatorsTable(theme, y));
    y += themeSections.length * 15 + 30;
  });

  schemas.push(indicadores);

  const template = {
    schemas,
    basePdf: { width: 210, height: 297, padding: [20, 10, 20, 10] as [number, number, number, number] }
  };

  const inputs = buildInputs(groupedSections);

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