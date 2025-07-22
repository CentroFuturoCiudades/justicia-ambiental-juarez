//import { geoAlbers, lab } from "d3"

export const COLORS = {
    GLOBAL: {
        primary: "",
        textPrimary: "#545454",
        highlightGreen: "#87b6b3",
        highlightRed: "#bb6361",
        backgroundLight: "#efeeeb",
        backgroundMedium: "#e3e1dd",
        backgroundDark: "#40423d"
    },
    ambiental: {
        primary: "#a2b687",
    },
    industria: {
        primary: "#8d8473",
    },
    equipamiento: {
        primary: "#9b87b6",
    },
    poblacion: {
        primary: "#acbab6",
    }
}

export type LayerKey = keyof typeof LAYERS;
export const SECTIONS = {
    ambiental: {
        label: "ambiental",
        layers: [
            "vulnerabilidad_ambiental", 
            "islas_calor", 
            "calidad_del_aire", 
            "riesgo_inundacion", 
            "riesgo_trafico_vehicular", 
            "indice_vulnerabilidad_ambiental"
        ] as LayerKey[],
    },
    industria: {
        label: "industria",
        layers: [
            "hogares_vulnerables_industria", 
            "infantes_vulnerables_industria"
        ] as LayerKey[],
    },
    equipamiento: {
        label: "equipamiento",
        layers: [
            "equipamientos", 
            "indice_accesibilidad", 
            "tiempo_acceso_recreativos", 
            "tiempo_acceso_salud", 
            "tiempo_acceso_preparatorias", 
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
            "porcentaje_bajos_ingresos", 
            "indice_bienestar"
        ] as LayerKey[],
    }
}

