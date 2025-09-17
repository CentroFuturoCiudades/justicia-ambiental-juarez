//import { geoAlbers, lab } from "d3"

import { formatNumber } from "./utils";

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
            "riesgo_inundacion",
            "riesgo_trafico_vehicular",
            "exposicion_industria"
        ] as LayerKey[],
    },
    industria: {
        label: "industria",
        layers: [
            "hogares_vulnerables_industria",
            "infantes_vulnerables_industria",
            "adultos_vulnerables_industria",
            //"exposicion_industria"
        ] as LayerKey[],
    },
    equipamiento: {
        label: "equipamiento",
        layers: [
            "equipamientos",
            "indice_accesibilidad",
            "tiempo_viaje_recreativos",
            "tiempo_viaje_hospitales",
            "tiempo_viaje_preparatorias",
            "hogares_15min_espacios_recreativos",
            "hogares_30min_salud",
            "hogares_30min_preparatorias"
        ] as LayerKey[],
    },
    poblacion: {
        label: "población",
        layers: [
            "ingreso",
            "porcentaje_pob_0a5",
            "porcentaje_pob_60",
            "porcentaje_escolaridad",
            "indice_marginacion",
            "indice_bienestar"
        ] as LayerKey[],
    }
}

export const LAYERS: any = {
    vulnerabilidad_calor: {
        title: "Índice de vulnerabilidad al calor",
        description: "Evalúa la exposición al calor, la sensibilidad al calor y la capacidad de adaptación para evaluar de manera integral la vulnerabilidad al calor.",
        source: "Elaboración Propia con datos de Earth Resources Observation and Science (EROS) Center; European Space Agency, Center for International Earth Science Information Network, Demuzere et al., 2022; Schiavina et al., 2023; Tatem, 2017 (CIESIN) Columbia University",
        property: "vulnerabilidad_calor",
        tematica: "ambiental",
        type: "Categorica",
        is_lineLayer: false,
        visualization_type: "Semaforo",
        geographic_unit: "AGEB y Colonia",
        threshold: "1- Menos vulnerable, 2- Ligeramente vulnerable, 3- Moderadamente vulnerable, 4- Muy vulnerable, 5- Más vulnerable",
        //categories: ["Poco vulnerable", "Ligeramente vulnerable", "Moderadamente vulnerable", "Muy vulnerable", "Extremadamente vulnerable"],
        categories: ["Extremadamente vulnerable", "Muy vulnerable", "Moderadamente vulnerable", "Ligeramente vulnerable", "Poco vulnerable"],
        year: 2020,
        enabled: true,
        formatValue: (x: number) => {
            return formatNumber(x, 0)
        },
        amountOfColors: 5,
        colors: ["#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000"],
        //map_type: ,
        //metric: ,
        //stat_type: ,
        //graphs: [],
        //metrics: [],
    },
    riesgo_inundacion: {
        title: "Riesgo de Inundación",
        description: "Índice que mide el riesgo de inundación",
        source: "Elaboración propia con base Digital Elevation Model (DEM) y capa hidrológica",
        property: "riesgo_inundacion",
        tematica: "ambiental",
        type: "Categorica",
        is_lineLayer: false,
        visualization_type: "Semaforo",
        geographic_unit: "TIFF",
        threshold: "",
        year: null,
        //map_type: "raster",
        //metric: "puntaje_0_100",
        //stat_type: "promedio",
        //graphs: [],
        //metrics: [],
    },
    riesgo_trafico_vehicular: {
        title: "Exposición a alto tráfico vehicular",
        description: "Traffic proximity measures the count of vehicles per day (average annual daily traffic- AADT) divided by distance. EJScreen presents traffic proximity using percentile rank, ranging from 0 (lowest) to 100 (highest). ",
        source: "Datos del IMIP",
        property: "riesgo_trafico_vehicular",
        tematica: "ambiental",
        type: "Categorica",
        is_lineLayer: false,
        visualization_type: "Semaforo",
        geographic_unit: "Líneas de vialidades principales",
        threshold: "",
        year: null,
        //map_type: "geometry",
        //metric: "puntaje_0_100",
        //stat_type: "promedio",
        //graphs: [],
        //metrics: [],
    },
    hogares_vulnerables_industria: {
        title: "Hogares expuestos a industrias contaminantes",
        description: "% de hogares que tienen en un radio de 5 km al menos 1 industria",
        source: "Elaboración propia con datos censo (2020) y North American Pollutant Release and Transfer Register (PRTR) Initiative",
        property: "viviendas_vulnerables_industria",
        tematica: "industria",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Velocimetro",
        geographic_unit: "AGEB y TIFF",
        threshold: "",
        year: null,
        enabled: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.viviendas_vulnerables_industria !== null );
            data.features.forEach((feature: any) => {
                feature.properties.viviendas_vulnerables_industria = Math.round(feature.properties.viviendas_vulnerables_industria * 100);
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
        colors:["#f6ede9", "#8c5c47"],    
        //trimOutliers: true,    
        //trimOutliers: true,
        //map_type: "geometry",
        //metric: "porcentaje_hogares",
        //stat_type: "promedio",
        //graphs: [],
        //metrics: [],
    },
    infantes_vulnerables_industria: {
        title: "Infancias expuestas a industrias contaminantes",
        description: "% de infantes y adultos mayores que tienen en un radio de 5 km al menos 1 industria",
        source: "Elaboración propia con datos censo (2020) y North American Pollutant Release and Transfer Register (PRTR) Initiative",
        property: "infantes_vulnerables_industria",
        tematica: "industria",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Velocimetro",
        geographic_unit: "AGEB y TIFF",
        threshold: "",
        year: null,
        enabled: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.infantes_vulnerables_industria !== null);
            data.features.forEach((feature: any) => {
                feature.properties.infantes_vulnerables_industria = Math.round(feature.properties.infantes_vulnerables_industria * 100);
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
        colors:["#f6ede9", "#8c5c47"],
        //trimOutliers: true,
        //map_type: "geometry",
        //metric: "porcentaje_niños",
        //stat_type: "promedio",
        //graphs: [],
        //metrics: [],
    },
    adultos_vulnerables_industria: {
        title: "Adultos mayores expuestos a industrias contaminantes",
        description: "% de infantes y adultos mayores que tienen en un radio de 5 km al menos 1 industria",
        source: "Elaboración propia con datos censo (2020) y North American Pollutant Release and Transfer Register (PRTR) Initiative",
        property: "adultos_mayores_vulnerables_industria",
        tematica: "industria",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Velocimetro",
        geographic_unit: "AGEB y TIFF",
        threshold: "",
        year: null,
        enabled: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.adultos_mayores_vulnerables_industria !== null);
            data.features.forEach((feature: any) => {
                feature.properties.adultos_mayores_vulnerables_industria = Math.round(feature.properties.adultos_mayores_vulnerables_industria * 100);
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
        colors:["#f6ede9", "#8c5c47"],
        //trimOutliers: true,
        //map_type: "geometry",
        //metric: "porcentaje_niños",
        //stat_type: "promedio",
        //graphs: [],
        //metrics: [],
    },
    exposicion_industria: {
        title: "Kg de contaminantes por kilómetro cuadrado",
        description: "Cuántos kilogramos de contaminantes totales hay por kilómetro cuadrado de superficie del AGEB/colonia",
        source: "North American Pollutant Release and Transfer Register (PRTR) Initiative",
        property: "kg_contaminantes_por_km2",
        tematica: "ambiental",
        type: "Continua",
        is_lineLayer: false,
        //visualization_type: "Velocimetro",
        //geographic_unit: "AGEB y TIFF",
        //threshold: "",
        //year: null,
        enabled: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.exposición_contaminantes !== null);
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + " kg"
        },
        colors:["#f6ede9", "#8c5c47"],
        trimOutliers: true,
    },
    equipamientos: {
        title: "Equipamientos", //"Número y tipos de equipamientos",
        description: "Número de equipamientos por tipo (salud, educación, recreativos y cuidados)",
        source: "IMIP",
        property: "equipamientos",
        tematica: "equipamiento",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Treemap y mapa",
        geographic_unit: "Puntos latitud-longitud",
        threshold: "",
        year: null,
        //map_type: "geometry",
        //metric: "num_equipamientos",
        //stat_type: "promedio",
        //graphs: [],
        //metrics: [],
    },
    indice_accesibilidad: {
        title: "Índice de Accesibilidad a Equipamientos",
        description: "Índice de accesibilidad: modelo gravitacional incorporando acceso a equipamientos de salud, educación, y cuidados",
        source: "",
        property: "income_pc",
        tematica: "equipamiento",
        type: "Categorica",
        is_lineLayer: false,
        visualization_type: "Semaforo",
        geographic_unit: "AGEB",
        threshold: "",
        year: null,
        //map_type: "geometry",
        //metric: "puntaje_0_100",
        //stat_type: "promedio",
        //graphs: [],
        //metrics: [],
    },
    tiempo_viaje_recreativos: {
        title: "Tiempo promedio a espacios recreativos",
        description: "Índice que mide el tiempo promedio de acceso a espacios recreativos",
        source: "Elaboración propia con datos de equipamientos y OSM",
        property: "tiempo_viaje_recreativos",
        tematica: "equipamiento",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Numerico",
        geographic_unit: "AGEB",
        threshold: "< 5 min: Bueno, 5-20: Medio, > 20: Vulnerable",
        year: null,
        //map_type: "geometry",
        //metric: "minutos", 
        //stat_type: "promedio",
        //graphs: [],
        //metrics: [],
    },
    tiempo_viaje_hospitales: {
        title: "Tiempo promedio a hospitales o clínicas",
        description: "Índice que mide el tiempo promedio de acceso a equipamientos de salud",
        source: "Elaboración propia con datos de equipamientos y OSM",
        property: "tiempo_viaje_hospitales",
        tematica: "equipamiento",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Numerico",
        geographic_unit: "AGEB",
        threshold: "< 20 min: Bueno, 20-60: Medio, > 60: Vulnerable",
        year: null,
        //map_type: "geometry",
        //metric: "minutos",
        //stat_type: "promedio",
        //graphs: [],
        //metrics: [],
    },
    tiempo_viaje_preparatorias: {
        title: "Tiempo promedio a preparatorias",
        description: "Índice que mide el tiempo promedio de acceso a preparatorias",
        source: "Elaboración propia con datos de equipamientos y OSM",
        property: "tiempo_viaje_preparatorias",
        tematica: "equipamiento",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Numerico",
        geographic_unit: "AGEB",
        threshold: "< 15 min: Bueno, 15-45: Medio, > 45: Vulnerable",
        year: null,
        //map_type: "geometry",
        //metric: "minutos",
        //stat_type: "promedio",
        //graphs: [],
        //metrics: [],
    },
    hogares_15min_espacios_recreativos: {
        title: "Acceso a espacios recreativos",
        description: "Porcentaje de hogares con acceso a espacio recreativo a 15 minutos",
        source: "Elaboración propia con datos de equipamientos y OSM",
        property: "porcentaje_hogares_recreativos",
        tematica: "equipamiento",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Velocimetro",
        geographic_unit: "AGEB",
        threshold: "",
        year: null,
        //map_type: "geometry",
        //metric: "porcentaje_hogares", 
        //stat_type: "promedio",
        //graphs: [],
        //metrics: [],
    },
    hogares_30min_salud: {
        title: "Acceso a hospitales o clínicas",
        description: "Porcentaje de hogares con acceso a hospitales o clinicas a 30 minutos",
        source: "Elaboración propia con datos de equipamientos y OSM",
        property: "porcentaje_hogares_salud",
        tematica: "equipamiento",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Velocimetro",
        geographic_unit: "AGEB",
        threshold: "",
        year: null,
        //map_type: "geometry",
        //metric: "porcentaje_hogares", 
        //stat_type: "promedio",
        //graphs: [],
        //metrics: [],
    },
    hogares_30min_preparatorias: {
        title: "Acceso a preparatorias",
        description: "Porcentaje de hogares con acceso a preparatorias a 30 minutos",
        source: "Elaboración propia con datos de equipamientos y OSM",
        property: "porcentaje_hogares_preparatorias",
        tematica: "equipamiento",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Velocimetro",
        geographic_unit: "AGEB",
        threshold: "",
        year: null,
        //map_type: "geometry",
        //metric: "porcentaje_hogares",
        //stat_type: "promedio",
        //graphs: [],
        //metrics: [],
    },
    ingreso: {
        title: "Ingreso promedio per cápita ",
        description: "Ingreso promedio per cápita mensual en pesos mexicanos para población económicamente activa",
        source: "Elaboración propia, con base en datos del ENIGH (2018) y censo (2020)",
        property: "ingreso",
        tematica: "poblacion",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Semaforo",
        geographic_unit: "AGEB",
        threshold: "",
        year: null,
        enabled: true,
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
        //map_type: "geometry",
        //metric: "ingreso_promedio", //(Alto, Medio, Bajo)
        //stat_type: "promedio",
        //graphs: [],
        //metrics: [],
    },
    porcentaje_pob_0a5: {
        title: "Infancias Vulnerables", //"Porcentaje de población de 0 a 5 años",
        description: "Porcentaje de población de 0 y 5 años",
        source: "Censo INEGI (2020)",
        property: "porcentaje_pob_0a5",
        tematica: "poblacion",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Velocimetro",
        geographic_unit: "AGEB",
        threshold: "0% a 20% continua",
        year: null,
        enabled: true,
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
        //map_type: "geometry",
        //metric: "porcentaje", //0% a 20%
        //stat_type: "promedio",
        //graphs: [],
        //metrics: [],
    },
    porcentaje_pob_60: {
        title: "Adultos mayores vulnerables", //"Porcentaje de población de 60+",
        description: "Porcentaje de población de 60+",
        source: "Censo INEGI (2020)",
        property: "porcentaje_pob_60",
        tematica: "poblacion",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Velocimetro",
        geographic_unit: "AGEB",
        threshold: "",
        year: null,
        enabled: true,
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
        //map_type: "geometry",
        //metric: "porcentaje", //0% a 10%
        //stat_type: "promedio",
        //graphs: [],
        //metrics: [],
    },
    porcentaje_escolaridad: {
        title: "Población sin preparatoria terminada",
        description: "Porcentaje de la población, mayores de 18 años, total del AGEB que reportó tener menos de 12 años de escolaridad completada (preparatoria)",
        source: "Censo INEGI (2020)",
        property: "porcentaje_menos_prepa_terminada",
        tematica: "poblacion",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Velocimetro",
        geographic_unit: "AGEB",
        threshold: "> 60%: Vulnerable",
        year: null,
        enabled: true,
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
        //map_type: "geometry",
        //metric: "porcentaje", // 0% a 60%
        //stat_type: "promedio",
        //graphs: [],
        //metrics: [],
    },
    indice_marginacion: {
        title: "Indice de Marginación Urbana",
        description: "Indice marg. urbana desc.",
        source: "CONAPO",
        property: "indice_marginacion",
        tematica: "poblacion",
        type: "Categorica",
        is_lineLayer: false,
        visualization_type: "Semaforo",
        geographic_unit: "",
        threshold: "",
        year: null,
        //enabled: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.indice_marginacion !== null);
            return data;
        },
        formatValue: (x: string) => {
            return x
        },
        //map_type: "geometry",
        //metric: "puntaje_0_100",
        //stat_type: "promedio",
        //graphs: [],
        //metrics: [],
    },
    indice_bienestar: {
        title: "Niveles de Bienestar",
        description: "Índice de Bienestar Social  (variables utilizadas: % TV, % refri, % lavadoras, % microondas, grado prom. esc., prom. ocu. por cuarto. PC1 70%)",
        source: "Datos IMIP",
        property: "indice_bienestar",
        tematica: "poblacion",
        type: "Categorica",
        is_lineLayer: false,
        visualization_type: "Semaforo",
        geographic_unit: "AGEB",
        threshold: "",
        year: null,
        //map_type: "geometry",
        //metric: "puntaje_0_100",
        //stat_type: "promedio",
        //graphs: [],
        //metrics: [],
    }
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
    industrias: {
        title: "industrias",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/industries.geojson",
        enabled: true,
        parent: null,
        isPointLayer: true,
        field:"release",
        colors: ["#7e0000ff", "#ff0000ff"],
        //colors: ["#927e5eff", "#d88a25ff", "#e76e36ff", "#d42e14ff", "#ff0000ff"],
        hoverInfo: true,
    },
    parques_industriales: {
        title: "parques industriales",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/parques_industriales.geojson",
        enabled: true,
        parent: "industrias",
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

