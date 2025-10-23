import HojaIcono from "/assets/Icono HOJA.png";
import LupaIcono from "/assets/Icono LUPA.png";
import RompecabezasIcono from "/assets/Icono ROMPECABEZAS.png";
import QuadrantMenu from "../Quadrant-Menu/QuadrantMenu";
import Card1_img from '/assets/Indicadores Ambientales.png';
import { codebook_url } from "../../../utils/constants";
import type { JSX } from "react";

export type AccordionItemType = {
  id: string;                      // Unique identifier
  title: string;                   // Header title shown on the accordion
  content: JSX.Element | string;  // Content shown when item is expanded
  icon: any;             // Optional icon next to title
}; 
export const accordionItems: AccordionItemType[] = [
    {
        id: "lupa",
        title: "¿para qué un visor de indicadores ambientales y sociales?", //"¿qué es la \nevaluación ambiental?",
        content: (
            <div className="cardContent">
                <p className="cardContent__title">|el contexto fronterizo y sus vulnerabilidades|</p>
                <p className="cardContent__text">
                    El “Visor de Indicadores Ambientales y Sociales” Sirve como un valioso punto de partida para la identificación y 
                    el análisis de áreas que pueden justificar una revisión, un análisis o un acercamiento comunitario más profundo. 
                    Se desarrolló para ayudar a abordar las cargas ambientales desproporcionadas que experimentan las personas más 
                    vulnerables en Ciudad Juárez. En otros países como EUA, se utilizó por agencias estatales y grupos comunitarios 
                    para tomar decisiones relacionadas con permisos, regulaciones y solicitudes de subvenciones. 
                </p>

                <p className="cardContent__title">|objetivo|</p> {/* |indicadores ambientales| */}
                <p className="cardContent__text">
                    Esta herramienta tiene como objetivo facilitar el uso de las normas de protección ambiental para mejorar la planificación 
                    y para elaborar criterios de igualdad en el desarrollo de actividades como el establecimiento de nuevas zonas industriales, 
                    la emisión de permisos, el desarrollo de infraestructura, proyectos de transporte y las evaluaciones de impacto relacionadas 
                    con la comunidad, la salud o el clima.
                </p>

                <div className="cardContent__row">
                    <p className="cardContent__text" style={{ flex: "1" }}>
                        La importancia del desarrollo de un visor de indicadores ambientales y sociales es para ayudar a identificar injusticias 
                        ambientales que no están documentadas formalmente, desde la ubicación de industrias contaminantes en zonas marginadas o 
                        vulnerables, disposición no regulada de desechos peligrosos, mala calidad del aire en zonas con población vulnerable, etc.; 
                        hasta la falta de acceso a áreas verdes. Esta herramienta nos brinda datos relevantes para diseñar políticas ambientales y 
                        de desarrollo más equitativas y focalizadas, con base en las necesidades y experiencias reales de los ciudadanos. 
                        Sirve como insumo para priorizar acciones, desde infraestructura verde, industrial, nuevos proyectos de construcción y hasta campañas de concientización. 
                    </p>
                    <div className="cardContent__img">
                        <img src={Card1_img} />
                    </div>
                </div>
            </div>
        ),
        icon: LupaIcono,
    },
    {
        id: "hoja",
        title: "uso de la herramienta",
        content: (
            <div className="cardContent">
                <p className="cardContent__title">
                    |¿qué puedes hacer aquí?|
                </p>
                <p className="cardContent__text">
                    El visor de indicadores ambientales y sociales te permite explorar datos territoriales de Ciudad Juárez, 
                    comparar indicadores clave sobre riesgos ambientales, riesgos asociados a la industria, acceso a equipamientos y 
                    características de la población. La herramienta está diseñada para ser accesible e intuitiva, ofreciendo reportes, 
                    gráficos y mapas estándar que son fáciles de entender. Los usuarios pueden generar un reporte para un área seleccionada 
                    y ver cómo se compara con el resto del municipio, lo que permite identificar zonas prioritarias, justificar proyectos y 
                    diseñar políticas públicas acordes al contexto. 
                </p>

                <div className="cardContent__row" style={{ alignItems: 'center'}}>
                    <div style={{ backgroundColor: "#e2b6b5", borderRadius: "50%", height: "10dvw", width: "10dvw", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--background-dark)", fontWeight: "bold", fontSize: "var(--font-size-header)"}}>
                        visualiza
                    </div>
                    <ul style={{ listStyleType: "disc" }} className="cardContent__text">
                        <li>Navega el mapa en el visor y activa capas temáticas para ver información clave de riesgos ambientales, riesgos relacionados a la industria, acceso a equipamientos y población. </li>
                        <li>Visualiza la información para toda la ciudad, selecciona un AGEB o colonia en específico, filtra por colonia o dibuja un polígono en una zona de interés. </li>
                        <li>Consulta las tarjetas dinámicas que comparan los valores de cada indicador con Ciudad Juárez.</li>
                    </ul>
                 </div>

                 <div className="cardContent__row" style={{ alignItems: 'center'}}>
                    <div style={{ backgroundColor: "#ebd0c6", borderRadius: "50%", height: "10dvw", width: "10dvw", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--background-dark)", fontWeight: "bold", fontSize: "var(--font-size-header)"}}>
                        compara
                    </div>
                    <ul style={{ listStyleType: "disc" }} className="cardContent__text">
                        <li>Visualiza los indicadores de cada territorio por separado para comprender su situación específica.</li>
                        <li>Selecciona y agrega distintos territorios al reporte rápido para construir comparaciones personalizadas.</li>
                        <li>Selecciona y agrega distintos territorios al reporte rápido para construir comparaciones personalizadas.</li>
                    </ul>
                 </div>

                 <div className="cardContent__row" style={{ alignItems: 'center'}}>
                    <div style={{ backgroundColor: "#ead7c7", borderRadius: "50%", height: "10dvw", width: "10dvw", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--background-dark)", fontWeight: "bold", flexWrap: "wrap", textAlign: "center", fontSize: "var(--font-size-header)", padding: "1dvw" }}>
                        toma decisiones informadas
                    </div>
                    <ul style={{ listStyleType: "disc" }} className="cardContent__text">
                        <li>Identifica rápidamente la situación de cada territorio y su comparación con Ciudad Juárez para definir prioridades.</li>
                        <li>Selecciona uno o varios territorios según tu necesidad; los indicadores se recalculan automáticamente, proporcionando evidencia clara para sustentar la toma de decisiones.</li>
                        <li>Genera reportes comparativos con mapas y tablas que permiten contrastar territorios y comunicar datos para recomendaciones y toma de decisiones.</li>
                    </ul>
                 </div>
            </div>
        ),
        icon: HojaIcono,
    },
    {
        id: "rompecabezas",
        title: "4 ejes temáticos",
        content: (
            <div className="cardContent">
                <p className="cardContent__title">
                    |datos|
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1dvh" }}>
                    <p className="bodytext-card">
                        El visor de indicadores sociales y ambientales se construye a partir de capas de datos provenientes 
                        de fuentes públicas actualizadas periódicamente, como el Instituto Nacional de Estadística y Geografía 
                        (INEGI), el Instituto Municipal de Investigación y Planeación (IMIP) de Ciudad Juárez y la North American Pollutant Release 
                        and Transfer Register (PRTR) Initiative, entre otras. Gracias a ello, la herramienta refleja de la manera más fiel posible las condiciones actuales de Ciudad Juárez.    
                    </p>
                    <p className="bodytext-card">
                        Además de las fuentes públicas, incorporamos resultados de estudios de percepción con actores clave de Ciudad Juárez: gobierno, 
                        industria, academia, sociedad civil y comunidades de zonas periféricas. Esta consulta permitió identificar riesgos clave, impactos 
                        sociales y ambientales acumulados durante más de cinco décadas de desarrollo industrial en la frontera y evidenció la necesidad de 
                        mayor coordinación y de herramientas que apoyen a quienes toman decisiones.
                    </p>
                    <p className="bodytext-card">
                        Como ciudad fronteriza con alta presencia industrial, Ciudad Juárez enfrenta desafíos específicos en materia ambiental y social. 
                        Muchas comunidades presentan condiciones de mayor vulnerabilidad al calor, afectaciones por inundaciones, exposición a industrias 
                        contaminantes y baja accesibilidad a equipamientos. El visor permite ubicar y evaluar espacialmente estas desigualdades para orientar 
                        acciones y políticas públicas. El visor permite ubicar y evaluar espacialmente estas desigualdades estructurales a partir de cuatro ejes temáticos: 
                    </p>
                </div>
        
                <QuadrantMenu
                    mainHeader="temáticas"
                    items={[
                    {
                        title: "ambiental",
                        description: (
                            <div className="cardContent">
                                <p>
                                    La temática de <strong>riesgos ambientales</strong> engloba indicadores que miden la exposición y vulnerabilidad del territorio frente a fenómenos climáticos y a fuentes de contaminación asociadas a la movilidad. Los indicadores de esta temática permiten identificar zonas críticas para prevención de desastres, adaptación al cambio climática y protección de la salud poblacional. 
                                </p>
                            </div>
                        ),
                        iconUrl: "https://via.placeholder.com/100",
                        url: "#",
                        mainHeader: ""
                    },
                    {
                        title: "industria",
                        description: (
                            <div className="cardContent">
                                <p>
                                    La temática de <strong>riesgos relacionados con la industria</strong> engloba indicadores que estiman la cercanía y exposición de la población, en especial grupos vulnerables, a actividades e instalaciones industriales potencialmente contaminantes. Los indicadores de esta temática permiten orientar el monitoreo, la mitigación de impactos y el fortalecimiento de la regulación ambiental. 
                                </p>
                            </div>
                        ),
                        iconUrl: "https://via.placeholder.com/100",
                        url: "#",
                        mainHeader: ""
                    },
                    {
                        title: "equipamientos",
                        description: (
                            <div className="cardContent">
                                <p>
                                    La temática de <strong>acceso a equipamientos urbanos</strong> engloba indicadores de disponibilidad, proximidad y tiempos de acceso a servicios esenciales como salud, educación y espacios recreativos. Los indicadores de esta temática permiten evaluar la equidad territorial y priorizar inversiones para mejorar la provisión de infraestructura social. 
                                </p>
                            </div>
                        ),
                        iconUrl: "https://via.placeholder.com/100",
                        url: "#",
                        mainHeader: ""
                    },
                    {
                        title: "población",
                        description: (
                            <div className="cardContent">
                                <p>
                                    La temática de <strong>población</strong> engloba indicadores que describen perfiles socioeconómicos y demográficos, así como condiciones de bienestar y niveles de vulnerabilidad. Los indicadores de esta temática permiten identificar territorios y grupos que requieren mayor atención. 
                                </p>
                            </div>
                        ),
                        iconUrl: "https://via.placeholder.com/100",
                        url: "#",
                        mainHeader: ""
                    },
                    ]}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: "1dvh" }}>
                    <p className="bodytext-card">
                        Para obtener mayor información sobre los indicadores disponibles en el visor, 
                        fuentes de datos y metodologías utilizadas para su cálculo, descarga el <a href={codebook_url} style={{ textDecoration: "underline" }}>catálogo de datos</a>. 
                    </p>
                </div>
            </div>
        ),
        icon: RompecabezasIcono,
    }
]

/*export const aboutContent = (
    <div style={{ display: "flex", flexDirection: "column", gap: "2dvw" }}>

    </div>*/

export const aboutContent: () => JSX.Element | string = () => {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2dvh"}}>
            <p className="subtitle-card">|acerca de la plataforma|</p>
            <p className="subtitle-card" style={{  fontSize:"var(--font-size-subtitle)"}}>El desafío de la resiliencia en las ciudades fronterizas</p>
                <p className="bodytext-card">
                    <div style={{ display: "flex", flexDirection: "column", gap: "1dvh" }}>
                    <p>Las ciudades fronterizas, al tener una ubicación comercial privilegiada con el mercado de los EUA, se han visto siempre frente 
                        a la disyuntiva del desarrollo económico y el gran impacto socio-ambiental relacionado con dicho crecimiento que a la par, 
                        ha impactado fuertemente las dinámicas comunitarias de sus poblaciones.  
                    </p>
                    <p>
                    Las ciudades y municipios fronterizos han desarrollado herramientas de política pública, como planes de resiliencia, atlas de riesgos 
                    y planes de acción climática, para enfrentar los desafíos que surgen del binomio del “desarrollo industrial y el impacto ambiental”. 
                    Sin embargo, a pesar de estos avances, algunas áreas densamente pobladas o cerca de zonas industriales siguen siendo altamente vulnerables 
                    a los impactos ambientales. Esta vulnerabilidad puede ser causada tanto por la actividad manufacturera y sus externalidades, como por la pura 
                    vulnerabilidad climática, que expone a las comunidades a riesgos como la contaminación y los eventos climáticos extremos. 
                    </p>
                    <p>El desarrollo de herramientas que sirvan para diagnosticar zonas de alta vulnerabilidad frente a estos impactos mencionados se 
                        convierte prioritario para poder mitigar o reparar daños a la salud pública o al medio ambiente e incluso mejorar la planeación 
                        urbana frente a nuevos proyectos de infraestructura de cualquier índole.
                    </p>
                    <p>
                    Este ejercicio nos da información para restablecer procesos de equidad y participación ciudadana y al mismo tiempo, da lugar a que 
                    actores del sector privado y del gobierno de incluir planes de inversión social y de protección ambiental en sus procesos productivos 
                    y planes de desarrollo local correspondientemente. 
                    </p>
                    </div>
                </p>
        </div>
    );
};