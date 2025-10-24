import { line } from "d3";
import { formatNumber, capitalize } from "./utils";
const REACT_APP_SAS_TOKEN = import.meta.env.VITE_AZURE_SAS_TOKEN;

export const total_pob_juarez = 1503616.0;
export const codebook_url= " https://tecmx.sharepoint.com/:x:/r/sites/JusticiaAmbiental/_layouts/15/Doc2.aspx?action=edit&sourcedoc=%7B427c6ade-f673-4dc2-a13e-980acd3f4a3f%7D&wdOrigin=TEAMS-MAGLEV.teamsSdk_ns.rwc&wdExp=TEAMS-TREATMENT&wdhostclicktime=1760901839077&web=1";
export const webpage_url="https://salmon-field-079add61e.1.azurestaticapps.net/";
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
        label: "ambiental",
        layers: [
            "vulnerabilidad_calor",
            "pob_afectada_inundaciones",
            "superficie_inundada",
            "riesgo_trafico_vehicular",
            "islas_de_calor",
        ] as LayerKey[],
    },
    industria: {
        label: "industria",
        layers: [
            "hogares_vulnerables_industria",
            "infantes_vulnerables_industria",
            "adultos_vulnerables_industria",
            "industrias",
            "industrias_contaminantes",
        ] as LayerKey[],
    },
    equipamiento: {
        label: "equipamientos",
        layers: [
            "indice_accesibilidad",
            "acceso_recreativos",
            "acceso_hospitales",
            "acceso_preparatorias",
            "tiempo_recreativos",
            "tiempo_hospitales",
            "tiempo_preparatorias",
            "equipamientos",
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
        scaleType: "linear",
        colors: ["#ffed85ff", "#910000ff"],
        capa: true,
        pickable: false,
        url: `https://justiciaambientalstore.blob.core.windows.net/data/Islas_de_calor_Juarez.geojson?${REACT_APP_SAS_TOKEN}`,
        jsonurl: `https://justiciaambientalstore.blob.core.windows.net/data/heat_island_graph.json?${REACT_APP_SAS_TOKEN}`,
        title: "Islas de calor",
        legendTitle: "Temperatura",
        description: "Las islas de calor describen áreas urbanas de muchas construcciones que son más calientes que las áreas rurales cercanas. Las islas de calor aumentan el calor y la contaminación, lo que provoca riesgos para la salud y afecta la calidad de vida.",
        source: "Elaboración Propia con datos de Earth Resources Observation and Science (EROS) Center; European Space Agency, Center for International Earth Science Information Network, Demuzere et al., 2022; Schiavina et al., 2023; Tatem, 2017 (CIESIN) Columbia University (ver: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5251739)",
        property: "lst",
        tematica: "industria",
        type: "Continua",
        is_lineLayer: false,
        is_PointLayer: false,
        enabled: true,
        colonias: false,
        dataProcessing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.ID !== null);
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "°C"
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
    vulnerabilidad_calor: { //categorica
        title: "Índice de vulnerabilidad al calor",
        description: "Índice que evalúa la exposición al calor, la sensibilidad al calor y la capacidad de adaptación para evaluar de manera integral la vulnerabilidad al calor.",
        source: "Elaboración Propia con datos de Earth Resources Observation and Science (EROS) Center; European Space Agency, Center for International Earth Science Information Network, Demuzere et al., 2022; Schiavina et al., 2023; Tatem, 2017 (CIESIN) Columbia University (ver: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5251739)",
        property: "vulnerabilidad_calor",
        tematica: "ambiental",
        type: "Categorica",
        is_lineLayer: false,
        dataProcessing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.vulnerabilidad_calor !== null );
            return data;
        },
        categoricalLegend: [
            { value: 1, label: "1 - Baja", color: "#ffed85ff" },
            { value: 2, label: "2 - Ligera", color: "#fbaf52ff" },
            { value: 3, label: "3 - Media", color: "#f6711fff" },
            { value: 4, label: "4 - Alta", color: "#c33910ff" },
            { value: 5, label: "5 - Extrema", color: "#910000ff" },
        ],
        enabled: true,
        colonias: true,
        formatValue: (x: number) => {
            return formatNumber(x, 0)
        },
        amountOfColors: 5,
        colors: ["#ffed85ff", "#fbaf52ff", "#f6711fff", "#c33910ff", "#910000ff"],
        juarezCard: (data) => {
            return (
                <span>En Ciudad Juárez, el Índice promedio de Vulnerabilidad al Calor, es de <strong>{data.avg}</strong> lo que representa una vulnerabilidad <strong>{data.category}.</strong></span>
            );
        },
        selectionCard: (data) => {
            return (
            <>
                <span>En {data.introText}, el Índice de Vulnerabilidad al Calor es de <strong>{data.avg}</strong>, lo que representa una vulnerabilidad <strong>{data.category}.</strong></span>
                <br/>
                <span>Este índice está por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juárez.</span>
            </>
            );
        },
        getAvgThreshold: (avg: number) => {
            const categories ={
                1: "baja",
                2: "ligera",
                3: "media",
                4: "alta",
                5: "extrema"
            }
            return categories[Math.trunc(avg)] || "N/A";
        }
    },
    pob_afectada_inundaciones: { //quintil con puntos corte (revisar cortes)
        scaleType: "quantile",
        thresholds: [10, 25, 50, 75],
        colors: ["#f2f2f2","#ebe6dfff", "#d9c2b1ff", "#7d9ab3ff", "#436480ff"],
        title: "Población afectada por inundaciones",
        description: "Porcentaje de la población que durante una lluvia de 60 minutos se ve afectada por un nivel de agua superior a 25 centímetros.",
        source: "Elaboración propia con datos  del Instituto Nacional de Estadística y Geografía (INEGI), Censo de Población y Vivienda 2020 y del  Modelos Digitales de Elevación (MDE) LiDAR de alta resolución (5 m) y cartas H13A15, H13A25 y H13A26, procesados en ArcGIS Pro (Mosaic to New Raster, ArcHydro). Intensidades de lluvia del Estudio Hidrológico e Hidráulico de la zona sur de la cuenca El Barreal, UACJ. (ver: https://www.inegi.org.mx/app/mapas/?tg=1015)",
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
        //colors: ["#f4f9ff", "#08316b"],
        dataProcessing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.porcentaje_poblacion_inundada !== null );
            data.features.forEach((feature: any) => {
                feature.properties.porcentaje_poblacion_inundada = Math.round(feature.properties.porcentaje_poblacion_inundada * 100);
                feature.properties.total_poblacion_inundada = feature.properties.total_poblacion_inundada === null ? 0 : feature.properties.total_poblacion_inundada;
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
            {data.avg == "0%" || data.num == 0 ?
                <span>En {data.introText}, no hay población afectada por las inundaciones </span>
                :
                <>
                <span> En {data.introText}, <strong>{data.num}</strong> personas se ven afectadas por las inundaciones lo que representa el <strong>{data.avg}</strong> de la población dentro de esta área.</span>
                <br />
                <span>Este porcentaje está por <strong>{data.comparedToAvg}</strong> del porcentaje promedio de Ciudad Juárez.</span>
                </>
            }
            </>
            );
        },
    },
    superficie_inundada: {  //quintil con puntos corte (revisar cortes)
        scaleType: "quantile",
        thresholds: [5, 10, 15, 20],
        colors: ["#f2f2f2","#ebe6dfff", "#d9c2b1ff", "#7d9ab3ff", "#436480ff"],
        title: "Porcentaje de superficie inundada",
        description: "Porcentaje de la superficie del AGEB/colonia que se ve afectada por un nivel de agua superior a 25 centímetros durante una lluvia de 60 minutos.",
        source: "Elaboración propia con datos de INEGI – Modelos Digitales de Elevación (MDE) LiDAR de alta resolución (5 m) y cartas H13A15, H13A25 y H13A26, procesados en ArcGIS Pro (Mosaic to New Raster, ArcHydro). Intensidades de lluvia del Estudio Hidrológico e Hidráulico de la zona sur de la cuenca El Barreal, UACJ (https://www.inegi.org.mx/app/mapas/?tg=1015)",
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
        trimOutliers: true,
        dataProcessing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.porcentaje_area_inundada !== null );
            data.features.forEach((feature: any) => {
                feature.properties.porcentaje_area_inundada = Math.round(feature.properties.porcentaje_area_inundada * 100);
                feature.properties.area_inundada_m2 = feature.properties.area_inundada_m2 === null ? 0 : feature.properties.area_inundada_m2;
            })
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
        juarezCard: (data) =>
            <span>En Ciudad Juárez, hay <strong>{data.num} m<sup>2</sup></strong> afectados por las inundaciones, lo que representa el <strong>{data.avg}</strong> de su superficie.</span>,
        selectionCard: (data) => {
            return (
            <>
            {data.avg == "0%" || data.num == 0 ?
                <span>En {data.introText}, <strong>menos del 1%</strong> de la superficie se ve afectada por las inundaciones </span>
                :
                <>
                    <span>En {data.introText}, <strong>{data.num} m<sup>2</sup></strong> se ven afectados por las inundaciones, lo que representa el <strong>{data.avg}</strong> de su superficie.</span>
                    <br />
                    <span>Este porcentaje está por <strong>{data.comparedToAvg}</strong> del porcentaje promedio de Ciudad Juárez.</span>
                </>
            }
            </>
            );
        },
    },
    riesgo_trafico_vehicular: { 
        scaleType: "linear",
        colors: ["#dfe1e6ff", "#8c4a23ff",],
        title: "Proximidad a alto tráfico vehicular",
        description: "La proximidad al alto tráfico vehicular representa el total de vehículos que circulan diariamente en las vialidades principales ubicadas a menos de 500 metros de cada AGEB o colonia.",
        source: "Elaboración propia con datos del Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez",
        property: "tdpa_density",
        legendTitle: "Vehículos",
        tematica: "ambiental",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Semaforo",
        geographic_unit: "Líneas de vialidades principales",
        threshold: "",
        year: null,
        enabled: true,
        colonias: true,
        dataProcessing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.tdpa_density !== null );
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) 
        },
        juarezCard: (data) =>
            <span>En Ciudad Juárez, los hogares están expuestos en promedio a <strong>{data.avg} vehículos</strong> diarios que circulan por las vialidades principales cercanas.</span>,
       selectionCard: (data) => {
        return (
            <>
                {data.avg == 0 || data.num == 0 ?
                <span>En {data.introText}, no hay exposición al tráfico vehicular </span>
                :
                <>
               <span>En {data.introText}, los hogares están expuestos en promedio a <strong>{data.avg} vehículos</strong> diarios que circulan por las vialidades principales cercanas.</span>
               <br />
               <span>Este flujo vehicular está por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juárez.</span>
               </>
            }
           </>
        )}
    },
    indice_marginacion: { //categorica
        title: "Indice de Marginación Urbana",
        description: "Da cuenta de las carencias de la población asociadas a la escolaridad, la vivienda, los ingresos y otros aspectos sociodemográficos.",
        source: "Consejo Nacional de Población (CONAPO), 2020.",
        property: "indice_marginacion", //para el mapa
        tematica: "poblacion",
        type: "Categorica",
        enabled: true,
        colonias: false,
        categoricalLegend: [
            { value: 1, label: "1 - Muy Bajo", color: "#dae6c8" },
            { value: 2, label: "2 - Bajo", color: "#c2d182" },
            { value: 3, label: "3 - Medio", color: "#97ba66" },
            { value: 4, label: "4 - Alto", color: "#5c997c" },
            { value: 5, label: "5 - Muy Alto", color: "#2c8499" }
        ],
        dataProcessing: (data: any) => {
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
            return formatNumber(x, 0)
        },
        colors: ["#cdd8e6", "#08316b"],
        juarezCard: (data) =>
            <span>En Ciudad Juárez, <strong>555,863</strong> personas tienen un índice de marginación urbana <strong>{data.category}</strong>, lo que representa el <strong>37%</strong> de la población.</span>,
        selectionCard: (data) => {
            return (
            <>
                <span>{capitalize(data.introText)} tiene un índice de marginación urbana <strong>{data.category}</strong>.</span>
                <br/>
                <span>Este nivel está por <strong>{data.comparedToAvg}</strong> del índice de marginación urbana promedio de Ciudad Juarez.</span>
            </>
            );
        },
        getAvgThreshold: (avg: number) => {
            console.log("entro con avg", avg);
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
    //RIESGOS RELACIONADOS A LA INDUSTRIA
    industrias: {   //FALTA COLORES CATEGORICA
        capa: true,
        pickable: false,
        url: `https://justiciaambientalstore.blob.core.windows.net/data/industrias_denue.geojson?${REACT_APP_SAS_TOKEN}`,
        title: "Industrias",
        description: "Industrias ubicadas en el perímetro urbano de Ciudad Juárez, con su respectiva clasificación: \n– Energía electrica, agua y gas \n– Industrias manufactureras de alimentos textiles y tabaco \n– Manufactureras de madera, papel, quimicos y plástico \n– Electronicos maquinaria y equipo",
        source: "Directorio Estadístico Nacional de Unidades Económicas (DENUE), por parte del Instituto Nacional de Estadística y Geografía (INEGI).",
        property: "sector",
        tematica: "industria",
        type: "Categorica",
        is_PointLayer: true,
        enabled: true,
        colonias: false,
        categoricalLegend: [
            { value: "Energía electrica, agua y gas", label: "Energía electrica, agua y gas", color: "#85c1c8" },
            { value: "Manufactureras de alimentos textiles y tabaco", label: "Manufactureras de alimentos textiles y tabaco", color: "#90a1be" },
            { value: "Transporte", label: "Transporte", color: "#e99900" },
            { value: "Manufactureras de madera, papel, químicos y plástico", label: "Manufactureras de madera, papel, químicos y plástico", color: "#ccbe6a" },
            { value: "Manufactureras de metálicos, maquinaria y electrónicos", label: "Manufactureras de metálicos, maquinaria y electrónicos", color: "#9b87b6" },
            { value: "Manejo de residuos", label: "Manejo de residuos", color: "#2e6953" },

        ],
        dataProcessing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.industria !== null);
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + " kg m2"
        },
        colors: [ "#e85e00", "#f4a829", "#db9217", "#a44809"],
        trimOutliers: false,
        juarezCard: (data) =>
            <span>En Ciudad Juárez, las industrias están clasificadas de la siguiente forma:</span>,
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
            //title: "Sectores industriales",
            source: "Fuente de ejemplo",
            legend: {
                "Manejo de residuos": "#2e6953",
                "Manufactureras de metálicos, maquinaria y electrónicos": "#9b87b6",
                "Manufactureras de madera, papel, químicos y plástico": "#ccbe6a",
                "Transporte": "#e99900",
                "Manufactureras de alimentos textiles y tabaco": "#90a1be",
                "Energía electrica, agua y gas": "#85c1c8",
            },
            option: (data: any) => {
                const industrias: any = {};
                const colorMap = {
                    "Manufactureras de alimentos textiles y tabaco": "#90a1be",
                    "Manufactureras de madera, papel, químicos y plástico": "#ccbe6a",
                    "Manufactureras de metálicos, maquinaria y electrónicos": "#9b87b6",
                    "Energía electrica, agua y gas": "#85c1c8",
                    "Transporte": "#e99900",
                    "Manejo de residuos": "#2e6953",
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

                return {
                    tooltip: {
                        show: true,
                        formatter: function (info) {
                        return `<b>${info.name}</b><br/>${(info.value).toLocaleString()}`;
                        },
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
                            width: 8,
                            maxWidth: 8,
                            overflow: 'break',
                        },
                        appendToBody: true,
                        width: 8,
                        overflow: 'break',
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
                        label: {
                            show: false,
                            formatter: '{b}',
                            overflow: 'breakAll'
                        },
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
    industrias_contaminantes: { //FALTA COLORES Y DEFINIR GRUPOS CATEGORICA
        capa: true,
        pickable: true,
        url: `https://justiciaambientalstore.blob.core.windows.net/data/industry_points.geojson?${REACT_APP_SAS_TOKEN}`,
        extraLayerUrl: `https://justiciaambientalstore.blob.core.windows.net/data/industry_circles.geojson?${REACT_APP_SAS_TOKEN}`,
        jsonurl: `https://justiciaambientalstore.blob.core.windows.net/data/releases.json?${REACT_APP_SAS_TOKEN}`,
        title: "Industrias contaminantes",
        description: "Industrias ubicadas en el perímetro urbano de Ciudad Juárez que reportan su producción de sustancias contaminantes.",
        source: "Elaboración propia con datos de la Comisión para la Cooperación Ambiental (CEC). (2025). Taking Stock: North American PRTR Database — Mapa interactivo de emisiones y transferencias [Plataforma en línea]. Recuperado de https://takingstock.cec.org/Map?Culture=en-US&IndustryLevel=4&Measure=3&MediaTypes=29&ReportType=1&ResultType=1&Years=2023",
        property: "sector",
        tematica: "industria",
        type: "Categorica",
        categoricalLegend: [
            { value: "Manufactureras de metálicos, maquinaria y electrónicos+Manufactureras de madera, papel, químicos y plástico", label: "Manufactureras de ambos", color: "#224ba5ff" },
            { value: "Transporte", label: "Transporte", color: "#e99900" },
            { value: "Manufactureras de madera, papel, químicos y plástico", label: "Manufactureras de madera, papel, químicos y plástico", color: "#ccbe6a" },
            { value: "Manufactureras de metálicos, maquinaria y electrónicos", label: "Manufactureras de metálicos, maquinaria y electrónicos", color: "#9b87b6" },
            { value: "Manejo de residuos", label: "Manejo de residuos", color: "#2e6953" },

        ],
        is_PointLayer: true,
        enabled: true,
        colonias: false,
        dataProcessing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.ID !== null);
            //split industries by +
            data.features.forEach((feature: any) => {
                const industries = feature.properties.industries ? feature.properties.industries.split("+") : [];
                feature.properties.industries = industries;
            });
            return data;
        },
        jsonDataProcessing: (data: any) => {
            const riesgos: any = {
                "Metals": "Metales",
                "Persistent, Bioaccumulative and Toxic": "Persistentes, Bioacumulativos y Tóxicos",
                "Known or Suspected Carcinogens": "Carcinógenos Conocidos o Sospechosos",
                "Developmental/Reproductive Toxins": "Tóxicos para el Desarrollo/Reproductivos",
            }
            Object.values(data).forEach((industry: any) => {
                const risks = industry.risks;
                if (risks) {
                    Object.values(risks).forEach((site: any) => {
                        Object.keys(site).forEach((riskKey) => {
                            if (riesgos[riskKey]) {
                                site[riesgos[riskKey]] = site[riskKey];
                                delete site[riskKey];
                            }
                        });
                    });
                }
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + " kg m2"
        },
        colors:["#a03a2dff", "#a72e19ff"],
        trimOutliers: false,
        juarezCard: (data) =>
            <span>
                En Ciudad Juárez, las industrias que reportan sustancias contaminantes están clasificadas según el tipo de contaminante y la cantidad emitida, expresada en kilogramos.
                <br/>
                Además, se distingue el tipo de manejo de los desechos, ya que cada uno representa un impacto distinto:
            </span>,
        selectionCard: (data) => {
            return (
            <>
                <span>En {data.introText} la exposición a contaminantes industriales es de <strong>{data.avg}/km² </strong>.</span>
                <br/>
                <span>Este porcentaje esta por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juarez.</span>
            </>
            );
        },
        featureInfo: true,
        graphs: [
        {
            title: "En sitio:",
            description: "cuando los contaminantes se liberan o tratan en el mismo lugar donde se lleva a cabo la actividad industrial.",
            source: "Fuente de ejemplo",
            legend: {
                "Plomo": "#8C4242",
                "Mercurio": "#592115",
                "Níquel": "#BF964B",
                "Arsenico": "#444b6e",
                "Cromo": "#7c7b7f",
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
                    "Lead (and its compounds)": "Plomo",
                    "Mercury (and its compounds)": "Mercurio",
                    "Nickel (and its compounds)": "Níquel",
                    "Arsenic (and its compounds)": "Arsenico",
                    "Chromium (and its compounds)": "Cromo",
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
                    tooltip: {
                        show: true,
                        formatter: function (info) {
                        return `<b>${info.name}</b><br/>${Number((info.value).toFixed(2)).toLocaleString()} kg`;
                        },
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
                        },
                        width: 20,
                        overflow: 'breakAll',
                        appendToBody: true,
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
                        label: {
                            show: false,
                            formatter: '{b}',
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
        },
        {
            title: "Fuera del sitio:",
            description: "cuando los desechos se trasladan a otro sitio para ser liberados o tratados fuera de las instalaciones de la industria.",
            source: "Fuente de ejemplo",
            legend: {
                "Plomo": "#8C4242",
                "Mercurio": "#592115",
                "Níquel": "#BF964B",
                "Arsenico": "#444b6e",
                "Cromo": "#7c7b7f",
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
                    "Lead (and its compounds)": "Plomo",
                    "Mercury (and its compounds)": "Mercurio",
                    "Nickel (and its compounds)": "Níquel",
                    "Arsenic (and its compounds)": "Arsenico",
                    "Chromium (and its compounds)": "Cromo",
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
                    tooltip: {
                        show: true,
                        formatter: function (info) {
                            return `<b>${info.name}</b><br/>${Number((info.value).toFixed(2)).toLocaleString()} kg`;
                        },
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
                        },
                        width: 20,
                        overflow: 'breakAll',
                        appendToBody: true,
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
                        show: false,
                        formatter: '{b}',
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
    hogares_vulnerables_industria: { //quintil con puntos corte
        scaleType: "quantile",
        thresholds: [10, 25, 50, 75],
        colors: ["#ffefdcff","#d99f88ff", "#b34e34ff", "#7d271aff", "#470000ff"],
        title: "Hogares expuestos a industrias contaminantes",
        description: "Porcentaje de hogares cercanos a una industria que emite contaminantes en el sitio de la actividad industrial.",
        source: "Elaboración propia con datos del Instituto Nacional de Estadística y Geografía (INEGI), Censo de Población y Vivienda 2020 y la Comisión para la Cooperación Ambiental (CEC). (2025). Taking Stock: North American PRTR Database — Mapa interactivo de emisiones y transferencias [Plataforma en línea]. Recuperado de https://takingstock.cec.org/Map?Culture=en-US&IndustryLevel=4&Measure=3&MediaTypes=29&ReportType=1&ResultType=1&Years=2023",
        property: "porcentaje_viviendas_vulnerables_industria",
        propertyAbsolute: "total_viviendas_vulnerables_industria",
        juarezTotal: (data: any) => {
            const features = Array.isArray(data) ? data : data?.features;
            if (!features) return 0;
            return features.reduce((sum: number, feature: any) => sum + (feature.properties.total_viviendas || 0), 0);
        },
        tematica: "industria",
        type: "Continua",
        enabled: true,
        colonias: true,
        dataProcessing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.porcentaje_viviendas_vulnerables_industria !== null );
            data.features.forEach((feature: any) => {
                feature.properties.porcentaje_viviendas_vulnerables_industria = Math.round(feature.properties.porcentaje_viviendas_vulnerables_industria * 100);
                feature.properties.total_viviendas_vulnerables_industria = feature.properties.total_viviendas_vulnerables_industria === null ? 0 : feature.properties.total_viviendas_vulnerables_industria;
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
        juarezCard: (data) =>
            <span>En Ciudad Juárez, hay <strong>{data.num}</strong> hogares expuestos a industrias contaminantes, lo que representa el <strong>{data.avg}</strong> de los hogares.</span>,
        selectionCard: (data) => {
            return (
            <>
            {data.num == 0 || data.avg == "0%" ?
                <span>En {data.introText}, no hay hogares expuestos a industrias contaminantes.</span>
            :
            <>
                <span>En {data.introText}, hay <strong>{data.num}</strong> hogares expuestos a industrias contaminantes, lo que representa el <strong>{data.avg}</strong> de los hogares dentro de esta área.</span>
                <br/>
                <span>Este porcentaje esta por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juarez.</span>
                </>
            }
            </>
            );
        },
    },
    infantes_vulnerables_industria: { //quintil con puntos corte
        scaleType: "quantile",
        colors: ["#ffefdcff","#d99f88ff", "#b34e34ff", "#7d271aff", "#470000ff"],
        thresholds: [10, 25, 50, 75],
        title: "Infancias expuestas a industrias contaminantes",
        description: "Porcentaje de niños menores a 5 años cercanos a una industria que emite contaminantes en el sitio de la actividad industrial.",
        source: "Elaboración propia con datos del Instituto Nacional de Estadística y Geografía (INEGI), Censo de Población y Vivienda 2020 y la Comisión para la Cooperación Ambiental (CEC). (2025). Taking Stock: North American PRTR Database — Mapa interactivo de emisiones y transferencias [Plataforma en línea]. Recuperado de https://takingstock.cec.org/Map?Culture=en-US&IndustryLevel=4&Measure=3&MediaTypes=29&ReportType=1&ResultType=1&Years=2023",
        property: "porcentaje_infantes_vulnerables_industria",
        propertyAbsolute: "total_infantes_vulnerables_industria",
        juarezTotal: (data) => {
            const features = Array.isArray(data) ? data : data?.features;
            if (!features) return 0;
            return features.reduce((sum: number, feature: any) => sum + (feature.properties.total_pob_0a5 || 0), 0);
        },
        tematica: "industria",
        type: "Continua",
        enabled: true,
        colonias: true,
        dataProcessing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.porcentaje_infantes_vulnerables_industria !== null);
            data.features.forEach((feature: any) => {
                feature.properties.porcentaje_infantes_vulnerables_industria = Math.round(feature.properties.porcentaje_infantes_vulnerables_industria * 100);
                feature.properties.total_infantes_vulnerables_industria = feature.properties.total_infantes_vulnerables_industria === null ? 0 : feature.properties.total_infantes_vulnerables_industria;
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
        juarezCard: (data) =>
            <span>En Ciudad Juárez, hay <strong>{data.num}</strong> infantes de 0 a 5 años expuestos a industrias contaminantes, lo que representa el <strong>{data.avg}</strong> de la población.</span>,
        selectionCard: (data) => {
            return (
            <>
            {data.num == 0 || data.avg == "0%" ?
                <span>En {data.introText}, no hay infantes de 0 a 5 años expuestos a industrias contaminantes.</span>
            :
            <>
                <span>En {data.introText}, hay <strong>{data.num}</strong> infantes de 0 a 5 años expuestos a industrias contaminantes, lo que representa el <strong>{data.avg}</strong> de la población dentro de esta área.</span>
                <br/>
                <span>Este porcentaje está por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juárez.</span>
            </>
        }
        </>
            );
        }
    },
    adultos_vulnerables_industria: { //quintil con puntos corte
        scaleType: "quantile",
        thresholds: [10, 25, 50, 75],
        colors: ["#ffefdcff","#d99f88ff", "#b34e34ff", "#7d271aff", "#470000ff"],
        title: "Adultos mayores expuestos a industrias contaminantes",
        description: "Porcentaje de adultos mayores a 60 años cercanos a una industria que emite contaminantes en el sitio de la actividad industrial.",
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
        enabled: true,
        colonias: true,
        dataProcessing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.porcentaje_adultos_mayores_vulnerables_industria !== null);
            data.features.forEach((feature: any) => {
                feature.properties.porcentaje_adultos_mayores_vulnerables_industria = Math.round(feature.properties.porcentaje_adultos_mayores_vulnerables_industria * 100);
                feature.properties.total_adultos_mayores_vulnerables_industria = feature.properties.total_adultos_mayores_vulnerables_industria === null ? 0 : feature.properties.total_adultos_mayores_vulnerables_industria;
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
        juarezCard: (data) =>
            <span>En Ciudad Juárez, hay <strong>{data.num}</strong> adultos de 60 años o más expuestos a industrias contaminantes, lo que representa el <strong>{data.avg}</strong> de la población.</span>,
        selectionCard: (data) => {
            return (
            <>
            {data.num == 0 || data.avg == "0%" ?
                <span>En {data.introText}, no hay adultos mayores de 60 años o más expuestos a industrias contaminantes.</span>
            :
            <>
                <span>En {data.introText}, hay <strong>{data.num}</strong> adultos mayores de 60 años o más expuestos a industrias contaminantes, lo que representa el <strong>{data.avg}</strong> de la población dentro de esta área.</span>
                <br/>
                <span>Este porcentaje está por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juárez.</span>
            </>
        }
        </>
            );
        }
    },
    //ACCESO A EQUIPAMIENTOS
    equipamientos: {
        capa: true,
        pickable: false,
        url: `https://justiciaambientalstore.blob.core.windows.net/data/equipamientos.geojson?${REACT_APP_SAS_TOKEN}`,
        title: "Equipamientos",
        description: "Numero de equipamientos por tipo: \n– Salud (hospitales y clínicas)\n– Educación y cuidados (guarderías, primarias, secundarias, preparatorias y universidades)\n– Espacios recreativos (bibliotecas, auditorios, cines, unidades deportivas)\n– Parques",
        source: "Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez.",
        property: "group",
        tematica: "equipamiento",
        type: "Categorica",
        is_PointLayer: true,
        enabled: true,
        colonias: false,
        categoricalLegend: [
            { value: "parque", label: "Parque", color: "#8ab17d" },
            { value: "salud", label: "Salud", color: "#4abfbd" },
            { value: "recreativo", label: "Recreativo", color: "#e76f51" },
            { value: "educacion", label: "Educación superior", color: "#e9c46a" },
        ],
        dataProcessing: (data: any) => {
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
            <span>En Ciudad Juárez los equipamientos se distribuyen de la siguiente forma:</span>,
        selectionCard: (data) => {
            return (
            <></>
            );
        },
        graphs: [
        {
            title: "Total de equipamientos por tipo",
            source: "Fuente de ejemplo",
            legend: {
                "Educación": "#e5c26aff",
                "Espacios recreativos": "#e76f51",
                "Salud": "#4abfbd",
                "Parques": "#8ab17d",
            },
            option: (data: any) => {
                console.log('equipamientos data', data);
                const equipamientos: any = {};
                //agrupar por categoria
                const equip_byCategory = Object.groupBy(data, (item: any) => item.properties.group);
                const colorMap= {
                    "educacion": "#e9c46a",
                    "salud": "#4abfbd",
                    "recreativo": "#e76f51",
                    "parque": "#8ab17d",
                };
                //recorrer categorias y contar por
                const treeData = Object.entries(equip_byCategory).map(([category, items]) => {
                    const counts: any = {};
                    items.forEach((item: any) => {
                        const tipo = item.properties.equipamiento;
                        if (!tipo) return;
                        const group = category; // usa subgroup si existe
                        if (!counts[tipo]) counts[tipo] = { value: 0, group };
                        counts[tipo].value += 1;
                    });
                    return {
                        name: category,
                        children: Object.entries(counts).map(([tipo, info]: any) => ({
                            name: tipo,
                            value: info.value,
                            itemStyle: { color: colorMap[category] || '#000' }
                        }))
                    };
                });

                return {
                    tooltip: {
                        show: true,
                        formatter: function (info) {
                        return `<b>${info.name}</b><br/>${info.value.toLocaleString()}`;
                        },
                        position: function (point, params, dom, rect, size) {
                            const tooltipWidth = size.contentSize[0];
                            const x = point[0] - tooltipWidth / 2;
                            const y = point[1] - 50; // 50px arriba del mouse, ajusta si quieres más cerca/lejos
                            return [x, y];
                        },
                        padding: [5, 10],
                        backgroundColor: 'rgba(50, 50, 50, 0.7)',
                        textStyle: {
                            color: '#fff',
                            fontSize: 10,
                            fontFamily: 'Roboto, sans-serif',
                        },
                        appendToBody: true,
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
                        label: {
                            show: false,
                            formatter: '{b}',
                            overflow: 'breakAll'
                        },
                        itemStyle: {
                            borderColor: '#fff',
                        },
                        data: treeData,
                    }, 

                ],
            }
        }
        },
    ]
    },
    indice_accesibilidad: { //cuartil con puntos corte
        scaleType: "quantile",
        colors: ["#d5d9c3", "#b1bb82", "#8e9e41", "#6a8000"],
        thresholds: [25, 50, 75],
        title: "Índice de Accesibilidad a Equipamientos",
        description: "Métrica combinada que toma en cuenta el tiempo de viaje caminando a equipamientos educativos y de cuidados, de salud, recreativos y parques. Entre más alta, más facil es acceder a ellos.",
        source: "Elaboración propia con base en datos del Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez y OpenStreetMap (OSM).",
        property: "indice_accesibilidad",
        tematica: "equipamiento",
        type: "Continua",
        enabled: true,
        colonias: true,
        dataProcessing: (data: any) => {
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
            <span>En Ciudad Juárez, el Índice promedio de Accesibilidad es de <strong>{data.avg}</strong> puntos sobre 100.</span>,
        selectionCard: (data) => {
            return (
                <>
                    <span>En {data.introText}, el Índice promedio de Accesibilidad es de <strong>{data.avg}</strong> puntos sobre 100.</span>
                    <br/>
                    <span>Este índice está por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juárez.</span>
                </>
            );
        }
    },
    tiempo_recreativos: {
        scaleType: "linear",
        title: "Tiempo promedio a parques",
        description: "Indica el tiempo promedio en minutos que tardarían los hogares en llegar caminando al parque más cercano.",
        source: "Elaboración propia con base en datos del Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez y OpenStreetMap (OSM).",
        property: "tiempo_parque",
        tematica: "equipamiento",
        type: "Continua",
        enabled: true,
        colonias: true,
        colors : ["#ebedfc", "#b29ab1", "#6d576c"],
        dataProcessing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.tiempo_parque !== null);
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + " min"
        },
        juarezCard: (data) =>
            <span>En Ciudad Juárez, el tiempo promedio de viaje a pie al parque más cercano es de <strong>{data.avg}</strong>. Este tiempo es considerado <strong>{data.category}</strong>.</span>,
        selectionCard: (data) => {
            return (
                <>
                    <span>En {data.introText}, el tiempo promedio de viaje a pie al parque más cercano es de <strong>{data.avg}</strong>.</span>
                    <br/>
                    <span>Este tiempo es considerado <strong>{data.category}.</strong></span>
                </>
            );
        },
        getAvgThreshold: (avg: number) => {
            if(avg < 5) return "muy accesible";
            if(avg >= 5 && avg <= 20) return "accesible";
            else return "poco accesible";
        },
       textRangesLegend: ["Poco accesible (> 20 min)", "Accesible (5 - 20 min)", "Muy accesible (< 5 min)"],
    },
    tiempo_hospitales: {
        scaleType: "linear",
        title: "Tiempo promedio a hospitales y clínicas",
        description: "Indica el tiempo promedio en minutos que tardarían los hogares en llegar caminando al hospital o clínica más cercano.",
        source: "Elaboración propia con base en datos del Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez y OpenStreetMap (OSM).",
        property: "tiempo_clinica_hospital",
        tematica: "equipamiento",
        type: "Continua",
        enabled: true,
        colonias: true,
        colors : ["#ebedfc", "#b29ab1", "#6d576c"],
        dataProcessing: (data: any) => {
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
                    <span>En {data.introText}, el tiempo promedio de viaje a pie al hospital o clinica más cercana es de <strong>{data.avg}</strong>.</span>
                    <br/>
                    <span>Este tiempo es considerado <strong>{data.category}</strong>.</span>
                </>
            );
        },
        getAvgThreshold: (avg: number) => {
            if(avg < 20) return "muy accesible";
            if(avg >= 20 && avg <= 60) return "accesible";
            else return "poco accesible";
        },
       textRangesLegend: ["Poco accesible (>60 min)", "Accesible (20 - 60 min)", "Muy accesible (<20 min)"],
    },
    tiempo_preparatorias: {
        scaleType: "linear",
        colors : ["#ebedfc", "#b29ab1", "#6d576c"],
        title: "Tiempo promedio a preparatorias",
        description: "Indica el tiempo promedio en minutos que tardarían los hogares en llegar caminando a la preparatoria más cercana.",
        source: "Elaboración propia con base en datos del Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez y OpenStreetMap (OSM).",
        property: "tiempo_preparatoria",
        tematica: "equipamiento",
        type: "Continua",
        enabled: true,
        colonias: true,
        dataProcessing: (data: any) => {
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
                <span>Este tiempo es considerado <strong>{data.category}</strong>.</span>
            </>
            );
        },
        getAvgThreshold: (avg: number) => {
            if(avg < 15) return "muy accesible";
            if(avg >= 15 && avg <= 45) return "accesible";
            else return "poco accesible";
        },
       textRangesLegend: ["Poco accesible (>45 min)", "Accesible (15 - 45 min)", "Muy accesible (<15 min)"],
    },
    acceso_recreativos: {
        scaleType: "quantile",
        colors: ["#d5d9c3", "#b1bb82", "#8e9e41", "#6a8000"],
        thresholds: [25, 50, 75],
        title: "Accesibilidad a parques",
        description: "Porcentaje de hogares con acceso a un parque a no más de 15 minutos caminando.",
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
        dataProcessing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.porcentaje_hogares_parque_15min !== null);
            data.features.forEach((feature: any) => {
                feature.properties.porcentaje_hogares_parque_15min = Math.round(feature.properties.porcentaje_hogares_parque_15min * 100);
                feature.properties.total_hogares_parque_15min = feature.properties.total_hogares_parque_15min === null ? 0 : feature.properties.total_hogares_parque_15min;
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
        juarezCard: (data) =>
            <span>En Ciudad Juárez, hay <strong>{data.num}</strong> hogares con al menos un parque a 15 minutos caminando, lo que representa el <strong>{data.avg}</strong> de los hogares.</span>,
        selectionCard: (data) => {
            return (
            <>
            {data.num == 0 || data.avg == "0%" ?
                <span>En {data.introText}, no hay hogares con al menos un parque a 15 minutos caminando.</span>
            :
            <>
                <span>En {data.introText}, hay <strong>{data.num}</strong> hogares con al menos un parque a 15 minutos caminando, lo que representa el <strong>{data.avg}</strong> de los hogares dentro de esta área.</span>
                <br/>
                <span>Este porcentaje esta por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juarez.</span>
            </>
        }
        </>
            );
        }
    },
    acceso_hospitales: {
        scaleType: "quantile",
        colors: ["#d5d9c3", "#b1bb82", "#8e9e41", "#6a8000"],
        thresholds: [25, 50, 75],
        title: "Accesibilidad a hospitales y clínicas",
        description: "Porcentaje de hogares con acceso a un hospital o clínica a no más de 30 minutos caminando.",
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
        dataProcessing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.porcentaje_hogares_clinica_hospital_30min !== null);
            data.features.forEach((feature: any) => {
                feature.properties.porcentaje_hogares_clinica_hospital_30min = Math.round(feature.properties.porcentaje_hogares_clinica_hospital_30min * 100);
                feature.properties.total_hogares_clinica_hospital_30min = feature.properties.total_hogares_clinica_hospital_30min === null ? 0 : feature.properties.total_hogares_clinica_hospital_30min;
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
            {data.num == 0 || data.avg == "0%" ?
                <span>En {data.introText}, no hay hogares con al menos un hospital o clínica a 30 minutos caminando.</span>
            :
            <>
                <span>En {data.introText}, hay <strong>{data.num}</strong> hogares con al menos un hospital o clínica a 30 minutos caminando, lo que representa el <strong>{data.avg}</strong> de los hogares dentro de esta área.</span>
                <br/>
                <span>Este porcentaje esta por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juarez.</span>
            </>
        }
        </>
            );
        }
    },
    acceso_preparatorias: {
        scaleType: "quantile",
        colors: ["#d5d9c3", "#b1bb82", "#8e9e41", "#6a8000"],
        thresholds: [25, 50, 75],
        title: "Accesibilidad a preparatorias",
        description: "Porcentaje de hogares con acceso a una preparatoria a no más de 30 minutos caminando.",
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
        dataProcessing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.porcentaje_hogares_preparatoria_30min !== null);
            data.features.forEach((feature: any) => {
                feature.properties.porcentaje_hogares_preparatoria_30min = Math.round(feature.properties.porcentaje_hogares_preparatoria_30min * 100);
                feature.properties.total_hogares_preparatoria_30min = feature.properties.total_hogares_preparatoria_30min === null ? 0 : feature.properties.total_hogares_preparatoria_30min;
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
        juarezCard: (data) =>
            <span>En Ciudad Juárez, hay <strong>{data.num}</strong> hogares con al menos una preparatoria a 30 minutos caminando, lo que representa el <strong>{data.avg}</strong> de los hogares.</span>,
        selectionCard: (data) => {
            return (
            <>
            {data.num == 0 || data.avg == "0%" ?
                <span>En {data.introText}, no hay hogares con al menos una preparatoria a 30 minutos caminando.</span>
            :
            <>
                <span>En {data.introText}, hay <strong>{data.num}</strong> hogares con al menos una preparatoria a 30 minutos caminando, lo que representa el <strong>{data.avg}</strong> de los hogares dentro de esta área.</span>
                <br/>
                <span>Este porcentaje está por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juárez.</span>
            </>
        }
        </>
            );
        }
    },
    //POBLACIÓN
    ingreso: {
        scaleType: "quantile",
        colors : ["#ebe6dfff", "#d9c2b1ff", "#afbac4ff", "#7d9ab3ff", "#436480ff"],
        title: "Ingreso promedio per cápita ",
        description: "Ingreso promedio per cápita mensual en pesos mexicanos de la población económicamente activa.",
        source: "Elaboración propia con base en datos del INEGI; Encuesta Nacional de Ingresos y Gastos de los Hogares (ENIGH), 2018; y Censo de Población y Vivienda, 2020.",
        property: "ingreso",
        tematica: "poblacion",
        type: "Continua",
        enabled: true,
        colonias: false,
        dataProcessing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.ingreso > 0);
            data.features.forEach((feature: any) => {
                feature.properties.ingreso = Math.round(feature.properties.ingreso * 19 * 1000 / 12);
            });
            return data;
        },
        formatValue: (x: number) => {
            return '$' + formatNumber(x, 0)
        },
        juarezCard: (data) =>
            <span>En Ciudad Juárez, el ingreso promedio per cápita es de <strong>{data.avg}</strong>.</span>,
        selectionCard: (data) => {
            return (
            <>
                <span>En {data.introText}, el ingreso promedio per cápita es de <strong>{data.avg}</strong>.</span>
                <br/>
                <span>Su ingreso promedio per cápita está por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juárez.</span>
            </>
            );
        }
    },
    porcentaje_pob_0a5: {
        scaleType: "quantile",
        title: "Porcentaje de infancias",
        description: "Porcentaje de población entre 0 a 5 años.",
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
        trimOutliers: true,
        dataProcessing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.porcentaje_pob_0a5 !== null);
            data.features.forEach((feature: any) => {
                feature.properties.porcentaje_pob_0a5 = Math.round(feature.properties.porcentaje_pob_0a5 * 100);
                feature.properties.total_pob_0a5 = feature.properties.total_pob_0a5 === null ? 0 : feature.properties.total_pob_0a5;
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
       colors : ["#e8e6f1ff", "#c9d5ebff", "#a9c4e5ff", "#87b3deff", "#60a3d8ff"],
        juarezCard: (data) =>
            <span>En Ciudad Juárez, hay <strong>{data.num}</strong> infantes de 0 a 5 años, lo que representa el <strong>{data.avg}</strong> de la población.</span>,
        selectionCard: (data) => {
            return (
            <>
            {data.num == 0 || data.avg == "0%" ?
                <span>En {data.introText}, no hay infantes de 0 a 5 años.</span>
            :
            <>
                <span>En {data.introText}, hay <strong>{data.num}</strong> infantes de 0 a 5 años, lo que representa el <strong>{data.avg}</strong> de la población dentro de esta área.</span>
                <br/>
                <span>Este porcentaje está por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juárez.</span>
            </>
        }
        </>
            );
        }
    },
    porcentaje_pob_60: {
        scaleType: "quantile",
        colors : ["#ebe6dfff", "#c3beb9ff", "#9cadb4ff", "#40a7b9ff", "#007f99ff"],
        title: "Porcentaje de adultos mayores",
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
        trimOutliers: true,
        dataProcessing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.porcentaje_pob_60 !== null);
            data.features.forEach((feature: any) => {
                feature.properties.porcentaje_pob_60 = Math.round(feature.properties.porcentaje_pob_60 * 100);
                feature.properties.total_pob_60 = feature.properties.total_pob_60 === null ? 0 : feature.properties.total_pob_60;
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
        juarezCard: (data) =>
            <span>En Ciudad Juárez, hay <strong>{data.num}</strong> adultos de 60 años o más, lo que representa el <strong>{data.avg}</strong> de la población.</span>,
        selectionCard: (data) => {
            return (
            <>
            {data.num == 0 || data.avg == "0%" ?
                <span>En {data.introText}, no hay adultos mayores de 60 años o más.</span>
            :
            <>
                <span>En {data.introText}, hay <strong>{data.num}</strong> adultos mayores de 60 años o más, lo que representa el <strong>{data.avg}</strong> de la población dentro de esta área.</span>
                <br/>
                <span>Este porcentaje está por <strong>{data.comparedToAvg}</strong> del promedio de Ciudad Juárez.</span>
            </>
        }
        </>
            );
        }
    },
    porcentaje_escolaridad: {
        scaleType: "quantile",
        colors : ["#d9c8c3ff", "#c0a69eff", "#a68479ff", "#8d6153ff", "#733f2eff"],
        thresholds: [10, 25, 50, 75],
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
        dataProcessing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.porcentaje_menos_prepa_terminada !== null);
            data.features.forEach((feature: any) => {
                feature.properties.porcentaje_menos_prepa_terminada = Math.round(feature.properties.porcentaje_menos_prepa_terminada * 100);
                feature.properties.total_menos_prepa_terminada = feature.properties.total_menos_prepa_terminada === null ? 0 : feature.properties.total_menos_prepa_terminada;
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
        juarezCard: (data) =>
            <span>En Ciudad Juárez, <strong>{data.num}</strong> personas no cuentan con la preparatoria terminada, lo que representa el <strong>{data.avg}</strong> de la población.</span>,
        selectionCard: (data) => {
            return (
            <>
                <span>En {data.introText}, <strong>{data.num}</strong> personas no cuentan con la preparatoria terminada, lo que representa el <strong>{data.avg}</strong> de la población dentro de esta área.</span>
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
        /*propertyAbsolute: "total_poblacion", //para el total de juarez
        filter: true,
        juarezTotal: (data, mapProperty_Avg) => {
           // return total_pob_juarez;
           const features = Array.isArray(data) ? data : data?.features;
            if (!features) return 0;
            return features.reduce((sum: number, feature: any) => sum + (feature.properties.total_poblacion || 0), 0);
        },*/
        tematica: "poblacion",
        type: "Categorica",
        enabled: true,
        colonias: true,
        categoricalLegend: [
            { value: 1, label: "1 - Muy Bajo", color: "#d9d8c3ff" },
            { value: 2, label: "2 - Bajo", color: "#ccc992ff" },
            { value: 3, label: "3 - Medio", color: "#c0bb62ff" },
            { value: 4, label: "4 - Alto", color: "#969131ff" },
            { value: 5, label: "5 - Muy Alto", color: "#807900ff" }
        ],
        dataProcessing: (data: any) => {
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
            return formatNumber(x, 0)
        },
        colors: ["#cdd8e6", "#08316b"],
        juarezCard: (data) =>
            <span>En Ciudad Juárez, <strong>576,032</strong> personas tienen un nivel de bienestar <strong>{data.category}</strong>, lo que representa el <strong>38.4%</strong> de la población.</span>,
        selectionCard: (data) => {
            return (
            <>
                <span>En {data.introText}, el Nivel de Bienestar es <strong>{data.category}</strong>.</span>
                <br/>
                <span>Este nivel está por <strong>{data.comparedToAvg}</strong> del nivel de bienestar predominante de Ciudad Juarez (Medio).</span>
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

//segun codebook
export const CAPAS_BASE_CODEBOOK = {
    limite_urbano: {
        title: "límite urbano",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/limite_urbano.geojson",
        enabled: true,
        parent: null,
        isPointLayer: false,
        field: "",
        colors: ["#0e0d0dff"],
        hoverInfo: false,
        dataFiltering: (data: any) => { return data},
        categoryColors: {},
        isLine: true,
        lineWidth: 3,
        //opacity: 0.5,
    },
    vias_principales: {
        title: "vias principales",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/vialidades.geojson",
        enabled: true,
        parent: null,
        isPointLayer: false,
        field: "ANCHO_DE_C",
        colors: ["#272a28"],
        hoverInfo: false,
        dataFiltering: (data: any) => { return  data},
        categoryColors: {},
        isLine: true,
        units: "meters",
    },
    vias_ferreas: {
        title: "vías férreas",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/vias_ferreas.geojson",
        enabled: true,
        parent: null,
        isPointLayer: false,
        field: "",
        colors: ["#272a28"],
        hoverInfo: false,
        dataFiltering: (data: any) => { return data },
        isLine: true
    },
    equipamientos: {
        title: "equipamientos",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/equipamientos.geojson",
        enabled: true,
        parent: null,
        isPointLayer: true,
        field: "group",
        colors: [],
        categoryColors: {
            "educacion": "#e9c46a",
            "salud": "#4abfbd",
            "recreacion": "#e76f51",
            "parques": "#8ab17d"
        },
       children: {
        "educacion": "educación",
        "salud": "salud",
        "recreacion": "recreación",
        "parques": "parques"
        },
        hoverInfo: false,
        dataProcessing: (data: any) => {
            const equipamiento_Groups: any = {
                "guarderia": "educacion",
                "preescolar": "educacion",
                "primaria": "educacion",
                "secundaria": "educacion",
                "preparatoria": "educacion",
                "universidad": "educacion",
                "auditorio": "recreacion",
                "biblioteca": "recreacion",
                "cine": "recreacion",
                "parque": "parques",
                "unidad_deportiva": "recreacion",
                "centro_salud": "salud",
                "hospital": "salud",
            }
            data.features = data.features.filter((feature: any) => feature.properties.equipamiento !== null);
            data.features.forEach((feature: any) => {
                feature.properties.group = equipamiento_Groups[feature.properties.equipamiento];
            });
            return data;
        },
        isLine: false,
    },
    hidrografia: {
        title: "arroyos y ríos",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/arroyos_rios.geojson",
        enabled: true,
        parent: null,
        isPointLayer: false,
        field: "",
        colors: ["#92d3f1ff"],
        hoverInfo: false,
        dataFiltering: (data: any) => { return data},
        categoryColors: {},
        isLine: true,
        lineWidth: 8,
    },
    lineas_drenaje: {
        title: "líneas de drenaje",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/drenajes.geojson",
        enabled: true,
        parent: null,
        isPointLayer: false,
        field: "",
        colors: ["#18515bff"],
        hoverInfo: false,
        dataFiltering: (data: any) => { return data},
        categoryColors: {},
        isLine: true,
        lineWidth: 20,
        units: "meters",
    },
    inundaciones: {
        title: "riesgo de inundaciones",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/inundaciones_raster.tif",
        //url: './assets/data/cd_juarez_inundacion_60min_sm.tif',
        raster: true,
        enabled: true,
        parent: null,
        isPointLayer: true,
        field: "ID",
        //colors: ["#ff0000"],
        clickInfo: true,
        dataFiltering: (data: any) => { return data},
       featureInfo: true,
       isLine: false
    },
    islas_calor: {
        title: "islas de calor",
        url: `https://justiciaambientalstore.blob.core.windows.net/data/Islas_de_calor_Juarez.geojson`,
        enabled: true,
        parent: null,
        isPointLayer: false,
        field: "lst",
        colors: ["#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000"],
        opacity: 0.7,
        hoverInfo: false,
        dataFiltering: (data: any) => { return data },
        isLine: false,
        lineWidth: 1,
    },
    industrias: {
        title: "industrias",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/industrias_denue.geojson",
        enabled: true,
        parent: null,
        isPointLayer: true,
        field: "sector",
        colors: [],
        categoryColors: {
            "Manufactureras de alimentos textiles y tabaco": "#699e38",
            "Manufactureras de madera, papel, químicos y plástico": "#704776",
            "Manufactureras de metálicos, maquinaria y electrónicos": "#be1a32",
            "Energía electrica, agua y gas": "#00859c",
            "Transporte": "#45151b",
            "Manejo de residuos": "#db9a0cff",
        },
        hoverInfo: false,
        dataFiltering: (data: any) => { return data},
        isLine: false,
    },
    industrias_contaminantes_complementary: {
        title: "industrias contaminantes",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/industry_points.geojson",
        extraUrl: 'https://justiciaambientalstore.blob.core.windows.net/data/industry_circles.geojson',
        jsonurl: `https://justiciaambientalstore.blob.core.windows.net/data/releases.json?${REACT_APP_SAS_TOKEN}`,
        jsonData: null,
        enabled: true,
        parent: null,
        isPointLayer: true,
        field: "sector",
        colors: [],
        categoryColors: {
            "Manufactureras de metálicos, maquinaria y electrónicos": "#be1a32" ,
            "Manufactureras de madera, papel, químicos y plástico": "#704776",
            "Manejo de residuos": "#db9a0cff",
            "Manufactureras de metálicos, maquinaria y electrónicos+Manufactureras de madera, papel, químicos y plástico": "#224ba5ff",
            "Transporte": "#45151b",
        },
        clickInfo: true,
        dataProcessing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.ID !== null);
            //split industries by +
            data.features.forEach((feature: any) => {
                const industries = feature.properties.industries ? feature.properties.industries.split("+") : [];
                feature.properties.industries = industries;
            });

            /*data.features.forEach((feature: any) => {
                const industries = feature.properties.industries;
                let bestMatchGroup = 'otras';
                let maxMatches = 0;
                Object.keys(industry_groups).forEach(group => {
                    const groupIndustries = industry_groups[group];
                    const matches = industries.filter((industry: string) => groupIndustries.includes(industry)).length;
                    if (matches > maxMatches) {
                        maxMatches = matches;
                        bestMatchGroup = group;
                    }
                });
                feature.properties.industry_group = bestMatchGroup;
            });*/
            return data;
        },
       featureInfo: true,
       isLine: false,
       radius: 5
    },
    parques_industriales: {
        title: "parques industriales",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/parques_industriales.geojson",
        enabled: true,
        parent: null,
        isPointLayer: false,
        field: "",
        colors: ["#272a28"],
        opacity: 0.5,
        hoverInfo: false,
        dataFiltering: (data: any) => { return data},
        isLine: false,
        lineWidth: 2
    },
}
    
