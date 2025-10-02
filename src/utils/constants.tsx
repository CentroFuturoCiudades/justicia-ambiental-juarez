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
        label: "riesgos ambientales",
        layers: [
            "vulnerabilidad_calor",
            "riesgo_inundacion",
            "riesgo_trafico_vehicular",
        ] as LayerKey[],
    },
    industria: {
        label: "riesgos relacionados a la industria",
        layers: [
            "hogares_vulnerables_industria",
            "infantes_vulnerables_industria",
            "adultos_vulnerables_industria",
            "kg_contaminantes",
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
    vulnerabilidad_calor: {
        title: "Índice de vulnerabilidad al calor",
        description: "Índice que evalúa la exposición al calor, la sensibilidad al calor y la capacidad de adaptación para evaluar de manera integral la vulnerabilidad al calor.",
        source: "Elaboración Propia con datos de Earth Resources Observation and Science (EROS) Center; European Space Agency, Center for International Earth Science Information Network, Demuzere et al., 2022; Schiavina et al., 2023; Tatem, 2017 (CIESIN) Columbia University (ver: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5251739)",
        property: "vulnerabilidad_calor",
        tematica: "ambiental",
        type: "Categorica",
        is_lineLayer: false,
        visualization_type: "Semaforo",
        geographic_unit: "AGEB y Colonia",
        threshold: "1- Menos vulnerable, 2- Ligeramente vulnerable, 3- Moderadamente vulnerable, 4- Muy vulnerable, 5- Más vulnerable",
        labels : {
            1: "Poco vulnerable",
            2: "Ligeramente vulnerable",
            3: "Moderadamente vulnerable",
            4: "Muy vulnerable",
            5: "Extremadamente vulnerable"
        },
        year: 2020,
        enabled: true,
        formatValue: (x: number) => {
            return formatNumber(x, 2)
        },
        amountOfColors: 5,
        colors: ["#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000"],
        descriptionCategories: {
            1: "baja",
            2: "ligeramente baja",
            3: "media",
            4: "ligeramente alta",
            5: "alta"
        },
        juarezCard: (avg: string, num: string, category: string) => {
            return (
                <span>el índice de vulnerabilidad al calor, es de <strong>{avg}</strong> lo que representa una <strong>vulnerabilidad {category}.</strong></span>
            );
        },
        selectionCard: (avg: string, compared: string, num: string, category: string) => {
            return (
            <>
                <span>tiene un índice de vulnerabilidad al calor de <strong>{avg}</strong>, lo que representa una <strong>vulnerabilidad {category}.</strong></span>
                <br/>
                <span>Este índice esta por <strong>{compared}</strong> del índice promedio de Ciudad Juarez.</span>
            </>
            );
        }
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
    },
    riesgo_trafico_vehicular: {
        title: "Proximidad a vialidades de alto tráfico vehicular",
        description: "La proximidad al tráfico mide la cantidad de vehículos que circulan cerca de un lugar y se presenta en percentiles del 0 (más bajo) al 100 (más alto).",
        source: "Elaboración propia con datos del Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez.",
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
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.tdpa_density !== null );
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 1)
        },
        juarezCard: (avg: string) =>
            <span>el promedio de proximidad a vialidades con alto trafico vehicular es de <strong>{avg}</strong> lo que representa una exposición X.</span>,
        selectionCard: (avg: string, compared: string, num: string, category: string) => {
            return (
            <>
                <span>tiene <strong>{avg}</strong>, lo que representa una <strong>vulnerabilidad X.</strong></span>
                <br/>
                <span>Este índice esta por <strong>{compared}</strong> del índice promedio de Ciudad Juarez.</span>
            </>
            );
        }
    },
    
    hogares_vulnerables_industria: {
        title: "Hogares expuestos a industrias contaminantes",
        description: "Se dividieron los sitios contaminantes en 5 quintiles, de acuerdo al nivel de emisiones contaminantes. Al primer quintil.",
        source: "Elaboración propia con datos del Instituto Nacional de Estadística y Geografía (INEGI), Censo de Población y Vivienda 2020 y la Comisión para la Cooperación Ambiental (CEC). (2025). Taking Stock: North American PRTR Database — Mapa interactivo de emisiones y transferencias [Plataforma en línea]. Recuperado de https://takingstock.cec.org/Map?Culture=en-US&IndustryLevel=4&Measure=3&MediaTypes=29&ReportType=1&ResultType=1&Years=2023",
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
        juarezCard: (avg: string, num: string) =>
            <span>hay <strong>{num}</strong> hogares expuestos a industrias contaminantes, lo que representa el <strong>{avg}</strong> de los hogares.</span>,
        selectionCard: (avg: string, compared: string, num: string) => {
            return (
            <>
                <span>hay <strong>{num}</strong> hogares expuestos a industrias contaminantes, lo que representa el <strong>{avg}</strong> de los hogares.</span>
                <br/>
                <span>Este porcentaje esta por <strong>{compared}</strong> del promedio de Ciudad Juarez.</span>
            </>
            );
        }
    },
    infantes_vulnerables_industria: {
        title: "Infancias expuestas a industrias contaminantes",
        description: "% de infantes y adultos mayores que tienen en un radio de 5 km al menos 1 industria",
        source: "Elaboración propia con datos del Instituto Nacional de Estadística y Geografía (INEGI), Censo de Población y Vivienda 2020 y la Comisión para la Cooperación Ambiental (CEC). (2025). Taking Stock: North American PRTR Database — Mapa interactivo de emisiones y transferencias [Plataforma en línea]. Recuperado de https://takingstock.cec.org/Map?Culture=en-US&IndustryLevel=4&Measure=3&MediaTypes=29&ReportType=1&ResultType=1&Years=2023",
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
        juarezCard: (avg: string, num: string) =>
            <span>hay <strong>{num}</strong> infantes de 0 a 5 años expuestos a industrias contaminantes, lo que representa el <strong>{avg}</strong> de la población.</span>,
        selectionCard: (avg: string, compared: string, num: string) => {
            return (
            <>
                <span>hay <strong>{num}</strong> infantes de 0 a 5 años expuestos a industrias contaminantes, lo que representa el <strong>{avg}</strong> de la población.</span>
                <br/>
                <span>Este porcentaje esta por <strong>{compared}</strong> del promedio de Ciudad Juarez.</span>
            </>
            );
        }
    },
    adultos_vulnerables_industria: {
        title: "Adultos mayores expuestos a industrias contaminantes",
        description: "% de infantes y adultos mayores que tienen en un radio de 5 km al menos 1 industria",
        source: "Elaboración propia con datos del Instituto Nacional de Estadística y Geografía (INEGI), Censo de Población y Vivienda 2020 y la Comisión para la Cooperación Ambiental (CEC). (2025). Taking Stock: North American PRTR Database — Mapa interactivo de emisiones y transferencias [Plataforma en línea]. Recuperado de https://takingstock.cec.org/Map?Culture=en-US&IndustryLevel=4&Measure=3&MediaTypes=29&ReportType=1&ResultType=1&Years=2023",
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
        juarezCard: (avg: string, num: string) =>
            <span>hay <strong>{num}</strong> adultos de 60 años o más expuestos a industrias contaminantes, lo que representa el <strong>{avg}</strong>% de la población.</span>,
        selectionCard: (avg: string, compared: string, num: string) => {
            return (
            <>
                <span>hay <strong>{num}</strong> adultos mayores de 60 años o más expuestos a industrias contaminantes, lo que representa el <strong>{avg}</strong>% de la población.</span>
                <br/>
                <span>Este porcentaje esta por <strong>{compared}</strong> del promedio de Ciudad Juarez.</span>
            </>
            );
        }
    },
    kg_contaminantes: {
        title: "Kg de contaminantes por kilómetro cuadrado",
        description: "Cuántos kilogramos de contaminantes totales hay por kilómetro cuadrado de superficie del AGEB/colonia.",
        source: "Comisión para la Cooperación Ambiental (CEC). (2025). Taking Stock: North American PRTR Database — Mapa interactivo de emisiones y transferencias [Plataforma en línea]. Recuperado de https://takingstock.cec.org/Map?Culture=en-US&IndustryLevel=4&Measure=3&MediaTypes=29&ReportType=1&ResultType=1&Years=2023",
        property: "kg_contaminantes_por_km2",
        tematica: "industria",
        type: "Continua",
        is_lineLayer: false,
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
        juarezCard: (avg: string) =>
            <span>la exposición promedio a contaminantes industriales es de <strong>{avg}</strong>/km².</span>,
        selectionCard: (avg: string, compared: string) => {
            return (
            <>
                <span>la exposición a contaminantes industriales es de <strong>{avg}/km² </strong>.</span>
                <br/>
                <span>Este porcentaje esta por <strong>{compared}</strong> del promedio de Ciudad Juarez.</span>
            </>
            );
        }
    },
    equipamientos: {
        title: "Equipamientos", //"Número y tipos de equipamientos",
        description: "Número de equipamientos por tipo (salud, educación, recreativos y cuidados).",
        source: "Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez.",
        property: "equipamientos",
        tematica: "equipamiento",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Treemap y mapa",
        geographic_unit: "Puntos latitud-longitud",
        threshold: "",
        year: null,
    },
    indice_accesibilidad: {
        title: "Índice de Accesibilidad a Equipamientos",
        description: "Métrica combinada que toma en cuenta el tiempo de viaje a equipamientos educativos, de salud, y recreativos. Entre más alta, más facil es acceder a ellos.",
        source: "Elaboración propia con base en datos del Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez y OpenStreetMap (OSM).",
        property: "accessibility_score",
        tematica: "equipamiento",
        //type: "Categorica",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Semaforo",
        geographic_unit: "AGEB",
        threshold: "",
        year: null,
        enabled: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.accessibility_score !== null);
            data.features.forEach((feature: any) => {
                feature.properties.accessibility_score = Math.round(feature.properties.accessibility_score * 100);
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) 
        },
        juarezCard: (avg: string) =>
            <span>el índice promedio de accesibilidad a equipamientos es de <strong>{avg}</strong>, lo que representa una accesibilidad X.</span>,
        selectionCard: (avg: string, compared: string) => {
            return (
            <>
                <span>el índice promedio de accesibilidad a equipamientos es de <strong>{avg}</strong>.</span>
                <br/>
                <span>Este porcentaje esta por <strong>{compared}</strong> del promedio de Ciudad Juarez.</span>
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
        is_lineLayer: false,
        visualization_type: "Numerico",
        geographic_unit: "AGEB",
        threshold: "< 5 min: Bueno, 5-20: Medio, > 20: Vulnerable",
        year: null,
        enabled: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.tiempo_parque !== null);
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + " min"
        },
        juarezCard: (avg: string) =>
            <span>el tiempo promedio de acceso a espacios recreativos es de <strong>{avg}</strong>.</span>,
        selectionCard: (avg: string, compared: string) => {
            return (
            <>
                <span>el tiempo promedio de acceso a espacios recreativos es de <strong>{avg}</strong>.</span>
                <br/>
                <span>Este porcentaje esta por <strong>{compared}</strong> del promedio de Ciudad Juarez.</span>
            </>
            );
        }
    },
    tiempo_hospitales: {
        title: "Tiempo promedio a hospitales o clínicas",
        description: "Índice que mide el tiempo promedio de acceso a equipamientos de salud",
        source: "Elaboración propia con base en datos del Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez y OpenStreetMap (OSM).",
        property: "tiempo_clinica_hospital",
        tematica: "equipamiento",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Numerico",
        geographic_unit: "AGEB",
        threshold: "< 20 min: Bueno, 20-60: Medio, > 60: Vulnerable",
        year: null,
        enabled: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.tiempo_clinica_hospital !== null);
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + " min"
        },
        juarezCard: (avg: string) =>
            <span>el tiempo promedio de acceso a hospitales o clínicas es de <strong>{avg}</strong>.</span>,
        selectionCard: (avg: string, compared: string) => {
            return (
            <>
                <span>el tiempo promedio de acceso a hospitales o clínicas es de <strong>{avg}</strong>.</span>
                <br/>
                <span>Este porcentaje esta por <strong>{compared}</strong> del promedio de Ciudad Juarez.</span>
            </>
            );
        }
    },
    tiempo_preparatorias: {
        title: "Tiempo promedio a preparatorias",
        description: "Índice que mide el tiempo promedio de acceso a preparatorias",
        source: "Elaboración propia con base en datos del Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez y OpenStreetMap (OSM).",
        property: "tiempo_preparatoria",
        tematica: "equipamiento",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Numerico",
        geographic_unit: "AGEB",
        threshold: "< 15 min: Bueno, 15-45: Medio, > 45: Vulnerable",
        year: null,
        enabled: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.tiempo_preparatoria !== null);
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + " min"
        },
        juarezCard: (avg: string) =>
            <span>el tiempo promedio de acceso a preparatorias es de <strong>{avg}</strong>.</span>,
        selectionCard: (avg: string, compared: string) => {
            return (
            <>
                <span>el tiempo promedio de acceso a preparatorias es de <strong>{avg}</strong>.</span>
                <br/>
                <span>Este porcentaje esta por <strong>{compared}</strong> del promedio de Ciudad Juarez.</span>
            </>
            );
        }
    },
    acceso_recreativos: {
        title: "Acceso a espacios recreativos",
        description: "Porcentaje de hogares con acceso a espacio recreativo a 15 minutos.",
        source: "Elaboración propia con base en datos del Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez y OpenStreetMap (OSM).",
        property: "per_hogares_parque_15mi",
        tematica: "equipamiento",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Velocimetro",
        geographic_unit: "AGEB",
        threshold: "",
        year: null,
        enabled: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.per_hogares_parque_15mi !== null);
            data.features.forEach((feature: any) => {
                feature.properties.per_hogares_parque_15mi = Math.round(feature.properties.per_hogares_parque_15mi * 100);
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
        juarezCard: (avg: string) =>
            <span>el <strong>{avg}</strong> de los hogares tienen acceso a espacios recreativos en 15 minutos.</span>,
        selectionCard: (avg: string, compared: string) => {
            return (
            <>
                <span>el <strong>{avg}</strong> de los hogares tienen acceso a espacios recreativos en 15 minutos.</span>
                <br/>
                <span>Este porcentaje esta por <strong>{compared}</strong> del promedio de Ciudad Juarez.</span>
            </>
            );
        }
    },
    acceso_hospitales: {
        title: "Acceso a hospitales o clínicas",
        description: "Porcentaje de hogares con acceso a hospitales o clinicas a 30 minutos.",
        source: "Elaboración propia con base en datos del Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez y OpenStreetMap (OSM).",
        property: "per_hogares_clinica_hospital_30mi",
        tematica: "equipamiento",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Velocimetro",
        geographic_unit: "AGEB",
        threshold: "",
        year: null,
        enabled: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.per_hogares_clinica_hospital_30mi !== null);
            data.features.forEach((feature: any) => {
                feature.properties.per_hogares_clinica_hospital_30mi = Math.round(feature.properties.per_hogares_clinica_hospital_30mi * 100);
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
        juarezCard: (avg: string) =>
            <span>el <strong>{avg}</strong> de los hogares tienen acceso a hospitales o clínicas en 30 minutos.</span>,
        selectionCard: (avg: string, compared: string) => {
            return (
            <>
                <span>el <strong>{avg}</strong> de los hogares tienen acceso a hospitales o clínicas en 30 minutos.</span>
                <br/>
                <span>Este porcentaje esta por <strong>{compared}</strong> del promedio de Ciudad Juarez.</span>
            </>
            );
        }
    },
    acceso_preparatorias: {
        title: "Acceso a preparatorias",
        description: "Porcentaje de hogares con acceso a preparatorias a 30 minutos.",
        source: "Elaboración propia con base en datos del Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez y OpenStreetMap (OSM).",
        property: "per_hogares_preparatoria_30mi",
        tematica: "equipamiento",
        type: "Continua",
        is_lineLayer: false,
        visualization_type: "Velocimetro",
        geographic_unit: "AGEB",
        threshold: "",
        year: null,
        enabled: true,
        dataProcesssing: (data: any) => {
            data.features = data.features.filter((feature: any) => feature.properties.per_hogares_preparatoria_30mi !== null);
            data.features.forEach((feature: any) => {
                feature.properties.per_hogares_preparatoria_30mi = Math.round(feature.properties.per_hogares_preparatoria_30mi * 100);
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 0) + "%"
        },
        //colors: ["#f4f9ff", "#846b9eff", "#483a57ff"],
        colors: ["#b7c6e6", "#a58dc0ff", "#846b9eff", "#61457fff","#38264cff"],
        juarezCard: (avg: string) =>
            <span>el <strong>{avg}</strong> de los hogares tienen acceso a preparatorias en 30 minutos.</span>,
        selectionCard: (avg: string, compared: string) => {
            return (
            <>
                <span>el <strong>{avg}</strong> de los hogares tienen acceso a preparatorias en 30 minutos.</span>
                <br/>
                <span>Este porcentaje esta por <strong>{compared}</strong> del promedio de Ciudad Juarez.</span>
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
        juarezCard: (avg: string) =>
            <span>el ingreso promedio per cápita es de <strong>{avg}</strong>.</span>,
        selectionCard: (avg: string, compared: string) => {
            return (
            <>
                <span>el ingreso promedio per cápita es de <strong>{avg}</strong>.</span>
                <br/>
                <span>Su ingreso promedio per cápita está por <strong>{compared}</strong> del promedio de Ciudad Juarez.</span>
            </>
            );
        }
    },
    porcentaje_pob_0a5: {
        title: "Infancias",
        description: "Porcentaje de población de 0 y 5 años.",
        source: "Instituto Nacional de Estadística y Geografía (INEGI), Censo de Población y Vivienda, 2020.",
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
        juarezCard: (avg: string, num: string) =>
            <span>hay <strong>{num}</strong> infantes de 0 a 5 años, lo que representa el <strong>{avg}</strong> de la población.</span>,
        selectionCard: (avg: string, compared: string, num: string) => {
            return (
            <>
                <span>hay <strong>{num}</strong> infantes de 0 a 5 años, lo que representa el <strong>{avg}</strong> de la población.</span>
                <br/>
                <span>Este porcentaje está por <strong>{compared}</strong> del promedio de Ciudad Juarez.</span>
            </>
            );
        }
    },
    porcentaje_pob_60: {
        title: "Adultos mayores",
        description: "Porcentaje de población de 60 años o más.",
        source: "Instituto Nacional de Estadística y Geografía (INEGI), Censo de Población y Vivienda, 2020.",
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
        juarezCard: (avg: string, num: string) =>
            <span>hay <strong>{num}</strong> adultos de 60 años o más, lo que representa el <strong>{avg}</strong> de la población.</span>,
        selectionCard: (avg: string, compared: string, num: string) => {
            return (
            <>
                <span>hay <strong>{num}</strong> adultos de 60 años o más, lo que representa el <strong>{avg}</strong> de la población.</span>
                <br/>
                <span>Este porcentaje está por <strong>{compared}</strong> del promedio de Ciudad Juarez.</span>
            </>
            );
        }
    },
    porcentaje_escolaridad: {
        title: "Población sin preparatoria terminada",
        description: "Porcentaje de la población mayor de 18 años que reportó tener menos de 12 años de escolaridad (preparatoria).",
        source: "Instituto Nacional de Estadística y Geografía (INEGI), Censo de Población y Vivienda, 2020.",
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
        juarezCard: (avg: string, num: string) =>
            <span><strong>{num}</strong> personas no cuentan con la preparatoria terminada, lo que representa el <strong>{avg}</strong> de la población.</span>,
        selectionCard: (avg: string, compared: string, num: string) => {
            return (
            <>
                <span><strong>{num}</strong> personas no cuentan con la preparatoria terminada, lo que representa el <strong>{avg}</strong> de la población.</span>
                <br/>
                <span>Este porcentaje está por <strong>{compared}</strong> del promedio de Ciudad Juarez.</span>
            </>
            );
        }
    },
    indice_bienestar: {
        title: "Nivel del Bienestar",
        description: "El Nivel de Bienestar mide las condiciones económicas, sociales y culturales de la población —como educación, vivienda y servicios— y clasifica a cada zona en cinco niveles: muy bajo, bajo, medio, alto y muy alto.",
        source: "Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez, 2020.",
        property: "indice_bienestar",
        tematica: "poblacion",
        type: "Categorica",
        is_lineLayer: false,
        visualization_type: "Semaforo",
        geographic_unit: "AGEB",
        threshold: "",
        year: null,
        enabled: true,
        labels : {
            1: "Muy Bajo",
            2: "Bajo",
            3: "Medio",
            4: "Alto",
            5: "Muy Alto"
        },
        descriptionCategories: {
            1: "muy bajo",
            2: "bajo",
            3: "medio",
            4: "alto",
            5: "muy alto"
        },
        dataProcesssing: (data: any) => {
            const marginacionMap: any = {
                "MUY BAJO": 1,
                "BAJO": 2,
                "MEDIO": 3,
                "ALTO": 4,
                "MUY ALTO": 5
            }
            data.features = data.features.filter((feature: any) => feature.properties.indice_bienestar !== null);
            data.features.forEach((feature: any) => {
                feature.properties.indice_bienestar = marginacionMap[feature.properties.indice_bienestar];
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 2)
        },
        colors: ["#cdd8e6", "#08316b"],
        juarezCard: (avg: string, num: string, category: string) =>
            <span><strong>{num}</strong> personas tienen un nivel de bienestar <strong>{category}</strong>, lo que representa el <strong>{avg}</strong> de la población.</span>,
        selectionCard: (avg: string, compared: string, num: string, category: string) => {
            return (
            <>
                <span>tiene un nivel de bienestar <strong>{category}</strong>.</span>
                <br/>
                <span>Este nivel está por <strong>{compared}</strong> del nivel de Ciudad Juarez (medio).</span>
            </>
            );
        }
    },
    indice_marginacion: {
        title: "Indice de Marginación Urbana",
        description: "Da cuenta de las carencias de la población asociadas a la escolaridad, la vivienda, los ingresos y otros aspectos sociodemográficos.",
        source: "Consejo Nacional de Población (CONAPO), 2020.",
        property: "indice_marginacion",
        tematica: "poblacion",
        type: "Categorica",
        is_lineLayer: false,
        visualization_type: "Semaforo",
        geographic_unit: "",
        threshold: "",
        year: null,
        enabled: true,
        labels : {
            1: "Muy bajo",
            2: "Bajo",
            3: "Medio",
            4: "Alto",
            5: "Muy alto"
        },
        descriptionCategories: {
            1: "muy bajo",
            2: "bajo",
            3: "medio",
            4: "alto",
            5: "muy alto"
        },
        dataProcesssing: (data: any) => {
            const marginacionMap: any = {
                "Muy bajo": 1,
                "Bajo": 2,
                "Medio": 3,
                "Alto": 4,
                "Muy alto": 5
            }
            data.features = data.features.filter((feature: any) => feature.properties.indice_marginacion !== null);
            data.features.forEach((feature: any) => {
                feature.properties.indice_marginacion = marginacionMap[feature.properties.indice_marginacion];
            });
            return data;
        },
        formatValue: (x: number) => {
            return formatNumber(x, 2)
        },
        colors: ["#cdd8e6", "#08316b"],
        juarezCard: (avg: string, num: string, category: string) =>
            <span><strong>{num}</strong> personas tienen un índice de marginación urbana <strong>{category}</strong>, lo que representa el <strong>{avg}</strong> de la población.</span>,
        selectionCard: (avg: string, compared: string, num: string, category: string) => {
            return (
            <>
                <span>tiene un nivel de marginación <strong>{category}</strong>.</span>
                <br/>
                <span>Este nivel está por <strong>{compared}</strong> del nivel de Ciudad Juarez.</span>
            </>
            );
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
    industrias: {
        title: "industrias contaminantes",
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

