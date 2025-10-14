//import { geoAlbers, lab } from "d3"

import { tree, type format } from "d3";
import { formatNumber, capitalize } from "./utils";
const REACT_APP_SAS_TOKEN = import.meta.env.VITE_AZURE_SAS_TOKEN;
import * as echarts from 'echarts/core';

export const total_pob_juarez = 1503616.0;
 /*function getLevelOption() {
    return [
      {
        itemStyle: {
          borderColor: '#777',
          borderWidth: 0,
          gapWidth: 1
        },
        upperLabel: {
          show: false
        }
      },
      {
        itemStyle: {
          borderColor: '#555',
          borderWidth: 5,
          gapWidth: 1
        },
        emphasis: {
          itemStyle: {
            borderColor: '#ddd'
          }
        }
      },
      {
        colorSaturation: [0.35, 0.5],
        itemStyle: {
          borderWidth: 5,
          gapWidth: 1,
          borderColorSaturation: 0.6
        }
      }
    ];
  }*/
 function getLevelOption() {
    return [
      {
        itemStyle: {
          borderWidth: 0,
          gapWidth: 5
        }
      },
      {
        itemStyle: {
          gapWidth: 1
        }
      },
      {
        colorSaturation: [0.35, 0.5],
        itemStyle: {
          gapWidth: 1,
          borderColorSaturation: 0.6
        }
      }
    ];
  }

export const COLORS = {
    GLOBAL: {
        primary: "",
        positive: "",
        negative: "",
        fondo: "#fefdfc",
        sombrasBotones: "#f5ede3",
        otro: "#fefdfc",
        textPrimary: "#545454",
        highlightGreen: "#87b6b3",
        highlightRed: "#bb6361",
        backgroundLight: "#f1f0ee",
        backgroundMedium: "#c4c4c4",
        backgroundDark: "#40423d"
    },
    ambiental: {
        primary: "#a2b687",
        positive: "#c7ddb0",
        negative: "#6e7c5a",
    },
    industria: {
        primary: "#8d8473",
        positive: "#b7ae9e",
        negative: "#5f574a",
    },
    equipamiento: {
        primary: "#9b87b6",
        positive: "#c7bfe0",
        negative: "#6c5a7f",
    },
    poblacion: {
        primary: "#acbab6",
        positive: "#d3e0dc",
        negative: "#7a8683",
    }
}

export type LayerKey = keyof typeof LAYERS;
export const SECTIONS = {
    ambiental: {
        label: "riesgos ambientales",
        layers: [
            "islas_de_calor",
            "vulnerabilidad_calor",
            "pob_afectada_inundaciones",
            "superficie_inundada",
            "riesgo_trafico_vehicular",
        ] as LayerKey[],
    },
    industria: {
        label: "riesgos relacionados a la industria",
        layers: [
            "industrias",
            "industrias_contaminantes",
            "hogares_vulnerables_industria",
            "infantes_vulnerables_industria",
            "adultos_vulnerables_industria",
        ] as LayerKey[],
    },
    equipamiento: {
        label: "acceso a equipamientos",
        layers: [
            "equipamientos",
            "indice_accesibilidad",
            "tiempo_recreativos",
            "tiempo_hospitales",
            "tiempo_preparatorias",
            "acceso_recreativos",
            "acceso_hospitales",
            "acceso_preparatorias"
        ] as LayerKey[],
    },
    poblacion: {
        label: "población",
        layers: [
            "ingreso",
            "porcentaje_pob_0a5",
            "porcentaje_pob_60",
            "porcentaje_escolaridad",
            "indice_bienestar",
            "indice_marginacion",
        ] as LayerKey[],
    }
}