export const LAYERS = {
    vulnerabilidad_ambiental: {
        title: "Indice de Vulnerabilidad Ambiental",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/ingresos_por_ageb.geojson",
        type: "Categorica",
        metric: "puntaje_0_100", //Puntaje de 0 a 100 (Alto, Medio, Bajo)
        visualization_type: "Gráfica de rango de edades y vulnerabilidad ambiental", // mantener?
        tematica: "ambiental",
        geographic_unit: "AGEB",
        threshold: "",
        description: "Índice que combina",
        year: 2020,
        graphs: [],
        metrics: [],
    },
    islas_calor: {
        title: "Exposición a Islas de Calor",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/ingresos_por_ageb.geojson",
        type: "Continua",
        metric: "grados_centigrados",
        visualization_type: "Semaforo",
        tematica: "ambiental",
        geographic_unit: "AGEB",    //Celdas de raster de 30 x 30m convertidas a AGEBs
        threshold: "",
        description: "Indice que mide la exposición a islas de calor",
        year: null,
        graphs: [],
        metrics: [],
    },
    calidad_del_aire: {
        title: "Calidad del Aire",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/ingresos_por_ageb.geojson",
        type: "Continua",
        metric: "indice_calidad_del_aire", //Varía dependiendo del contaminante
        visualization_type: "Mapa",
        tematica: "ambiental",
        geographic_unit: "Mapa", //Mapa con celdas de raster de 1kmx1km
        threshold: "",
        description: "Índice que mide la calidad del aire en base a diferentes contaminantes",
        year: null,
        graphs: [],
        metrics: [],
    },
    riesgo_inundacion: {
        title: "Riesgo de Inundación",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/ingresos_por_ageb.geojson",
        type: "Categorica",
        metric: "puntaje_0_100",
        visualization_type: "Semaforo",
        tematica: "ambiental",
        geographic_unit: "TIFF",
        threshold: "",
        description: "Índice que mide el riesgo de inundación",
        year: null,
        graphs: [],
        metrics: [],
    },
    riesgo_trafico_vehicular: {
        title: "Exposición a zonas con alto tráfico vehicular",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/ingresos_por_ageb.geojson",
        type: "Categorica",
        metric: "puntaje_0_100",
        visualization_type: "Semaforo",
        tematica: "ambiental",
        geographic_unit: "Líneas de vialidades principales",
        threshold: "",
        description: "Traffic proximity measures the count of vehicles per day (average annual daily traffic- AADT) divided by distance. EJScreen presents traffic proximity using percentile rank, ranging from 0 (lowest) to 100 (highest).",
        year: null,
        graphs: [],
        metrics: [],
    },
    indice_vulnerabilidad_ambiental: {
        title: "Indice de Vulnerabilidad Ambiental",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/ingresos_por_ageb.geojson",
        type: "Categorica",
        metric: "puntaje_0_100",
        visualization_type: "Semaforo",
        tematica: "ambiental",
        geographic_unit: "AGEB",
        threshold: "",
        description: "Índice para medir la vulnerabilidad ambiental",
        year: null,
        graphs: [],
        metrics: [],
    },
    hogares_vulnerables_industria: {
        title: "Porcentaje de hogares próximos (5 km) a X tipo industria contaminante",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/ingresos_por_ageb.geojson",
        type: "Continua",
        metric: "porcentaje_hogares",
        visualization_type: "Velocimetro",
        tematica: "industria",
        geographic_unit: "AGEB y TIFF",
        threshold: "",
        description: "% de hogares que tienen en un radio de 5 km al menos 1 industria",
        year: null,
        graphs: [],
        metrics: [],
    },
    infantes_vulnerables_industria: {
        title: "Porcentaje de 0-5 años, +65 años expuestos (5 km) a X tipo industria contaminante",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/ingresos_por_ageb.geojson",
        type: "Continua",
        metric: "porcentaje_niños",
        visualization_type: "Velocimetro",
        tematica: "industria",
        geographic_unit: "AGEB y TIFF",
        threshold: "",
        description: "% de infantes y adultos mayores que tienen en un radio de 5 km al menos 1 industria",
        year: null,
        graphs: [],
        metrics: [],
    },
    equipamientos: {
        title: "Número y tipos de equipamientos",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/ingresos_por_ageb.geojson",
        type: "Continua",
        metric: "num_equipamientos",
        visualization_type: "Treemap y mapa",
        tematica: "equipamiento",
        geographic_unit: "Puntos latitud-longitud",
        threshold: "",
        description: "Índice que mide la disponibilidad de equipamientos (salud, educación, recreativos y cuidados) en una zona",
        year: null,
        graphs: [],
        metrics: [],
    },
    indice_accesibilidad: {
        title: "Indice de Accesibilidad",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/ingresos_por_ageb.geojson",
        type: "Categorica",
        metric: "puntaje_0_100",
        visualization_type: "Semaforo",
        tematica: "equipamiento",
        geographic_unit: "AGEB",
        threshold: "",
        description: "Índice de accesibilidad: modelo gravitacional incorporando acceso a equipamientos de salud, educación, y cuidados",
        year: null,
        graphs: [],
        metrics: [],
    },
    tiempo_acceso_recreativos: {
        title: "Tiempo promedio a espacios recreativos",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/ingresos_por_ageb.geojson",
        type: "Continua",
        metric: "minutos", 
        visualization_type: "Numerico",
        tematica: "equipamiento",
        geographic_unit: "AGEB",
        threshold: "< 5 min: Bueno, 5-20: Medio, > 20: Vulnerable",
        description: "Índice que mide el tiempo promedio de acceso a espacios recreativos",
        year: null,
        graphs: [],
        metrics: [],
    },
    tiempo_acceso_salud: {
        title: "Tiempo promedio a hospitales o clínicas",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/ingresos_por_ageb.geojson",
        type: "Continua",
        metric: "minutos",
        visualization_type: "Numerico",
        tematica: "equipamiento",
        geographic_unit: "AGEB",
        threshold: "< 20 min: Bueno, 20-60: Medio, > 60: Vulnerable",
        description: "Índice que mide el tiempo promedio de acceso a equipamientos de salud",
        year: null,
        graphs: [],
        metrics: [],
    },
    tiempo_acceso_preparatorias: {
        title: "Tiempo promedio a preparatorias",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/ingresos_por_ageb.geojson",
        type: "Continua",
        metric: "minutos",
        visualization_type: "Numerico",
        tematica: "equipamiento",
        geographic_unit: "AGEB",
        threshold: "< 15 min: Bueno, 15-45: Medio, > 45: Vulnerable",
        description: "Índice que mide el tiempo promedio de acceso a preparatorias",
        year: null,
        graphs: [],
        metrics: [],
    },
    hogares_15min_espacios_recreativos: {
        title: "Porcentaje de hogares con acceso a espacio recreativo a 15 minutos",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/ingresos_por_ageb.geojson",
        type: "Continua",
        metric: "porcentaje_hogares", 
        visualization_type: "Velocimetro",
        tematica: "equipamiento",
        geographic_unit: "AGEB",
        threshold: "",
        description: "% de hogares que tienen en un radio de 15 minutos al menos 1 espacio recreativo",
        year: null,
        graphs: [],
        metrics: [],
    },
    hogares_30min_salud: {
        title: "Porcentaje de hogares con acceso a hospitales o clinicas a 30 minutos",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/ingresos_por_ageb.geojson",
        type: "Continua",
        metric: "porcentaje_hogares", 
        visualization_type: "Velocimetro",
        tematica: "equipamiento",
        geographic_unit: "AGEB",
        threshold: "",
        description: "% de hogares que tienen en un radio de 30 minutos al menos 1 equipamiento de salud",
        year: null,
        graphs: [],
        metrics: [],
    },
    hogares_30min_preparatorias: {
        title: "Porcentaje de hogares con acceso a preparatorias a 30 minutos",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/ingresos_por_ageb.geojson",
        type: "Continua",
        metric: "porcentaje_hogares",
        visualization_type: "Velocimetro",
        tematica: "equipamiento",
        geographic_unit: "AGEB",
        threshold: "",
        description: "% de hogares que tienen en un radio de 30 minutos al menos 1 preparatoria",
        year: null,
        graphs: [],
        metrics: [],
    },
    ingreso: {
        title: "Ingreso Promedio",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/ingresos_por_ageb.geojson",
        type: "Continua",
        metric: "ingreso_promedio", //(Alto, Medio, Bajo)
        visualization_type: "Semaforo",
        tematica: "poblacion",
        geographic_unit: "AGEB",
        threshold: "",
        description: "Ingreso promedio",
        year: null,
        graphs: [],
        metrics: [],
    },
    porcentaje_pob_0a5: {
        title: "Porcentaje de población de 0 a 5 años",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/ingresos_por_ageb.geojson",
        type: "Continua",
        metric: "porcentaje", //0% a 20%
        visualization_type: "Velocimetro",
        tematica: "poblacion",
        geographic_unit: "AGEB",
        threshold: "",
        description: "Porcentaje de la población que tiene entre 0 y 5 años",
        year: null,
        graphs: [],
        metrics: [],
    },
    porcentaje_pob_60: {
        title: "Porcentaje de población de 60+",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/ingresos_por_ageb.geojson",
        type: "Continua",
        metric: "porcentaje", //0% a 10%
        visualization_type: "Velocimetro",
        tematica: "poblacion",
        geographic_unit: "AGEB",
        threshold: "",
        description: "Porcentaje de la población que tiene 60 años o más",
        year: null,
        graphs: [],
        metrics: [],
    },
    porcentaje_escolaridad: {
        title: "Grado promedio de escolaridad",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/ingresos_por_ageb.geojson",
        type: "Continua",
        metric: "porcentaje", // 0% a 60%
        visualization_type: "Velocimetro",
        tematica: "poblacion",
        geographic_unit: "AGEB",
        threshold: "> 60%: Vulnerable",
        description: "Porcentaje de la población total del AGEB que reportó tener menos de 12 años de escolaridad completada (preparatoria)",
        year: null,
        graphs: [],
        metrics: [],
    },
    porcentaje_bajos_ingresos: {
        title: "Proporción de hogares con bajos ingresos (último quintil)",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/ingresos_por_ageb.geojson",
        type: "Continua",
        metric: "porcentaje",
        visualization_type: "Velocimetro",
        tematica: "poblacion",
        geographic_unit: "AGEB",
        threshold: "",
        description: "Porcentaje de hogares que reportaron tener ingresos por debajo del umbral de pobreza",
        year: 2020,
        graphs: [],
        metrics: [],
    },
    indice_bienestar: {
        title: "Indice de Bienestar Social",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/ingresos_por_ageb.geojson",
        type: "Categorica",
        metric: "puntaje_0_100",
        visualization_type: "Semaforo",
        tematica: "poblacion",
        geographic_unit: "AGEB",
        threshold: "",
        description: "Índice de Bienestar Social  (variables utilizadas: % TV, % refri, % lavadoras, % microondas, grado prom. esc., prom. ocu. por cuarto. PC1 70%)",
        year: null,
        graphs: [],
        metrics: [],
    }
}

