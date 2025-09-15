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
        title: "¿qué es la \nevaluación ambiental?",
        content: (
            <div style={{ display: "flex", flexDirection: "column", gap: "2dvh"}}>
                <p className="subtitle-card">|objetivo|</p>
                <p className="bodytext-card">
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                    when an unknown printer took a galley of type and scrambled it to make a type
                    specimen book. It has survived not only five centuries, but also the leap into
                    electronic typesetting, remaining essentially unchanged. It was popularised in
                    the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
                    and more recently with desktop publishing software like Aldus PageMaker including
                    versions of Lorem Ipsum.
                    electronic typesetting, remaining essentially unchanged. It was popularised in
                    the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
                    and more recently with desktop publishing software like Aldus PageMaker including
                    versions of Lorem Ipsum.
                </p>

                <p className="subtitle-card">|indicadores ambientales|</p>
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
                </p>

                <div style={{ display: "flex", flexDirection: "row", gap: "2dvw" }}>
                    <p className="bodytext-card" style={{ flex: "1" }}>
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                        when an unknown printer took a galley of type and scrambled it to make a type
                        specimen book. It has survived not only five centuries, but also the leap into
                        electronic typesetting, remaining essentially unchanged. It was popularised in
                        the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
                        and more recently with desktop publishing software like Aldus PageMaker including
                        versions of Lorem Ipsum.
                        electronic typesetting, remaining essentially unchanged. It was popularised in
                        the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
                        and more recently with desktop publishing software like Aldus PageMaker including
                        versions of Lorem Ipsum.
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
                <p className="bodytext-card">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                    when an unknown printer took a galley of type and scrambled it to make a type 
                    specimen book. It has survived not only five centuries, but also the leap into 
                    electronic typesetting, remaining essentially unchanged. It was popularised in 
                </p>
        
                <QuadrantMenu
                    mainHeader="temáticas"
                    items={[
                    {
                        title: "ambiental",
                        description: (
                            <div style={{ display: "flex", flexDirection: "column", gap: "2dvh" }}>
                                <p>
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
                                <div style={{ display: "flex", flexDirection: "row", gap: "2dvw" }}>
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
                                </div>
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
                                <div style={{ display: "flex", flexDirection: "row", gap: "2dvw" }}>
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
                                </div>
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
                                <div style={{ display: "flex", flexDirection: "row", gap: "2dvw" }}>
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
                                </div>
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
                                <div style={{ display: "flex", flexDirection: "row", gap: "2dvw" }}>
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
                                </div>
                            </div>
                        ),
                        iconUrl: "https://via.placeholder.com/100",
                        url: "#",
                        mainHeader: ""
                    },
                    ]}
                />
            </div>
        ),
        images: [],
        icon: RompecabezasIcono,
    }
]

/*export const aboutContent = (
    <div style={{ display: "flex", flexDirection: "column", gap: "2dvw" }}>

    </div>*/