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
                <p className="cardContent__title">|El contexto fronterizo y sus vulnerabilidades|</p>
                <p className="cardContent__text">
                    El “Visor de Indicadores Ambientales y Sociales” sirve como un valioso punto de partida
                    para la identificación y el análisis de áreas que pueden justificar una revisión, un
                    análisis o un acercamiento comunitario más profundo. Se desarrolló para identificar 
                    cargas o externalidades ambientales negativas que experimentan las personas
                    más vulnerables en Ciudad Juárez. En otros países como EUA, se utilizó por agencias
                    estatales y grupos comunitarios para tomar decisiones relacionadas con permisos,
                    regulaciones y solicitudes de subvenciones, así como para mitigar y/o compensar dichos impactos.
                </p>
                <p className="cardContent__title">|Objetivo|</p> {/* |indicadores ambientales| */}
                <p className="cardContent__text">
                    Esta herramienta tiene como objetivo facilitar el acceso a los datos ambientales y
                    sociales para mejorar la planificación y para elaborar criterios de igualdad en el
                    desarrollo de actividades como el establecimiento de nuevas zonas industriales, la
                    emisión de permisos, el desarrollo de infraestructura, proyectos de transporte y las
                    evaluaciones de impacto relacionadas con la comunidad, la salud o vulnerabilidad
                    climática. 
                </p>
                <div className="cardContent__row">
                    <p className="cardContent__text" style={{ flex: "1" }}>
                        La importancia del desarrollo de un visor de indicadores ambientales y sociales es para
                        ayudar a identificar ciertos tipos de vulnerabilidad que no están documentadas
                        formalmente, desde la ubicación de industrias contaminantes en zonas marginadas o
                        vulnerables, disposición no regulada de desechos peligrosos, mala calidad del aire en
                        zonas con población sensible, etc.; hasta la falta de acceso a áreas verdes y a ciertos
                        servicios ecosistémicos. Esta herramienta nos brinda datos relevantes para diseñar
                        políticas ambientales y de desarrollo más equitativas y focalizadas, con base en las
                        necesidades y experiencias reales de los ciudadanos. Sirve como insumo para priorizar
                        acciones, desde infraestructura verde, industrial, nuevos proyectos de construcción,
                        visualizar exposición por proximidad y hasta campañas de concientización y
                        participación ciudadana.
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
                    El visor de indicadores ambientales y sociales te permite explorar datos territoriales de
                    Ciudad Juárez, comparar indicadores clave sobre temas ambientales, sobre
                    contaminación industrial, acceso a equipamientos y de población en general . La
                    herramienta está diseñada para ser accesible e intuitiva, ofreciendo reportes, gráficos y
                    mapas estándar que son fáciles de entender. Los usuarios pueden generar un reporte
                    para un área seleccionada y ver cómo se compara con el resto del municipio, lo que
                    permite identificar zonas prioritarias y vulnerables, justificar proyectos y diseñar
                    políticas públicas acordes al contexto.
                </p>

                <div className="cardContent__row" style={{ alignItems: 'center'}}>
                    <div style={{ fontFamily: "Roboto Mono", backgroundColor: "#e2b6b5", borderRadius: "50%", height: "10dvw", width: "10dvw", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--background-dark)", fontWeight: "bold", fontSize: "var(--font-size-header)"}}>
                        visualiza
                    </div>
                    <ul style={{ listStyleType: "disc" }} className="cardContent__text">
                        <li>Navega el mapa en el visor y activa capas temáticas para ver información clave y comparar indicadores sobre temas ambientales, contaminación industrial, acceso a equipamientos y de población en general.</li>
                        <li>Visualiza la información para toda la ciudad, selecciona un AGEB o colonia en específico, filtra por colonia o dibuja un polígono en una zona de interés.</li>
                        <li>Consulta las tarjetas dinámicas que comparan los valores de cada indicador con Ciudad Juárez, incluyendo fuentes de información y metodología de elaboración.</li>
                    </ul>
                 </div>

                 <div className="cardContent__row" style={{ alignItems: 'center'}}>
                    <div style={{ fontFamily: "Roboto Mono", backgroundColor: "#ebd0c6", borderRadius: "50%", height: "10dvw", width: "10dvw", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--background-dark)", fontWeight: "bold", fontSize: "var(--font-size-header)"}}>
                        compara
                    </div>
                    <ul style={{ listStyleType: "disc" }} className="cardContent__text">
                        <li>Visualiza los indicadores de cada territorio por separado para comprender su situación específica.</li>
                        <li>Selecciona y agrega distintos territorios al reporte rápido para construir comparaciones personalizadas.</li>
                        <li>Obtén en el reporte mapas y tablas de datos de estos indicadores que faciliten la comparación entre territorios.</li>
                    </ul>
                 </div>

                 <div className="cardContent__row" style={{ alignItems: 'center'}}>
                    <div style={{ fontFamily: "Roboto Mono", backgroundColor: "#ead7c7", borderRadius: "50%", height: "10dvw", width: "10dvw", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--background-dark)", fontWeight: "bold", flexWrap: "wrap", textAlign: "center", fontSize: "var(--font-size-header)", padding: "1dvw" }}>
                        toma decisiones informadas
                    </div>
                    <ul style={{ listStyleType: "disc" }} className="cardContent__text">
                        <li>Identifica rápidamente la situación de cada territorio y su comparación con Ciudad Juárez para definir prioridades.</li>
                        <li>Selecciona uno o varios territorios según tu necesidad; los indicadores se recalculan automáticamente, proporcionando evidencia clara para sustentar la toma de decisiones o la visualización de vulnerabilidad.</li>
                        <li>Genera reportes comparativos con mapas y tablas que permiten contrastar territorios y comunicar datos para recomendaciones y toma de decisiones. </li>
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
                        El visor de indicadores sociales y ambientales se construye a partir de capas de datos provenientes de fuentes públicas actualizadas 
                        periódicamente, como el Instituto Nacional de Estadística y Geografía (INEGI), el Instituto Municipal de Investigación y Planeación (IMIP) 
                        de Ciudad Juárez y la North American Pollutant Release and Transfer Register Initiative (PRTR) , entre otras. Gracias a ello, la herramienta 
                        refleja de la manera más fiel posible las condiciones actuales de Ciudad Juárez.    
                    </p>
                    <p className="bodytext-card">
                        Además de las fuentes públicas, incorporamos resultados de estudios de percepción con actores clave de Ciudad Juárez: gobierno, industria, academia, 
                        sociedad civil y comunidades de zonas periféricas. Esta consulta permitió identificar temas ambientales que preocupan a la población además de su 
                        percepción frente a los impactos sociales y ambientales acumulados durante más de 3 décadas de desarrollo industrial en la frontera; poniendo en 
                        evidencia la necesidad de mayor coordinación y de herramientas que apoyen el desarrollo de políticas urbanas más equitativas.
                    </p>
                    <p className="bodytext-card">
                        Como ciudad fronteriza con alta presencia industrial, Ciudad Juárez enfrenta desafíos específicos en materia ambiental y social. 
                        Muchas comunidades presentan condiciones de mayor vulnerabilidad al calor, afectaciones por inundaciones, exposición a mala calidad 
                        del aire y residuos tóxicos y contaminantes y baja accesibilidad a equipamientos. El visor permite ubicar y evaluar espacialmente estas 
                        desigualdades para orientar acciones y políticas más eficientes. El visor permite ubicar y evaluar espacialmente estas desigualdades 
                        estructurales a partir de cuatro ejes temáticos: 
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
                                    La temática <span className="bold">ambiental</span> engloba indicadores que miden la exposición y vulnerabilidad
                                    del territorio frente a fenómenos climáticos y a fuentes de contaminación asociadas a la
                                    movilidad. Los indicadores de esta temática permiten identificar zonas críticas para
                                    prevención de desastres, adaptación al cambio climático y protección de la salud
                                    poblacional.
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
                                    La temática <span className="bold">industrial</span> engloba indicadores que estiman la cercanía y exposición de la
                                    población, en especial de grupos vulnerables, a industrias que reportan sus
                                    contaminantes y que en ocasiones no disponen eficientemente de sus residuos
                                    generando exposición no deseada. Los indicadores de esta temática permiten orientar
                                    el monitoreo, la mitigación de impactos y el fortalecimiento de la regulación ambiental. 
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
                                   La temática de <span className="bold">equipamientos urbanos</span> engloba indicadores de disponibilidad,
                                    proximidad y tiempos de acceso a servicios esenciales como salud, educación y
                                    espacios recreativos. Los indicadores de esta temática permiten evaluar la equidad
                                    territorial y priorizar inversiones para mejorar la provisión de infraestructura social. 
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
                                    La temática de <span className="bold">población</span> engloba indicadores que describen perfiles socioeconómicos
                                    y demográficos, así como condiciones de bienestar y niveles de vulnerabilidad. Los
                                    indicadores de esta temática permiten identificar territorios y grupos que requieren
                                    mayor atención.
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
                        fuentes de datos y metodologías utilizadas para su cálculo, descarga el <a href={codebook_url} download style={{ textDecoration: "underline" }} className="bold">catálogo de datos</a>. 
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
            <p className="subtitle-card">Acerca de la plataforma</p>
            <p className="subtitle-card" style={{  fontSize:"var(--font-size-subtitle)"}}>|El desafío de la resiliencia en las ciudades fronterizas|</p>
            <div className="bodytext-card">
                <div style={{ display: "flex", flexDirection: "column", gap: "1dvh" }}>
                <p>
                    Las ciudades fronterizas, al tener una ubicación comercial privilegiada con el mercado
                    de los EUA, se han visto siempre frente a la disyuntiva del desarrollo económico y el
                    gran impacto socio-ambiental relacionado con dicho crecimiento que a la par, ha
                    impactado fuertemente las dinámicas comunitarias de sus poblaciones. 
                </p>
                <p>
                    Las ciudades y municipios fronterizos han desarrollado herramientas de política
                    pública, como planes de resiliencia, atlas de riesgos y planes de acción climática, para
                    enfrentar los desafíos que surgen del binomio del “desarrollo industrial y el impacto
                    ambiental”. Sin embargo, a pesar de estos avances, algunas áreas densamente
                    pobladas o cerca de zonas industriales siguen siendo altamente vulnerables a los
                    impactos ambientales. Esta vulnerabilidad puede ser causada tanto por la actividad
                    industrial y sus externalidades, como por vulnerabilidad climática, que expone a las
                    comunidades a riesgos como la contaminación y eventos climáticos extremos. 
                </p>
                <p>
                    El desarrollo de herramientas que sirvan para diagnosticar zonas de alta vulnerabilidad
                    frente a estos impactos mencionados se convierte en algo prioritario para poder mitigar
                    o reparar daños a la salud pública o al medio ambiente y para mejorar la planeación
                    urbana frente a nuevos proyectos de infraestructura de cualquier índole.
                </p>
                <p>
                    Este visor nos da información para restablecer procesos de equidad y participación
                    ciudadana y al mismo tiempo, promueve que actores del sector privado y del gobierno
                    incluyan planes de inversión social y de protección ambiental en sus procesos
                    productivos, de responsabilidad social corporativa y en sus planes de desarrollo local.  
                </p>
                </div>
            </div>
        </div>
    );
};