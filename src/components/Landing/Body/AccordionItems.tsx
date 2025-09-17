import HojaIcono from "/assets/Icono HOJA.png";
import LupaIcono from "/assets/Icono LUPA.png";
import RompecabezasIcono from "/assets/Icono ROMPECABEZAS.png";
import QuadrantMenu from "../Quadrant-Menu/QuadrantMenu";
import Card1_img from '/assets/Indicadores Ambientales.png';
import type { JSX } from "react";

export type AccordionItemType = {
  id: string;                      // Unique identifier
  title: string;                   // Header title shown on the accordion
  content: JSX.Element | string;  // Content shown when item is expanded
  images: string[];               // Optional images displayed in the panel
  icon?: any;             // Optional icon next to title
}; 
export const accordionItems: AccordionItemType[] = [
    {
        id: "lupa",
        //title: "¿qué es la \nevaluación ambiental?",
        title: "¿para qué un visor de indicadores ambientales y sociales?",
        content: (
            <div style={{ display: "flex", flexDirection: "column", gap: "2dvh"}}>
                <p className="subtitle-card">|el contexto fronterizo y sus vulnerabilidades|</p>
                <p className="bodytext-card">
                    El “Visor de Indicadores Ambientales y Sociales” Sirve como un valioso punto de partida 
                    para la identificación y el análisis de áreas que pueden justificar una revisión, 
                    un análisis o un acercamiento comunitario más profundo. Se desarrolló para ayudar a 
                    abordar las cargas ambientales desproporcionadas que experimentan las personas más vulnerables en Ciudad Juárez. 
                    En otros países como EUA, se utilizó por agencias estatales y grupos comunitarios para tomar decisiones 
                    relacionadas con permisos, regulaciones y solicitudes de subvenciones.
                </p>

                <p className="subtitle-card">|objetivo|</p>
                <p className="bodytext-card">
                    Esta herramienta tiene como objetivo facilitar el uso de las normas de protección ambiental para mejorar 
                    la planificación y para elaborar criterios de igualdad en el desarrollo de actividades como el establecimiento 
                    de nuevas zonas industriales, la emisión de permisos, el desarrollo de infraestructura, proyectos de transporte 
                    y las evaluaciones de impacto relacionadas con la comunidad, la salud o el clima.
                </p>

                {/*<p className="subtitle-card">|indicadores ambientales|</p>
                <p className="bodytext-card">
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                    when an unknown printer took a galley of type and scrambled it to make a type
                    specimen book. It has survived not only five centuries, but also the leap into
                    electronic typesetting, remaining essentially unchanged. It was popularised in
                    the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.
                    when an unknown printer took a galley of type and scrambled it to make a type
                    specimen book. It has survived not only five centuries, but also the leap into
                    electronic typesetting, remaining essentially unchanged. It was popularised in
                    the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.
                </p>*/}

                <div style={{ display: "flex", flexDirection: "row", gap: "2dvw" }}>
                    <p className="bodytext-card" style={{ flex: "1" }}>
                        La importancia del desarrollo de un visor de indicadores ambientales y sociales es para ayudar a identificar 
                        injusticias ambientales que no están documentadas formalmente, desde la ubicación de industrias contaminantes 
                        en zonas marginadas o vulnerables, disposición no regulada de desechos peligrosos, mala calidad del aire en zonas 
                        con población vulnerable, etc.; hasta la falta de acceso a áreas verdes. Esta herramienta nos brinda datos 
                        relevantes para diseñar políticas ambientales y de desarrollo más equitativas y focalizadas, con base en las 
                        necesidades y experiencias reales de los ciudadanos. Sirve como insumo para priorizar acciones, desde 
                        infraestructura verde, industrial, nuevos proyectos de construcción y hasta campañas de concientización.
                    </p>
                    <div style={{ width: "40%"}}>
                        <img src={Card1_img} alt="Indicadores Ambientales" />
                    </div>
                </div>
            </div>
        ),
        images: ["https://via.placeholder.com/150x100"],
        icon: LupaIcono,
    },
    {
        id: "hoja",
        title: "uso de la herramienta",
        content: (
            <div style={{ display: "flex", flexDirection: "column", gap: "2dvh" }}>
                <p className="subtitle-card">
                    |metodología|
                </p>
                <p className="bodytext-card">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                    when an unknown printer took a galley of type and scrambled it to make a type 
                    specimen book. It has survived not only five centuries, but also the leap into 
                    electronic typesetting, remaining essentially unchanged. It was popularised in 
                    the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, 
                    and more recently with desktop publishing software like Aldus PageMaker including 
                    versions of Lorem Ipsum.
                    specimen book. It has survived not only five centuries, but also the leap into 
                    electronic typesetting, remaining essentially unchanged. It was popularised in 
                    the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, 
                    and more recently with desktop publishing software like Aldus PageMaker including 
                    versions of Lorem Ipsum.
                </p>

                <div style={{ display: "flex", flexDirection: "row", gap: "2dvw" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2dvh",  flex: "1" }}>
                        <p className="subtitle-card" >
                            |visualiza, compara y 
                            <br/>
                            toma decisiones informadas|
                        </p>
                        <p className="bodytext-card">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                            when an unknown printer took a galley of type and scrambled it to make a type
                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                            when an unknown printer took a galley of type and scrambled it to make a type
                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                        </p>
                    </div>
                    <div style={{  width: "40%", position: "relative"}}>
                        <div style={{
                            width: "8.5dvw",
                            height: "8.5dvw",
                            borderRadius: "50%",
                            background: "#f4cdd3",
                            position: "absolute",
                            top: "10%",
                            right: "0",
                        }} />
                        <div style={{
                            width: "8.5dvw",
                            height: "8.5dvw",
                            borderRadius: "50%",
                            background: "#eeb0ba",
                            position: "absolute",
                            bottom: "0",
                        }} />
                    </div>
                 </div>
            </div>
        ),
        images: ["https://via.placeholder.com/150x100"],
        icon: HojaIcono,
    },
    {
        id: "rompecabezas",
        title: "4 ejes temáticos",
        content: (
            <div style={{ display: "flex", flexDirection: "column", gap: "2dvh"}}>
                <p className="subtitle-card">
                    |datos|
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1dvh" }}>
                    <p className="bodytext-card">
                        El visor de indicadores sociales y ambientales está basado en la colección de capas de datos obtenidos del 
                        Actualizaciones periódicas de datos como el CENSO poblacional y el Cuestionario ampliado (2024???), datos del ENIGH 2024, 
                        y otras bases de datos ambientales como (XXXXXX). Esto asegura que la herramienta refleje las condiciones actuales lo mejor posible.
                        Ciudad Juárez es una ciudad fronteriza con fuerte presencia industrial, lo que implica desafíos específicos como:    
                    </p>
                    <ul className="bodytext-card" style={{ paddingLeft: "2dvw" }}>
                        <li>• El control de emisiones contaminantes.</li>
                        <li>• La falta de regulación ambiental efectiva.</li>
                        <li>• Los problemas de la vulnerabilidad en colonias periféricas.</li>
                    </ul>
                    <p className="bodytext-card">
                        Muchas de estas comunidades ya experimentan fuertes riesgos ambientales. Suelen vivir en zonas con mayor exposición a 
                        inundaciones, olas de calor, deposiciones de basura y residuos tóxicos o dónde existe contaminación histórica o heredada de ciertas actividades 
                        industriales. El visor nos permite valorar e identificar espacialmente algunas de estas desigualdades estructurales desde 
                        4 perspectivas:
                    </p>
                </div>
        
                <QuadrantMenu
                    mainHeader="temáticas"
                    items={[
                    {
                        title: "ambiental",
                        description: (
                            <div style={{ display: "flex", flexDirection: "column", gap: "2dvh" }}>
                                <p>
                                    <strong>Perspectiva ambiental</strong> en dónde hemos incluido indicadores de: XXXXX
                                </p>
                                {/*<div style={{ display: "flex", flexDirection: "row", gap: "2dvw" }}>
                                    <p style={{ width: "50%" }}>
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                                        when an unknown printer took a galley of type and scrambled it to make a type
                                        specimen book. It has survived not only five centuries, but also the leap into 
                                        electronic typesetting, remaining essentially unchanged. It was popularised in
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                                        when an unknown printer took a galley of type and scrambled it to make a type
                                        specimen book. It has survived not only five centuries, but also the leap into 
                                        electronic typesetting, remaining essentially unchanged. It was popularised in  
                                    </p>
                                </div>*/}
                            </div>
                        ),
                        iconUrl: "https://via.placeholder.com/100",
                        url: "#",
                        mainHeader: ""
                    },
                    {
                        title: "industria",
                        description: (
                            <div style={{ display: "flex", flexDirection: "column", gap: "2dvw" }}>
                                <p>
                                    <strong>Perspectiva Industrial</strong> incluyendo indicadores : XXXX
                                </p>
                                {/*<div style={{ display: "flex", flexDirection: "row", gap: "2dvw" }}>
                                    <p style={{ width: "50%" }}>
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                                        when an unknown printer took a galley of type and scrambled it to make a type
                                        specimen book. It has survived not only five centuries, but also the leap into 
                                        electronic typesetting, remaining essentially unchanged. It was popularised in
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                                        when an unknown printer took a galley of type and scrambled it to make a type
                                        specimen book. It has survived not only five centuries, but also the leap into 
                                        electronic typesetting, remaining essentially unchanged. It was popularised in  
                                    </p>
                                </div>*/}
                            </div>
                        ),
                        iconUrl: "https://via.placeholder.com/100",
                        url: "#",
                        mainHeader: ""
                    },
                    {
                        title: "equipamiento",
                        description: (
                            <div style={{ display: "flex", flexDirection: "column", gap: "2dvw" }}>
                                <p>
                                    <strong>Perspectiva de equipamiento</strong> urbano con indicadores:  XXX
                                </p>
                                {/*<div style={{ display: "flex", flexDirection: "row", gap: "2dvw" }}>
                                    <p style={{ width: "50%" }}>
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                                        when an unknown printer took a galley of type and scrambled it to make a type
                                        specimen book. It has survived not only five centuries, but also the leap into 
                                        electronic typesetting, remaining essentially unchanged. It was popularised in
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                                        when an unknown printer took a galley of type and scrambled it to make a type
                                        specimen book. It has survived not only five centuries, but also the leap into 
                                        electronic typesetting, remaining essentially unchanged. It was popularised in  
                                    </p>
                                </div>*/}
                            </div>
                        ),
                        iconUrl: "https://via.placeholder.com/100",
                        url: "#",
                        mainHeader: ""
                    },
                    {
                        title: "población",
                        description: (
                            <div style={{ display: "flex", flexDirection: "column", gap: "2dvw" }}>
                                <p>
                                   <strong>Perspectiva poblacional</strong> examinando indicadores: XXXXX   
                                </p>
                                {/*<div style={{ display: "flex", flexDirection: "row", gap: "2dvw" }}>
                                    <p style={{ width: "50%" }}>
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                                        when an unknown printer took a galley of type and scrambled it to make a type
                                        specimen book. It has survived not only five centuries, but also the leap into 
                                        electronic typesetting, remaining essentially unchanged. It was popularised in
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                                        when an unknown printer took a galley of type and scrambled it to make a type
                                        specimen book. It has survived not only five centuries, but also the leap into 
                                        electronic typesetting, remaining essentially unchanged. It was popularised in  
                                    </p>
                                </div>*/}
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
                      La herramienta está diseñada para ser accesible e intuitiva, ofreciendo reportes, 
                      gráficos y mapas estándar que son fáciles de entender. Los usuarios pueden generar un 
                      reporte para un área seleccionada y ver cómo se compara con el resto del municipio.      
                    </p>
                    <p className="bodytext-card">
                        A estos datos existentes se  sumaron la información colectada de una serie de estudios 
                        de percepción con los grupos de interés de Ciudad Juárez que tienen algún tipo de injerencia 
                        en la dinámica urbana.
                    </p>
                    <p className="bodytext-card">
                      Los grupos de interés consultaos en los estudios de percepción fueron el gobierno, representantes 
                      de la industria, de la academia, grupos activos de la sociedad civil en Juárez y comunidades afectadas 
                      en zonas periféricas de la ciudad.      
                    </p>
                    <p className="bodytext-card">
                        La consulta con estos grupos nos permitió identificar algunos impactos sociales y ambientales que han 
                        sido importantes a lo largo de las más de 5 décadas que Juárez ha sido un motor de desarrollo de la frontera, 
                        sin olvidar que al mismo tiempo, este crecimiento requiere mejor coordinación y de herramientas que apoyen a los 
                        tomadores de decisiones .
                    </p>
                </div>
            </div>
        ),
        images: [],
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
                    <p>Las ciudades fronterizas, al tener una ubicación comercial privilegiada con el mercado de los EUA, 
                    se han visto siempre frente a la disyuntiva del desarrollo económico y el gran impacto socio-ambiental relacionado 
                    con dicho crecimiento que a la par, ha impactado fuertemente las dinámicas comunitarias de sus poblaciones.
                    </p>
                    <p>Las ciudades y municipios fronterizos han desarrollado herramientas de política pública, como planes de resiliencia, 
                    atlas de riesgos y planes de acción climática, para enfrentar los desafíos que surgen del binomio del “desarrollo 
                    industrial y el impacto ambiental”. Sin embargo, a pesar de estos avances, algunas áreas densamente pobladas o cerca de 
                    zonas industriales siguen siendo altamente vulnerables a los impactos ambientales. Esta vulnerabilidad puede ser causada tanto 
                    por la actividad manufacturera y sus externalidades, como por la pura vulnerabilidad climática, que expone a las comunidades 
                    a riesgos como la contaminación y los eventos climáticos extremos.
                    </p>
                    <p>El desarrollo de herramientas que sirvan para diagnosticar zonas de alta vulnerabilidad frente a estos impactos mencionados se convierte 
                    prioritario para poder mitigar o reparar daños a la salud pública o al medio ambiente e incluso mejorar la planeación urbana frente a 
                    nuevos proyectos de infraestructura de cualquier índole.
                    </p>
                    <p>
                    Este ejercicio nos da información para restablecer procesos de equidad y participación ciudadana y al mismo tiempo, 
                    da lugar a que actores del sector privado y del gobierno de incluir planes de inversión social y de protección ambiental 
                    en sus procesos productivos y planes de desarrollo local correspondientemente. 
                    </p>
                    </div>
                </p>
        </div>
    );
};