export const LAYERS: any = {
    islas_de_calor: {
        capa: true,
        url: `https://justiciaambientalstore.blob.core.windows.net/data/Islas_de_calor_Juarez.geojson?${REACT_APP_SAS_TOKEN}`,
        //jsonurl: `https://justiciaambientalstore.blob.core.windows.net/data/heat_island_graph.csv?${REACT_APP_SAS_TOKEN}`, //pedirlo en json
        jsonurl: './assets/data/heat_island_graph.json',
        title: "Islas de calor",
        description: "Las islas de calor describen áreas urbanas de muchas construcciones que son más calientes que las áreas rurales cercanas. Las islas de calor aumentan el calor y la contaminación, lo que provoca riesgos para la salud y afecta la calidad de vida.",
        source: "Elaboración Propia con datos de Earth Resources Observation and Science (EROS) Center; European Space Agency, Center for International Earth Science Information Network, Demuzere et al., 2022; Schiavina et al., 2023; Tatem, 2017 (CIESIN) Columbia University (ver: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5251739)",
        property: "lst",
        tematica: "industria",
        type: "Continua",
        is_lineLayer: false,
        is_PointLayer: false,
        colors: ["#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000"],
        enabled: true,
        colonias: false,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.ID !== null);
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + " kg m2"
        },
        trimOutliers: false,
        juarezCard: (data) =>
            <span>En Ciudad Juárez, la temperatura promedio del cuatrimestre más caluroso del año (Mayo a Agosto) es de <strong>48.54 grados centigrados.</strong></span>,
        selectionCard: (data) => {
            return (
            <>
                <span>En {data.introText} la exposición a contaminantes industriales es de <strong>{data.avg}/km² </strong>.</span>
                <br/>
                <span>Este porcentaje esta por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juarez.</span>
            </>
            );
        },
        graphs: [
        {
            title: "Temperatura de superficie",
            source: "Fuente de ejemplo",
            option: (data: any) => ({
                grid: {
                    top: 40,
                    bottom: 0,
                    left: 10,
                    right: 10,
                    containLabel: true
                },
                xAxis : {
                    type: 'category',
                    //name: 'Rango de temperatura (°C)',
                    //nameLocation: 'middle',
                    //nameGap: 60,
                    data: data.map((d: any) => `${Number(d.from_temperature).toFixed(1)}°C - ${Number(d.to_temperature).toFixed(1)}°C`),
                    axisLabel: {
                        interval: 0,
                        rotate: 45,
                        fontSize: 10,
                    }
                },
                tooltip: {
                    show: true,
                    formatter: (params: any) => `${Number(params.value).toFixed(2)} km²`,
                    //trigger: 'axis',
                    position: function (point, params, dom, rect, size) {

                        const tooltipWidth = size.contentSize[0];
                        const x = point[0] - tooltipWidth / 2;
                        const y = point[1] - 50;
                        return [x, y];
                    },
                    padding: [5, 10],
                    backgroundColor: 'rgba(50, 50, 50, 0.7)',
                    textStyle: {
                        color: '#fff',
                        fontSize: 10,
                        fontFamily: 'Roboto, sans-serif',
                    }

                },
                yAxis: {
                    type: 'value',
                    name: 'Área km²',
                    nameTextStyle: { align: 'left' },
                    axisLabel: {
                        formatter: '{value} km²',
                        fontSize: 10,
                        fontFamily: 'Roboto, sans-serif',
                    }
                },
                series: [
                    {
                        data: data.map((d: any) => d.area_km2),
                        type: 'bar',
                        itemStyle: {
                            color: '#fc8d59'
                        },
                    }
                ],
            })
        }
        ]
    },
    vulnerabilidad_calor: {
        title: "Índice de vulnerabilidad al calor",
        description: "Índice que evalúa la exposición al calor, la sensibilidad al calor y la capacidad de adaptación para evaluar de manera integral la vulnerabilidad al calor.",
        source: "Elaboración Propia con datos de Earth Resources Observation and Science (EROS) Center; European Space Agency, Center for International Earth Science Information Network, Demuzere et al., 2022; Schiavina et al., 2023; Tatem, 2017 (CIESIN) Columbia University (ver: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5251739)",
        property: "vulnerabilidad_calor",
        tematica: "ambiental",
        type: "Categorica",
        is_lineLayer: false,
        labels : {
            1: "Poco vulnerable",
            2: "Ligeramente vulnerable",
            3: "Moderadamente vulnerable",
            4: "Muy vulnerable",
            5: "Extremadamente vulnerable"
        },
        categoricalLegend: [
            { value: 1, label: "1 - Poco vulnerable", color: "#fef0d9" },
            { value: 2, label: "2 - Ligeramente vulnerable", color: "#fdcc8a" },
            { value: 3, label: "3 - Moderadamente vulnerable", color: "#fc8d59" },
            { value: 4, label: "4 - Muy vulnerable", color: "#e34a33" },
            { value: 5, label: "5 - Extremadamente vulnerable", color: "#b30000" },
        ],
        enabled: true,
        colonias: true,
        formatValue: (x: number) => {
            return formatNumber(x, 2)
        },
        amountOfColors: 5,
        colors: ["#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000"],
        juarezCard: (data) => {
            return (
                <span>En Ciudad Juárez, el índice promedio de vulnerabilidad al calor, es de <strong>{data.avg}</strong> lo que representa una <strong>vulnerabilidad {data.category}.</strong></span>
            );
        },
        selectionCard: (data) => {
            return (
            <>
                <span>{capitalize(data.introText)} tiene un índice de vulnerabilidad al calor de <strong>{data.avg}</strong>, lo que representa una <strong>vulnerabilidad {data.category}.</strong></span>
                {/*<br/>
                <span>Este índice esta por <strong>{data.compared}</strong> del índice promedio de Ciudad Juarez.</span>*/}
            </>
            );
        },
        getAvgThreshold: (avg: number) => {
            const categories ={
                1: "baja",
                2: "ligeramente baja",
                3: "media",
                4: "ligeramente alta",
                5: "alta"
            }
            return categories[Math.trunc(avg)] || "N/A";
        }
    },
    pob_afectada_inundaciones: {
        title: "Población afectada por inundaciones",
        description: "Porcetaje de la población que durante una lluvia de 60 minutos se ve afectada por un nivel de agua superior a 25 centimetros.",
        source: "X",
        property: "porcentaje_poblacion_inundada",
        propertyAbsolute: "total_poblacion_inundada",
        juarezTotal: (data: any) => {
            //calcula el total sumando la propiedad total_pob_18 de todas las features
            const features = Array.isArray(data) ? data : data?.features;
            if (!features) return 0;
            return features.reduce((sum: number, feature: any) => sum + (feature.properties.total_poblacion || 0), 0);
        },
        tematica: "ambiental",
        type: "Continua",
        is_lineLayer: false,
        colonias: true,
        enabled: true,
        //colors: ["#ddecf6", "#133e62"],
        colors: ["#f4f9ff", "#08316b"],
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.porcentaje_poblacion_inundada !== null );
            data.features.forEach((feature: any) => {
                feature.properties.porcentaje_poblacion_inundada = Math.round(feature.properties.porcentaje_poblacion_inundada * 100);
            })
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
        juarezCard: (data) =>
            <span>En Ciudad Juárez, hay <strong>{(data.num)}</strong> personas afectadas por las inundaciones, lo que representa el <strong>{data.avg}</strong> de la población.</span>,
        selectionCard: (data) => {
            return (
            <>
                <span> En {capitalize(data.introText)} <strong>{data.num}</strong> personas se ven afectadas por las inundaciones lo que representa el <strong>{data.avg}</strong> de la población dentro de esta área.</span>
            </>
            );
        },
                pickable: true,


    },
    superficie_inundada: {
        title: "Porcentaje de superficie inundada",
        description: "Porcetaje de la superficie del AGEB/colonia que se ve afectada por un nivel de agua superior a 25 centimetros durante una lluvia de 60 minutos.",
        source: "X",
        property: "porcentaje_area_inundada",
        propertyAbsolute: "area_inundada_m2",
        juarezTotal: (data: any) => {
            const features = Array.isArray(data) ? data : data?.features;
            if (!features) return 0;
            return features.reduce((sum: number, feature: any) => sum + (feature.properties.total_area_m2 || 0), 0);
        },
        tematica: "ambiental",
        is_lineLayer: false,
        colonias: true,
        enabled: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.porcentaje_area_inundada !== null );
            data.features.forEach((feature: any) => {
                feature.properties.porcentaje_area_inundada = Math.round(feature.properties.porcentaje_area_inundada * 100);
            })
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
        juarezCard: (data) =>
            <span>En Ciudad Juárez, hay <strong>{data.num}</strong> metros cuadrados afectados por las inundaciones, lo que representa el <strong>{data.avg}</strong> de su superficie.</span>,
        selectionCard: (data) => {
            return (
            <>
                <span>En {data.introText}, <strong>{data.num}</strong> metros cuadrados se ven afectados por las inundaciones, lo que representa el <strong>{data.avg}</strong> de su superficie.</span>
            </>
            );
        }
    },
    riesgo_trafico_vehicular: {
        title: "Proximidad a vialidades de alto tráfico vehicular",
        description: "La proximidad al tráfico mide la cantidad de vehículos que circulan a 500 metros de un área determinada (AGEB, colonia).",
        source: "Elaboración propia con datos del Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez",
        property: "tdpa_density",
        tematica: "ambiental",
        //type: "Categorica",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Semaforo",
        geographic_unit: "Líneas de vialidades principales",
        threshold: "",
        year: null,
        enabled: true,
        colonias: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.tdpa_density !== null );
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 1)
        },
        juarezCard: (data) =>
            <span>En Ciudad Juárez, el flujo vehicular en las vialidades de alto tráfico es de <strong>{data.avg}</strong> vehículos</span>,
        /*selectionCard: (data) => {
            return (
            <>
                <span>{capitalize(data.introText)} tiene <strong>{data.avg}</strong>, lo que representa una <strong>vulnerabilidad {data.category}.</strong></span>
                <br/>
                <span>Este índice esta por <strong>{data.comparedToAvg}</strong> del índice promedio de Ciudad Juarez.</span>
            </>
            );
        }*/
       selectionCard: (data) => {
        return (
            <span>
               En {data.introText} X personas están expuestas a alto tráfico vehicular lo que representa el X% de la población dentro de esta área.
            </span>
        )}
    },
    hogares_vulnerables_industria: {
        title: "Hogares expuestos a industrias contaminantes",
        description: "Porcentaje de hogares cercanos a una industria que emite contaminantes in-situ.",
        source: " Elaboración propia con datos del Instituto Nacional de Estadística y Geografía (INEGI), Censo de Población y Vivienda 2020 y la Comisión para la Cooperación Ambiental (CEC). (2025). Taking Stock: North American PRTR Database — Mapa interactivo de emisiones y transferencias [Plataforma en línea]. Recuperado de https://takingstock.cec.org/Map?Culture=en-US&IndustryLevel=4&Measure=3&MediaTypes=29&ReportType=1&ResultType=1&Years=2023 ",
        property: "porcentaje_viviendas_vulnerables_industria",
        propertyAbsolute: "total_viviendas_vulnerables_industria",
        juarezTotal: (data: any) => {
            const features = Array.isArray(data) ? data : data?.features;
            if (!features) return 0;
            return features.reduce((sum: number, feature: any) => sum + (feature.properties.total_viviendas || 0), 0);
        },
        tematica: "industria",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Velocimetro",
        geographic_unit: "AGEB y TIFF",
        threshold: "",
        year: null,
        enabled: true,
        colonias: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.porcentaje_viviendas_vulnerables_industria !== null );
            data.features.forEach((feature: any) => {
                feature.properties.porcentaje_viviendas_vulnerables_industria = Math.round(feature.properties.porcentaje_viviendas_vulnerables_industria * 100);
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
        colors:["#f6ede9", "#8c5c47"],
        juarezCard: (data) =>
            <span>En Ciudad Juárez, hay <strong>{data.num}</strong> hogares expuestos a industrias contaminantes, lo que representa el <strong>{data.avg}</strong> de los hogares.</span>,
        selectionCard: (data) => {
            return (
            <>
                <span>En {data.introText} hay <strong>{data.num}</strong> hogares expuestos a industrias contaminantes, lo que representa el <strong>{data.avg}</strong> de los hogares dentro de esta área.</span>
                <br/>
                <span>Este porcentaje esta por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juarez.</span>
            </>
            );
        },
    },
    infantes_vulnerables_industria: {
        title: "Infancias expuestas a industrias contaminantes",
        description: "Porcentaje de niños menores a 5 años cercanos a una industria que emite contaminantes in-situ.",
        source: "Elaboración propia con datos del Instituto Nacional de Estadística y Geografía (INEGI), Censo de Población y Vivienda 2020 y la Comisión para la Cooperación Ambiental (CEC). (2025). Taking Stock: North American PRTR Database — Mapa interactivo de emisiones y transferencias [Plataforma en línea]. Recuperado de https://takingstock.cec.org/Map?Culture=en-US&IndustryLevel=4&Measure=3&MediaTypes=29&ReportType=1&ResultType=1&Years=2023 ",
        property: "porcentaje_infantes_vulnerables_industria",
        propertyAbsolute: "total_infantes_vulnerables_industria",
        juarezTotal: (data) => {
            const features = Array.isArray(data) ? data : data?.features;
            if (!features) return 0;
            return features.reduce((sum: number, feature: any) => sum + (feature.properties.total_pob_0a5 || 0), 0);
        },
        tematica: "industria",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Velocimetro",
        geographic_unit: "AGEB y TIFF",
        threshold: "",
        year: null,
        enabled: true,
        colonias: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.porcentaje_infantes_vulnerables_industria !== null);
            data.features.forEach((feature: any) => {
                feature.properties.porcentaje_infantes_vulnerables_industria = Math.round(feature.properties.porcentaje_infantes_vulnerables_industria * 100);
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
        colors:["#f6ede9", "#8c5c47"],
        juarezCard: (data) =>
            <span>En Ciudad Juárez, hay <strong>{data.num}</strong> infantes de 0 a 5 años expuestos a industrias contaminantes, lo que representa el <strong>{data.avg}</strong> de la población.</span>,
        selectionCard: (data) => {
            return (
            <>
                <span>En {data.introText} hay <strong>{data.num}</strong> infantes de 0 a 5 años expuestos a industrias contaminantes, lo que representa el <strong>{data.avg}</strong> de la población dentro de esta área.</span>
                <br/>
                <span>Este porcentaje está por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juárez.</span>
            </>
            );
        }
    },
    adultos_vulnerables_industria: {
        title: "Adultos mayores expuestos a industrias contaminantes",
        description: "% de infantes y adultos mayores que tienen en un radio de 5 km al menos 1 industria",
        source: "Elaboración propia con datos del Instituto Nacional de Estadística y Geografía (INEGI), Censo de Población y Vivienda 2020 y la Comisión para la Cooperación Ambiental (CEC). (2025). Taking Stock: North American PRTR Database — Mapa interactivo de emisiones y transferencias [Plataforma en línea]. Recuperado de https://takingstock.cec.org/Map?Culture=en-US&IndustryLevel=4&Measure=3&MediaTypes=29&ReportType=1&ResultType=1&Years=2023",
        property: "porcentaje_adultos_mayores_vulnerables_industria",
        propertyAbsolute: "total_adultos_mayores_vulnerables_industria",
        juarezTotal: (data) => {
            const features = Array.isArray(data) ? data : data?.features;
            if (!features) return 0;
            return features.reduce((sum: number, feature: any) => sum + (feature.properties.total_pob_60 || 0), 0);
        },
        tematica: "industria",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Velocimetro",
        geographic_unit: "AGEB y TIFF",
        threshold: "",
        year: null,
        enabled: true,
        colonias: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.porcentaje_adultos_mayores_vulnerables_industria !== null);
            data.features.forEach((feature: any) => {
                feature.properties.porcentaje_adultos_mayores_vulnerables_industria = Math.round(feature.properties.porcentaje_adultos_mayores_vulnerables_industria * 100);
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
        colors:["#f6ede9", "#8c5c47"],
        juarezCard: (data) =>
            <span>En Ciudad Juárez, hay <strong>{data.num}</strong> adultos de 60 años o más expuestos a industrias contaminantes, lo que representa el <strong>{data.avg}</strong> de la población.</span>,
        selectionCard: (data) => {
            return (
            <>
                <span>En {data.introText} hay <strong>{data.num}</strong> adultos mayores de 60 años o más expuestos a industrias contaminantes, lo que representa el <strong>{data.avg}</strong> de la población.</span>
                <br/>
                <span>Este porcentaje esta por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juarez.</span>
            </>
            );
        }
    },
    //EJEMPLO DE CAPA
    industrias: {
        capa: true,
        url: `https://justiciaambientalstore.blob.core.windows.net/data/industrias_denue.geojson?${REACT_APP_SAS_TOKEN}`,
        title: "Industrias",
        description: "Industrias de las categorías: - Energía electrica, agua y gas (22), – Industrias manufactureras de alimentos textiles y tabaco (31), – Manufactureras de madera, papel, quimicos y plástico (33), – Electronicos maquinaria y equipo (56) que están localizadas en el perímetro urbano de Ciudad Juárez.",
        source: "Elaboración propia con base en datos del Instituto Nacional de Estadística y Geografía (INEGI).",
        property: "sector",
        tematica: "industria",
        type: "Categorica",
        is_lineLayer: false,
        is_PointLayer: true,
        enabled: true,
        colonias: false,
        labels : {
            "Industrias manufactureras de alimentos textiles y tabaco": "",
            "Manufactureras de madera, papel, quimicos y plástico": "",
            "Energía electrica, agua y gas": "",
            "Electronicos maquinaria y equipo": "",
        },
        categoricalLegend: [
            { value: "Industrias manufactureras de alimentos textiles y tabaco", label: "Industrias manufactureras de alimentos textiles y tabaco", color: "#fef0d9" },
            { value: "Manufactureras de madera, papel, quimicos y plástico", label: "Manufactureras de madera, papel, quimicos y plástico", color: "#fdcc8a" },
            { value: "Energía electrica, agua y gas", label: "Energía electrica, agua y gas", color: "#fc8d59" },
            { value: "Electronicos maquinaria y equipo", label: "Electronicos maquinaria y equipo", color: "#e34a33" },
        ],
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.industria !== null);
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + " kg m2"
        },
        colors: [ "#993232ff", "#372516", "#cabe0eff", "#0f4e77"],
        trimOutliers: false,
        juarezCard: (data) =>
            <span>Descripcion fixed de capa</span>,
        selectionCard: (data) => {
            return (
            <>
                <span>En {data.introText} la exposición a contaminantes industriales es de <strong>{data.avg}/km² </strong>.</span>
                <br/>
                <span>Este porcentaje esta por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juarez.</span>
            </>
            );
        },
        graphs: [
        {
            title: "On-site",
            source: "Fuente de ejemplo",
            option: (data: any) => {
                const industrias: any = {};
                const colorMap = {
                    "Industrias manufactureras de alimentos textiles y tabaco": "#993232ff",
                    "Manufactureras de madera, papel, quimicos y plástico": "#372516",
                    "Energía electrica, agua y gas": "#cabe0eff",
                    "Electronicos maquinaria y equipo": "#0f4e77",
                };
                Object.values(data).forEach((industry: any) => {
                    const sector = industry.properties["sector"];
                    if(sector) {
                        if(!industrias[sector]) {
                            industrias[sector] = 0;
                        }
                        industrias[sector] += 1;
                    }
                });
                console.log('industrias', industrias);
                return {
                    /*title: {
                        text: 'On-site',
                        left: 'center',
                        textStyle: { fontSize: '18px' },
                    },*/
                    tooltip: {
                        show: true,
                        formatter: function (info) {
                        return `<b>${info.name}</b><br/>${(info.value)}`;
                        },
          //              textStyle : { fontSize: 'var(--font-size-body)' },
                        position: function (point, params, dom, rect, size) {
                            const tooltipWidth = size.contentSize[0];
                            const x = point[0] - tooltipWidth / 2;
                            const y = point[1] - 50; // 24px arriba del mouse, ajusta si quieres más cerca/lejos
                            return [x, y];
                        },
                        padding: [5, 10],
                        backgroundColor: 'rgba(50, 50, 50, 0.7)',
                        textStyle: {
                            color: '#fff',
                            fontSize: 10,
                            fontFamily: 'Roboto, sans-serif',
                        }
                    },
                    series: [
                        {
                        name: 'On-site releases',
                        type: 'treemap',
                        breadcrumb: { show: false },
                        roam: false,
                        nodeClick: false,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: '100%',
                        //width: '100%',
                        //visibleMin: 100,
                        label: {
                            show: true,
                            formatter: '{b}',
                            
                            //fontSize: 10,
                            //fontSize: 'var(--font-size-button)',
                            overflow: 'breakAll'
                        },
                        /*upperLabel: {
                            show: true,
                            height: 30
                        },*/
                        itemStyle: {
                            borderColor: '#fff',
                        },
                        data: Object.entries(industrias).map(([name, value]) => ({
                            name: name,
                            value,
                            itemStyle: { color: colorMap[name] || '#000' }
                        })),
                    }, 

                ],
            }
        }
        },
    ]
    },
    //EJEMPLO DE CAPA
    industrias_contaminantes: {
        //url de layer
        capa: true,
        url: `https://justiciaambientalstore.blob.core.windows.net/data/industry_points.geojson?${REACT_APP_SAS_TOKEN}`,
        jsonurl: `https://justiciaambientalstore.blob.core.windows.net/data/releases.json?${REACT_APP_SAS_TOKEN}`,
        title: "Industrias contaminantes",
        description: "Industrias en el perímetro urbano de Ciudad Juárez que reportan su producción de sustancias contaminantes.",
        source: "Elaboración propia con datos de la Comisión para la Cooperación Ambiental (CEC). (2025). Taking Stock: North American PRTR Database — Mapa interactivo de emisiones y transferencias [Plataforma en línea]. Recuperado de https://takingstock.cec.org/Map?Culture=en-US&IndustryLevel=4&Measure=3&MediaTypes=29&ReportType=1&ResultType=1&Years=2023",
        property: "ID",
        tematica: "industria",
        type: "Continua",
        is_lineLayer: false,
        is_PointLayer: true,
        contaminantes: ['ID', 'CVEGEO', 'release', 'bin'],
        enabled: true,
        colonias: false,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.ID !== null);
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + " kg m2"
        },
        colors:["#a03a2dff", "#a72e19ff"],
        trimOutliers: false,
        juarezCard: (data) =>
            <span>Descripcion fixed de capa</span>,
        selectionCard: (data) => {
            return (
            <>
                <span>En {data.introText} la exposición a contaminantes industriales es de <strong>{data.avg}/km² </strong>.</span>
                <br/>
                <span>Este porcentaje esta por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juarez.</span>
            </>
            );
        },
        pickable: true,
        graphs: [
        {
            title: "On-site",
            source: "Fuente de ejemplo",
            legend: {
                "Plomo (y sus componentes)": "#8C4242",
                "Mercurio (y sus componentes)": "#592115",
                "Níquel (y sus componentes)": "#BF964B",
                "Arsenico (y sus componentes)": "#444b6e",
                "Cromo (y sus componentes)": "#7c7b7f",
                "Diisocianatos": "#73722F"
            },
            option: (data: any) => {
                const contaminants: any = {};
                const colorMap = {
                    "Lead (and its compounds)": "#8C4242",
                    "Mercury (and its compounds)": "#592115",
                    "Nickel (and its compounds)": "#BF964B",
                    "Arsenic (and its compounds)": "#444b6e",
                    "Chromium (and its compounds)": "#7c7b7f",
                    "Diisocyanates": "#73722F"
                };
               const nameMap = {
                    "Lead (and its compounds)": "Plomo (y sus componentes)",
                    "Mercury (and its compounds)": "Mercurio (y sus componentes)",
                    "Nickel (and its compounds)": "Níquel (y sus componentes)",
                    "Arsenic (and its compounds)": "Arsenico (y sus componentes)",
                    "Chromium (and its compounds)": "Cromo (y sus componentes)",
                    "Diisocyanates": "Diisocianatos"
                };
                Object.values(data).forEach((industry: any) => {
                    const offSite = industry.releases_by_pollutant["On-site releases"];
                    if(offSite) {
                        Object.entries(offSite).forEach(([pollutant, value]) => {
                            if(!contaminants[pollutant]) {
                                contaminants[pollutant] = 0;
                            }
                            contaminants[pollutant] += value;
                        });
                    }
                });
                return {
                    /*title: {
                        text: 'On-site',
                        left: 'center',
                        textStyle: { fontSize: '18px' },
                    },*/
                    tooltip: {
                        show: true,
                        formatter: function (info) {
                        return `<b>${info.name}</b><br/>${Number(info.value).toFixed(2)} kg`;
                        },
          //              textStyle : { fontSize: 'var(--font-size-body)' },
                        position: function (point, params, dom, rect, size) {
                            // Centrado horizontal respecto a la barra, arriba del mouse
                            // size.contentSize[0] es el ancho del tooltip
                            // point[0] es la posición X del mouse
                            // point[1] es la posición Y del mouse
                            const tooltipWidth = size.contentSize[0];
                            const x = point[0] - tooltipWidth / 2;
                            const y = point[1] - 50; // 24px arriba del mouse, ajusta si quieres más cerca/lejos
                            return [x, y];
                        },
                        padding: [5, 10],
                        backgroundColor: 'rgba(50, 50, 50, 0.7)',
                        textStyle: {
                            color: '#fff',
                            fontSize: 10,
                            fontFamily: 'Roboto, sans-serif',
                        }
                    },
                    series: [
                        {
                        name: 'On-site releases',
                        type: 'treemap',
                        breadcrumb: { show: false },
                        roam: false,
                        nodeClick: false,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: '100%',
                        //width: '100%',
                        //visibleMin: 100,
                        label: {
                            show: true,
                            //formatter: '{b}',
                            formatter: function(params) {
                                // params.value es el valor del nodo
                                return params.value > 1500 ? params.name : '';
                            },
                            //fontSize: 10,
                            //fontSize: 'var(--font-size-button)',
                            overflow: 'breakAll'
                        },
                        /*upperLabel: {
                            show: true,
                            height: 30
                        },*/
                        itemStyle: {
                            borderColor: '#fff',
                        },
                        data: Object.entries(contaminants).map(([name, value]) => ({
                            name: nameMap[name] || name,
                            value,
                            itemStyle: { color: colorMap[name] || '#000' }
                        })),
                    }, 

                ],
            }
        }
        },
        {
            title: "Off-site",
            source: "Fuente de ejemplo",
            legend: {
                "Plomo (y sus componentes)": "#8C4242",
                "Mercurio (y sus componentes)": "#592115",
                "Níquel (y sus componentes)": "#BF964B",
                "Arsenico (y sus componentes)": "#444b6e",
                "Cromo (y sus componentes)": "#7c7b7f",
                "Diisocianatos": "#73722F"
            },
            option: (data: any) => {
                const contaminants: any = {};
                const colorMap = {
                    "Lead (and its compounds)": "#8C4242",
                    "Mercury (and its compounds)": "#592115",
                    "Nickel (and its compounds)": "#BF964B",
                    "Arsenic (and its compounds)": "#444b6e",
                    "Chromium (and its compounds)": "#7c7b7f",
                    "Diisocyanates": "#73722F"
                };
               const nameMap = {
                    "Lead (and its compounds)": "Plomo (y sus componentes)",
                    "Mercury (and its compounds)": "Mercurio (y sus componentes)",
                    "Nickel (and its compounds)": "Níquel (y sus componentes)",
                    "Arsenic (and its compounds)": "Arsenico (y sus componentes)",
                    "Chromium (and its compounds)": "Cromo (y sus componentes)",
                    "Diisocyanates": "Diisocianatos"
                };
                Object.values(data).forEach((industry: any) => {
                    const offSite = industry.releases_by_pollutant["Off-site releases"];
                    if(offSite) {
                        Object.entries(offSite).forEach(([pollutant, value]) => {
                            if(!contaminants[pollutant]) {
                                contaminants[pollutant] = 0;
                            }
                            contaminants[pollutant] += value;
                        });
                    }
                });
                return {
                    /*title: {
                        text: 'Off-site',
                        left: 'center',
                        textStyle: { fontSize: '18px' },
                    },*/
                    tooltip: {
                        show: true,
                        formatter: function (info) {
                        return `<b>${info.name}</b><br/>${Number(info.value).toFixed(2)} kg/km²`;
                        },
          //              textStyle : { fontSize: 'var(--font-size-body)' },
                        position: function (point, params, dom, rect, size) {
                            // Centrado horizontal respecto a la barra, arriba del mouse
                            // size.contentSize[0] es el ancho del tooltip
                            // point[0] es la posición X del mouse
                            // point[1] es la posición Y del mouse
                            const tooltipWidth = size.contentSize[0];
                            const x = point[0] - tooltipWidth / 2;
                            const y = point[1] - 50; // 24px arriba del mouse, ajusta si quieres más cerca/lejos
                            return [x, y];
                        },
                        padding: [5, 10],
                        backgroundColor: 'rgba(50, 50, 50, 0.7)',
                        textStyle: {
                            color: '#fff',
                            fontSize: 10,
                            fontFamily: 'Roboto, sans-serif',
                        }
                    },
                series: [
                    {
                    name: 'Off-site releases',
                    type: 'treemap',
                    breadcrumb: { show: false },
                    roam: false,
                    nodeClick: false,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: '100%',
                    label: {
                        show: true,
                        //formatter: '{b}',
                        formatter: function(params) {
                            // params.value es el valor del nodo
                            return params.value > 1500 ? params.name : '';
                        },
                        //fontSize: 10,
                        //fontSize: 'var(--font-size-button)',
                        overflow: 'breakAll'
                    },
                    itemStyle: {
                        borderColor: '#fff',
                    },
                    data: Object.entries(contaminants).map(([name, value]) => ({
                        name: nameMap[name] || name,
                        value,
                        itemStyle: { color: colorMap[name] || '#000' }
                    })),
                },

            ],
        }
            }
        }
        ]
    },
    //capa
    equipamientos: {
        capa: true,
        url: `https://justiciaambientalstore.blob.core.windows.net/data/equipamientos.geojson?${REACT_APP_SAS_TOKEN}`,
        title: "Equipamientos", //"Número y tipos de equipamientos",
        description: "Numero de equipamientos por tipo (salud, educación, recreativos y cuidados)",
        source: "Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez",
        property: "group",
        tematica: "equipamiento",
        type: "Categorica",
        is_PointLayer: true,
        enabled: true,
        colonias: false,
        labels : {
            "educacion": "",
            "salud": "",
            "recreativo": "",
            "parque": "",
        },
        categoricalLegend: [
            { value: "educacion", label: "Educación", color: "#e9c46a" },
            { value: "salud", label: "Salud", color: "#4abfbd" },
            { value: "recreativo", label: "Recreativo", color: "#e76f51" },
            { value: "parque", label: "Parque", color: "#8ab17d" }
        ],
        dataProcesssing: (data: any) => {
            const equipamiento_Groups: any = {
                "guarderia": "educacion",
                "preescolar": "educacion",
                "primaria": "educacion",
                "secundaria": "educacion",
                "preparatoria": "educacion",
                "universidad": "educacion",
                "auditorio": "recreativo",
                "biblioteca": "recreativo",
                "cine": "recreativo",
                "parque": "parque",
                "unidad_deportiva": "recreativo",
                "centro_salud": "salud",
                "hospital": "salud",
            }
            data.features = data.features.filter((feature: any) => feature.properties.equipamiento !== null);
            data.features.forEach((feature: any) => {
                feature.properties.group = equipamiento_Groups[feature.properties.equipamiento];
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0)
        },
        colors: [ "#e9c46a", "#e76f51", "#8ab17d", "#4abfbd"],
        trimOutliers: false,
        juarezCard: (data) =>
            <span>Descripcion fixed de capa</span>,
        selectionCard: (data) => {
            return (
            <>
                <span>En {data.introText} la exposición a contaminantes industriales es de <strong>{data.avg}/km² </strong>.</span>
                <br/>
                <span>Este porcentaje esta por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juarez.</span>
            </>
            );
        },
        graphs: [
        {
            title: "Total de equipamientos por tipo",
            source: "Fuente de ejemplo",
            option: (data: any) => {
                const equipamientos: any = {};
                //agrupar por categoria
                const equip_byCategory = Object.groupBy(data, (item: any) => item.properties.group);
                console.log('equip_byCategory', equip_byCategory);
                //const categories = Object.keys(equip_byCategory);
                const colorMap = {
                    "educacion": "#e9c46a",
                    "salud": "#4abfbd",
                    "recreativo": "#e76f51",
                    "parque": "#8ab17d",
                };
                //recorrer categorias y contar por
                const treeData = Object.entries(equip_byCategory).map(([category, items]) => {
                    const counts: Record<string, number> = {};
                    items.forEach((item: any) => {
                        const tipo = item.properties.equipamiento;
                        if (!tipo) return;
                        counts[tipo] = (counts[tipo] || 0) + 1;
                    });
                    return {
                        name: category,
                        children: Object.entries(counts).map(([tipo, value]) => ({
                        name: tipo,
                        value,
                        itemStyle: { color: colorMap[category] || '#000' }
                        }))
                    };
                });
                /*Object.values(data).forEach((industry: any) => {
                    const group = industry.properties["group"];
                    if(group) {
                        if(!equipamientos[group]) {
                            equipamientos[group] = 0;
                        }
                        equipamientos[group] += 1;
                    }
                });
                console.log('equipamientos', equipamientos);*/
                return {
                    tooltip: {
                        show: true,
                        formatter: function (info) {
                        return `<b>${info.name}</b><br/>${info.value}`;
                        },
          //              textStyle : { fontSize: 'var(--font-size-body)' },
                        position: function (point, params, dom, rect, size) {
                            // Centrado horizontal respecto a la barra, arriba del mouse
                            // size.contentSize[0] es el ancho del tooltip
                            // point[0] es la posición X del mouse
                            // point[1] es la posición Y del mouse
                            const tooltipWidth = size.contentSize[0];
                            const x = point[0] - tooltipWidth / 2;
                            const y = point[1] - 50; // 24px arriba del mouse, ajusta si quieres más cerca/lejos
                            return [x, y];
                        },
                        padding: [5, 10],
                        backgroundColor: 'rgba(50, 50, 50, 0.7)',
                        textStyle: {
                            color: '#fff',
                            fontSize: 10,
                            fontFamily: 'Roboto, sans-serif',
                        }
                    },
                    series: [
                        {
                        name: 'Equipamientos',
                        type: 'treemap',
                        breadcrumb: { show: false },
                        roam: false,
                        nodeClick: false,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: '100%',
                        //width: '100%',
                        //visibleMin: 100,
                        label: {
                            show: true,
                            formatter: '{b}',
                            
                            //fontSize: 10,
                            //fontSize: 'var(--font-size-button)',
                            overflow: 'breakAll'
                        },
                        /*upperLabel: {
                            show: true,
                            height: 30
                        },*/
                        itemStyle: {
                            borderColor: '#fff',
                        },
                        //levels: getLevelOption(),
                        data: treeData,
                    }, 

                ],
            }
        }
        },
    ]
    },
    indice_accesibilidad: {
        title: "Índice de Accesibilidad a Equipamientos",
        description: "Métrica combinada que toma en cuenta el tiempo de viaje a equipamientos educativos, de salud, y recreativos. Entre más alta, más facil es acceder a ellos.",
        source: "Elaboración propia con base en datos del Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez y OpenStreetMap (OSM).",
        property: "indice_accesibilidad",
        tematica: "equipamiento",
        type: "Continua",
        enabled: true,
        colonias: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.indice_accesibilidad !== null);
            data.features.forEach((feature: any) => {
                feature.properties.indice_accesibilidad = Math.round(feature.properties.indice_accesibilidad * 100);
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) 
        },
        juarezCard: (data) =>
            <span>En Ciudad Juárez, el índice promedio de accesibilidad es de <strong>{data.avg}</strong> puntos sobre 100.</span>,
        selectionCard: (data) => {
            return (
            <>
                <span>En {data.introText} el índice promedio de accesibilidad es de <strong>{data.avg}</strong> puntos sobre 100.</span>
                <br/>
                <span>Este índice está por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juárez.</span>
            </>
            );
        }
    },
    tiempo_recreativos: {
        title: "Tiempo promedio a espacios recreativos",
        description: "Índice que mide el tiempo promedio de acceso a espacios recreativos.",
        source: "Elaboración propia con base en datos del Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez y OpenStreetMap (OSM).",
        property: "tiempo_parque",
        tematica: "equipamiento",
        type: "Continua",
        enabled: true,
        colonias: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.tiempo_parque !== null);
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + " min"
        },
        juarezCard: (data) =>
            <span>En Ciudad Juárez, el tiempo promedio de viaje a pie al espacio recreativo más cercano es de <strong>{data.avg}</strong>. Este tiempo es considerado <strong>{data.category}</strong>.</span>,
        selectionCard: (data) => {
            return (
            <>
                <span>En {data.introText} el tiempo promedio de viaje a pieal espacio recreativo más cercano es de <strong>{data.avg}</strong>.</span>
                <br/>
                <span>Este tiempo es considerado <strong>{data.category}</strong></span>
            </>
            );
        },
        getAvgThreshold: (avg: number) => {
            if(avg < 5) return "muy accesible (a pie)";
            if(avg >= 5 && avg < 20) return "accesible";
            else return "poco accesible";
        },
    },
    tiempo_hospitales: {
        title: "Tiempo promedio a hospitales o clínicas",
        description: "Índice que mide el tiempo promedio de acceso a equipamientos de salud",
        source: "Elaboración propia con base en datos del Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez y OpenStreetMap (OSM).",
        property: "tiempo_clinica_hospital",
        tematica: "equipamiento",
        type: "Continua",
        enabled: true,
        colonias: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.tiempo_clinica_hospital !== null);
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + " min"
        },
        juarezCard: (data) =>
            <span>En Ciudad Juárez, el tiempo promedio de viaje a pie al hospital o clinica más cercana es de <strong>{data.avg}</strong>. Este tiempo es considerado <strong>{data.category}</strong>.</span>,
        selectionCard: (data) => {
            return (
            <>
                <span>En {data.introText} el tiempo promedio de viaje a pie al hospital o clinica más cercana es de <strong>{data.avg}</strong>.</span>
                <br/>
                <span>Este tiempo es considerado <strong>{data.category}</strong></span>
            </>
            );
        },
        getAvgThreshold: (avg: number) => {
            if(avg < 20) return "muy accesible";
            if(avg >= 20 && avg < 60) return "accesible";
            else return "poco accesible";
        },
    },
    tiempo_preparatorias: {
        title: "Tiempo promedio a preparatorias",
        description: "Índice que mide el tiempo promedio de acceso a preparatorias",
        source: "Elaboración propia con base en datos del Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez y OpenStreetMap (OSM).",
        property: "tiempo_preparatoria",
        tematica: "equipamiento",
        type: "Continua",
        enabled: true,
        colonias: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.tiempo_preparatoria !== null);
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + " min"
        },
        juarezCard: (data) =>
            <span>En Ciudad Juárez, el tiempo promedio de viaje a pie a la preparatoria más cercana es de <strong>{data.avg}</strong>. Este tiempo es considerado <strong>{data.category}</strong>.</span>,
        selectionCard: (data) => {
            return (
            <>
                <span>En {data.introText} el tiempo promedio de viaje a pie a la preparatoria más cercana es de <strong>{data.avg}</strong>.</span>
                <br/>
                <span>Este tiempo es considerado <strong>{data.category}</strong></span>
            </>
            );
        },
        getAvgThreshold: (avg: number) => {
            if(avg < 15) return "muy accesible";
            if(avg >= 15 && avg < 45) return "accesible";
            else return "poco accesible";
        },
    },
    acceso_recreativos: {
        title: "Acceso a espacios recreativos",
        description: "Porcentaje de hogares con acceso a espacio recreativo a 15 minutos.",
        source: "Elaboración propia con base en datos del Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez y OpenStreetMap (OSM).",
        property: "porcentaje_hogares_parque_15min",
        propertyAbsolute: "total_hogares_parque_15min",
        juarezTotal: (data) => {
           const features = Array.isArray(data) ? data : data?.features;
            if (!features) return 0;
            return features.reduce((sum: number, feature: any) => sum + (feature.properties.total_viviendas || 0), 0);
        },
        tematica: "equipamiento",
        type: "Continua",
        enabled: true,
        colonias: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.porcentaje_hogares_parque_15min !== null);
            data.features.forEach((feature: any) => {
                feature.properties.porcentaje_hogares_parque_15min = Math.round(feature.properties.porcentaje_hogares_parque_15min * 100);
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
        juarezCard: (data) =>
            <span>En Ciudad Juárez, hay <strong>{data.num}</strong> hogares con al menos un espacio recreativo a 15 minutos caminando, lo que representa el <strong>{data.avg}</strong> de los hogares.</span>,
        selectionCard: (data) => {
            return (
            <>
                <span>En {data.introText} hay <strong>{data.num}</strong> hogares con al menos un espacio recreativo a 15 minutos caminando, lo que representa el <strong>{data.avg}</strong> de los hogares dentro de esta área.</span>
                <br/>
                <span>Este porcentaje esta por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juarez.</span>
            </>
            );
        }
    },
    acceso_hospitales: {
        title: "Acceso a hospitales o clínicas",
        description: "Porcentaje de hogares con acceso a hospitales o clinicas a 30 minutos.",
        source: "Elaboración propia con base en datos del Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez y OpenStreetMap (OSM).",
        property: "porcentaje_hogares_clinica_hospital_30min",
        propertyAbsolute: "total_hogares_clinica_hospital_30min",
        juarezTotal: (data) => {
           const features = Array.isArray(data) ? data : data?.features;
            if (!features) return 0;
            return features.reduce((sum: number, feature: any) => sum + (feature.properties.total_viviendas || 0), 0);
        },
        tematica: "equipamiento",
        type: "Continua",
        enabled: true,
        colonias: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.porcentaje_hogares_clinica_hospital_30min !== null);
            data.features.forEach((feature: any) => {
                feature.properties.porcentaje_hogares_clinica_hospital_30min = Math.round(feature.properties.porcentaje_hogares_clinica_hospital_30min * 100);
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
        juarezCard: (data) =>
            <span>En Ciudad Juárez, hay <strong>{data.num}</strong> hogares con al menos un hospital o clínica a 30 minutos caminando, lo que representa el <strong>{data.avg}</strong> de los hogares.</span>,
        selectionCard: (data) => {
            return (
            <>
                <span>En {data.introText} el <strong>{data.avg}</strong> de los hogares tienen acceso a hospitales o clínicas en 30 minutos.</span>
                <br/>
                <span>Este porcentaje esta por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juarez.</span>
            </>
            );
        }
    },
    acceso_preparatorias: {
        title: "Acceso a preparatorias",
        description: "Porcentaje de hogares con acceso a preparatorias a 30 minutos.",
        source: "Elaboración propia con base en datos del Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez y OpenStreetMap (OSM).",
        property: "porcentaje_hogares_preparatoria_30min",
        propertyAbsolute: "total_hogares_preparatoria_30min",
        juarezTotal: (data) => {
           const features = Array.isArray(data) ? data : data?.features;
            if (!features) return 0;
            return features.reduce((sum: number, feature: any) => sum + (feature.properties.total_viviendas || 0), 0);
        },
        tematica: "equipamiento",
        type: "Continua",
        enabled: true,
        colonias: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.porcentaje_hogares_preparatoria_30min !== null);
            data.features.forEach((feature: any) => {
                feature.properties.porcentaje_hogares_preparatoria_30min = Math.round(feature.properties.porcentaje_hogares_preparatoria_30min * 100);
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
        //colors: ["#f4f9ff", "#846b9eff", "#483a57ff"],
        colors: ["#b7c6e6", "#a58dc0ff", "#846b9eff", "#61457fff","#38264cff"],
        juarezCard: (data) =>
            <span>En Ciudad Juárez, hay <strong>{data.num}</strong> hogares con al menos una preparatoria a 30 minutos caminando, lo que representa el <strong>{data.avg}</strong> de los hogares.</span>,
        selectionCard: (data) => {
            return (
            <>
                <span>En {data.introText} hay <strong>{data.num}</strong> hogares con al menos una preparatoria a 30 minutos caminando, lo que representa el <strong>{data.avg}</strong> de los hogares de esta área.</span>
                <br/>
                <span>Este porcentaje está por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juárez.</span>
            </>
            );
        }
    },
    ingreso: {
        title: "Ingreso promedio per cápita ",
        description: "Ingreso promedio per cápita mensual en pesos mexicanos de la población económicamente activa.",
        source: "Elaboración propia con base en datos del INEGI; Encuesta Nacional de Ingresos y Gastos de los Hogares (ENIGH), 2018; y Censo de Población y Vivienda, 2020.",
        property: "ingreso",
        tematica: "poblacion",
        type: "Continua",
        enabled: true,
        colonias: false,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.ingreso > 0);
            data.features.forEach((feature: any) => {
                feature.properties.ingreso = Math.round(feature.properties.ingreso * 19 * 1000 / 12);
            });
            return data;
        },
        formatValue: (x: number) => {
            return '$' + formatNumber(x, 0)
        },
        colors: ["#f4f9ff", "#08316b"],
        juarezCard: (data) =>
            <span>En Ciudad Juárez, el ingreso promedio per cápita es de <strong>{data.avg}</strong>.</span>,
        selectionCard: (data) => {
            return (
            <>
                <span>En {data.introText} el ingreso promedio per cápita es de <strong>{data.avg}</strong>.</span>
                <br/>
                <span>Su ingreso promedio per cápita está por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juarez.</span>
            </>
            );
        }
    },
    porcentaje_pob_0a5: {
        title: "Infancias",
        description: "Porcentaje de población de 0 y 5 años.",
        source: "Instituto Nacional de Estadística y Geografía (INEGI), Censo de Población y Vivienda, 2020.",
        property: "porcentaje_pob_0a5",
        propertyAbsolute: "total_pob_0a5",
        juarezTotal: (data) => {
            const features = Array.isArray(data) ? data : data?.features;
            if (!features) return 0;
            return features.reduce((sum: number, feature: any) => sum + (feature.properties.total_poblacion || 0), 0);
        },
        tematica: "poblacion",
        type: "Continua",
        enabled: true,
        colonias: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.porcentaje_pob_0a5 !== null);
            data.features.forEach((feature: any) => {
                feature.properties.porcentaje_pob_0a5 = Math.round(feature.properties.porcentaje_pob_0a5 * 100);
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
        colors: ["#f4f9ff", "#08316b"],
        juarezCard: (data) =>
            <span>En Ciudad Juárez, hay <strong>{data.num}</strong> infantes de 0 a 5 años, lo que representa el <strong>{data.avg}</strong> de la población.</span>,
        selectionCard: (data) => {
            return (
            <>
                <span>En {data.introText} hay <strong>{data.num}</strong> infantes de 0 a 5 años, lo que representa el <strong>{data.avg}</strong> de la población dentro de esta área.</span>
                <br/>
                <span>Este porcentaje está por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juárez.</span>
            </>
            );
        }
    },
    porcentaje_pob_60: {
        title: "Adultos mayores",
        description: "Porcentaje de población de 60 años o más.",
        source: "Instituto Nacional de Estadística y Geografía (INEGI), Censo de Población y Vivienda, 2020.",
        property: "porcentaje_pob_60",
        propertyAbsolute: "total_pob_60",
        juarezTotal: (data) => {
           const features = Array.isArray(data) ? data : data?.features;
            if (!features) return 0;
            return features.reduce((sum: number, feature: any) => sum + (feature.properties.total_poblacion || 0), 0);
        },
        tematica: "poblacion",
        type: "Continua",
        enabled: true,
        colonias: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.porcentaje_pob_60 !== null);
            data.features.forEach((feature: any) => {
                feature.properties.porcentaje_pob_60 = Math.round(feature.properties.porcentaje_pob_60 * 100);
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
        colors: ["#f4f9ff", "#08316b"],
        juarezCard: (data) =>
            <span>En Ciudad Juárez, hay <strong>{data.num}</strong> adultos de 60 años o más, lo que representa el <strong>{data.avg}</strong> de la población.</span>,
        selectionCard: (data) => {
            return (
            <>
                <span>En {data.introText} hay <strong>{data.num}</strong> adultos de 60 años o más, lo que representa el <strong>{data.avg}</strong> de la población dentro de esta área.</span>
                <br/>
                <span>Este porcentaje está por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juárez.</span>
            </>
            );
        }
    },
    porcentaje_escolaridad: {
        title: "Población sin preparatoria terminada",
        description: "Porcentaje de la población mayor de 18 años que reportó tener menos de 12 años de escolaridad (preparatoria).",
        source: "Instituto Nacional de Estadística y Geografía (INEGI), Censo de Población y Vivienda, 2020.",
        property: "porcentaje_menos_prepa_terminada",
        propertyAbsolute: "total_menos_prepa_terminada",
        juarezTotal: (data: any) => {
            //calcula el total sumando la propiedad total_pob_18 de todas las features
            const features = Array.isArray(data) ? data : data?.features;
            if (!features) return 0;
            return features.reduce((sum: number, feature: any) => sum + (feature.properties.total_pob_18 || 0), 0);
        },
        tematica: "poblacion",
        type: "Continua",
        enabled: true,
        colonias: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.porcentaje_menos_prepa_terminada !== null);
            data.features.forEach((feature: any) => {
                feature.properties.porcentaje_menos_prepa_terminada = Math.round(feature.properties.porcentaje_menos_prepa_terminada * 100);
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
        colors: ["#f4f9ff", "#08316b"],
        juarezCard: (data) =>
            <span>En Ciudad Juárez, <strong>{data.num}</strong> personas no cuentan con la preparatoria terminada, lo que representa el <strong>{data.avg}</strong> de la población.</span>,
        selectionCard: (data) => {
            return (
            <>
                <span>En {data.introText} hay <strong>{data.num}</strong> personas no cuentan con la preparatoria terminada, lo que representa el <strong>{data.avg}</strong> de la población dentro de esta área.</span>
                <br/>
                <span>Este porcentaje está por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juárez.</span>
            </>
            );
        }
    },
    indice_bienestar: {
        title: "Nivel del Bienestar",
        description: "El Nivel de Bienestar mide las condiciones económicas, sociales y culturales de la población —como educación, vivienda y servicios— y clasifica a cada zona en cinco niveles: muy bajo, bajo, medio, alto y muy alto.",
        source: "Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez, 2020.",
        property: "indice_bienestar",
        //propertyAbsolute: "indice_bienestar",
        /*juarezTotal: (data) => {
           // return total_pob_juarez;
           const features = Array.isArray(data) ? data : data?.features;
            if (!features) return 0;
            return features.reduce((sum: number, feature: any) => sum + (feature.properties.total_poblacion || 0), 0);
        },*/
        tematica: "poblacion",
        type: "Categorica",
        enabled: true,
        colonias: true,
        labels : {
            1: "Muy Bajo",
            2: "Bajo",
            3: "Medio",
            4: "Alto",
            5: "Muy Alto"
        },
        categoricalLegend: [
            { value: 1, label: "Muy Bajo", color: "#a5b6ce" },
            { value: 2, label: "Bajo", color: "#7e95b5" },
            { value: 3, label: "Medio", color: "#57749c" },
            { value: 4, label: "Alto", color: "#2f5284" },
            { value: 5, label: "Muy Alto", color: "#08316b" }
        ],
        dataProcesssing: (data: any) => {
            const marginacionMap: any = {
                "muy bajo": 1,
                "bajo": 2,
                "medio": 3,
                "alto": 4,
                "muy alto": 5
            }
            data.features = data.features.filter((feature: any) => feature.properties.indice_bienestar !== null);
            data.features.forEach((feature: any) => {
                feature.properties.indice_bienestar = marginacionMap[feature.properties.indice_bienestar.toLowerCase()];
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 2)
        },
        colors: ["#cdd8e6", "#08316b"],
        juarezCard: (data) =>
            <span>En Ciudad Juárez, <strong>{data.num}</strong> personas tienen un nivel de bienestar <strong>{data.category}</strong>, lo que representa el <strong>{data.avg}</strong> de la población.</span>,
        selectionCard: (data) => {
            return (
            <>
                <span>En {data.introText} hay <strong>{data.num}</strong> personas tienen un nivel de bienestar <strong>{data.category}</strong>.</span>
                <br/>
                <span>Este nivel está por <strong>{data.comparedToAvg}</strong> del nivel de Ciudad Juarez (medio).</span>
            </>
            );
        },
        getAvgThreshold: (avg: number) => {
            const categories ={
                1: "muy bajo",
                2: "bajo",
                3: "medio",
                4: "alto",
                5: "muy alto"
            }
            return categories[Math.trunc(avg)] || "N/A";
        }
    },
    indice_marginacion: {
        title: "Indice de Marginación Urbana",
        description: "Da cuenta de las carencias de la población asociadas a la escolaridad, la vivienda, los ingresos y otros aspectos sociodemográficos.",
        source: "Consejo Nacional de Población (CONAPO), 2020.",
        property: "indice_marginacion",
        tematica: "poblacion",
        type: "Categorica",
        enabled: true,
        colonias: false,
        labels : {
            1: "Muy bajo",
            2: "Bajo",
            3: "Medio",
            4: "Alto",
            5: "Muy alto"
        },
        categoricalLegend: [
            { value: 1, label: "Muy Bajo", color: "#a5b6ce" },
            { value: 2, label: "Bajo", color: "#7e95b5" },
            { value: 3, label: "Medio", color: "#57749c" },
            { value: 4, label: "Alto", color: "#2f5284" },
            { value: 5, label: "Muy Alto", color: "#08316b" }
        ],
        dataProcesssing: (data: any) => {
            const marginacionMap: any = {
                "muy bajo": 1,
                "bajo": 2,
                "medio": 3,
                "alto": 4,
                "muy alto": 5
            }
            data.features = data.features.filter((feature: any) => feature.properties.indice_marginacion !== null);
            data.features.forEach((feature: any) => {
                feature.properties.indice_marginacion = marginacionMap[feature.properties.indice_marginacion.toLowerCase()];
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 2)
        },
        colors: ["#cdd8e6", "#08316b"],
        juarezCard: (data) =>
            <span>En Ciudad Juárez, <strong>{data.num}</strong> personas tienen un índice de marginación urbana de <strong>{data.category}</strong>, lo que representa el <strong>{data.avg}</strong> de la población.</span>,
        selectionCard: (data) => {
            return (
            <>
                <span>{capitalize(data.introText)} tiene un índice de marginación urbana de <strong>{data.category}</strong>.</span>
                <br/>
                <span>Este nivel está por <strong>{data.comparedToAvg}</strong> del índice de marginación urbana promedio de Ciudad Juarez.</span>
            </>
            );
        },
        getAvgThreshold: (avg: number) => {
            const categories ={
                1: "muy bajo",
                2: "bajo",
                3: "medio",
                4: "alto",
                5: "muy alto"
            }
            return categories[Math.trunc(avg)] || "N/A";
        }
    },
}

//segun canva
export type ComplementaryKey = keyof typeof COMPLEMENTARY_LAYERS;
export const COMPLEMENTARY_LAYERS = {
    hidrografia: {
        title: "hidrografía",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/parques_industriales.geojson",
        enabled: false,
        parent: null,
    },
    equipamientos: {
        title: "equipamientos",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/parques_industriales.geojson",
        enabled: false,
        parent: null,
    },
    salud: {
        title: "salud",
        url: "...",
        enabled: false,
        parent: "equipamientos",
    },
    educacion:{
        title: "educación",
        url: "...",
        enabled: false,
        parent: "equipamientos"
    },
    recreacion: {
        title: "recreación",
        url: "...",
        enabled: false,
        parent: "equipamientos"
    },
    industrias: {
        title: "industrias",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/parques_industriales.geojson",
        enabled: false,
        parent: null,
    },
    parques_industriales: {
        title: "parques industriales",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/parques_industriales.geojson",
        enabled: true,
        parent: "industrias"
    },
    maquilas: {
        title: "maquilas",
        url: "...",
        enabled: false,
        parent: "industrias"
    },
    fabricas: {
        title: "fábricas",
        url: "...",
        enabled: false,
        parent: "industrias"
    },
    vialidades: {
        title: "vialidades",
        url: "...",
        enabled: false,
        parent: null,
    },
}

//segun codebook
export const CAPAS_BASE_CODEBOOK = {
    hidrografia: {
        title: "hidrografía",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/parques_industriales.geojson",
        enabled: false,
        parent: null,
        isPointLayer: false,
        field: null,
        colors: [],
        hoverInfo: false,
    },
    /*industrias: {
        title: "industrias contaminantes",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/industries.geojson",
        enabled: true,
        parent: null,
        isPointLayer: true,
        field:"release",
        colors: ["#7e0000ff", "#ff0000ff"],
        //colors: ["#927e5eff", "#d88a25ff", "#e76e36ff", "#d42e14ff", "#ff0000ff"],
        hoverInfo: true,
    },*/
    parques_industriales: {
        title: "parques industriales",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/parques_industriales.geojson",
        enabled: true,
        parent: null,
        isPointLayer: false,
        //field: "ID_COLO",
        field: "",
        colors: [],
        hoverInfo: false,
    },
    limite_urbano: {
        title: "límite urbano",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/parques_industriales.geojson",
        enabled: false,
        parent: null,
        isPointLayer: false,
        field: null,
        colors: [],
        hoverInfo: false,
    },
    vias_principales: {
        title: "vias principales",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/parques_industriales.geojson",
        enabled: false,
        parent: null,
        isPointLayer: false,
        field: null,
        colors: [],
        hoverInfo: false,
    },
    equipamientos: {
        title: "equipamientos",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/parques_industriales.geojson",
        enabled: false,
        parent: null,
        isPointLayer: false,
        field: null,
        colors: [],
        hoverInfo: false,
    },
    educacion:{
        title: "educación",
        url: "...",
        enabled: false,
        parent: "equipamientos",
        isPointLayer: false,
        field: null,
        colors: [],
        hoverInfo: false,
    },
    salud: {
        title: "salud",
        url: "...",
        enabled: false,
        parent: "equipamientos",
        isPointLayer: false,
        field: null,
        colors: [],
        hoverInfo: false,
    },
    recreacion: {
        title: "recreación",
        url: "...",
        enabled: false,
        parent: "equipamientos",
        isPointLayer: false,
        field: null,
        colors: [],
        hoverInfo: false,
    },
    parques: {
        title: "parques",
        url: "...",
        enabled: false,
        parent: "equipamientos",
        isPointLayer: false,
        field: null,
        colors: [],
        hoverInfo: false,
    },
    vias_ferreas: {
        title: "vías férreas",
        url: "...",
        enabled: false,
        parent: null,
        isPointLayer: false,
        field: null,
        colors: [],
        hoverInfo: false,
    },
    islas_calor: {
        title: "islas de calor",
        url: "...",
        enabled: false,
        parent: null,
        isPointLayer: false,
        field: null,
        colors: [],
        hoverInfo: false,
    },
    calidad_aire: {
        title: "calidad del aire",
        url: "...",
        enabled: false,
        parent: null,
        isPointLayer: false,
        field: null,
        colors: [],
        hoverInfo: false,
    },
}