export const CAPAS_BASE = {
    capa1: {
        title: "Capa 1",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/parques_industriales.geojson",
    },
    capa2: {
        title: "Capa 2",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/parques_industriales.geojson",
    },
    capa3: {
        title: "Capa 3",
        url: "https://justiciaambientalstore.blob.core.windows.net/data/parques_industriales.geojson",    },
}


export const TEMAS = {
    ambiental: {
        title: "Ambiental"
    },
    industria: {
    },
    equipamiento: {
    },
    poblacion: {
    }
}

export const FOOTER_ITEMS = [
    {
        title: "Tecnológico de Monterrey: Centro para el Futuro de las Ciudades",
        imageUrl: "https://futurociudades.tec.mx/sites/g/files/vgjovo1811/files/Logotipo-Centro-Futuro-CD.png"
    },
    {
        title: "Banco de Desarrollo de América del Norte",
        imageUrl: "https://www.jornada.com.mx/ndjsimg/images/jornada/jornadaimg/nombran-a-alejandro-olivo-villa-director-adjunto-del-nadbank-2068/nombran-a-alejandro-olivo-villa-director-adjunto-del-nadbank-2068html-banco-norte-1png-8397html-ed1f54a2-578f-4591-bb5f-4d4f2abb4d2f.png"
    },
    {
        title: "Baker Institute for Public Policy",
        imageUrl: "https://networkofcenters.net/sites/networkofcenters.net/files/styles/center_logo/public/baker%20instutute%20rice%20u.png?itok=dQPPaoah"
    },
    {
        title:"RICE University",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6c2WxWCCQ79DBz1ieePMGAbwY8aGMawtc2g&s"
    }
];