import { Box, Button } from "@chakra-ui/react";
import HojaIcono from "/assets/Icono HOJA.png";
import LupaIcono from "/assets/Icono LUPA.png";
import RompecabezasIcono from "/assets/Icono ROMPECABEZAS.png";
import CloseIcon from "/assets/Icono CERRAR.png"
import QuadrantMenu from "../Quadrant-Menu/QuadrantMenu";
import { COLORS } from "../../../utils/constants";
import './Accordion.scss';
import { useState } from "react";
import ContactIcon from "/assets/Icono CONTACTO.png";
import MoreIcon from "/assets/Icono MAS_EQUIPO.png";
import {OverlayScrollbarsComponent} from 'overlayscrollbars-react';
import { ClickScrollPlugin } from "overlayscrollbars";
import 'overlayscrollbars/overlayscrollbars.css';
import Card1_img from '/assets/Indicadores Ambientales.png';

type AccordionItemType = {
  id: string;                      // Unique identifier
  title: string;                   // Header title shown on the accordion
  content: JSX.Element | string;  // Content shown when item is expanded
  images: string[];               // Optional images displayed in the panel
  icon?: JSX.Element;             // Optional icon next to title
};

const items: AccordionItemType[] = [
{
    id: "lupa",
    title: "¿qué es la \nevaluación ambiental?",
    content: (
      <div className="scrollable2-container" style={{height: "100%"}}>
        <OverlayScrollbarsComponent
          options={{ scrollbars: { autoHide: 'never', dragScroll: true, clickScroll: true}, }}
          className="scrollable2"
        >
            <div style={{ gap: "1rem", display: "flex", flexDirection: "column"}}>
              <div>
                <p className="subtitle-card">|objetivo|</p>
                <p className="bodytext-card">
                  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                  when an unknown printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but also the leap into
                  electronic typesetting, remaining essentially unchanged. It was popularised in
                  the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
                  and more recently with desktop publishing software like Aldus PageMaker including
                  versions of Lorem Ipsum.
                </p>
              </div>
              <div>
                <p className="subtitle-card">|indicadores ambientales|</p>
                <p className="bodytext-card">
                  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                  when an unknown printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but also the leap into
                  electronic typesetting, remaining essentially unchanged. It was popularised in
                  the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "row", width: "100%"}}>
                <p className="bodytext-card" style={{ flex: "0 0 60%", maxWidth: "60%", marginRight: "2rem" }}>
                  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                  when an unknown printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but also the leap into
                  electronic typesetting, remaining essentially unchanged. It was popularised in
                  the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.
                </p>
                <div style={{ width: "80%" }}>
                  <img src={Card1_img} alt="Indicadores Ambientales" />
                </div>
              </div>
            </div>
        </OverlayScrollbarsComponent>
</div>
    ),
    images: ["https://via.placeholder.com/150x100"],
    icon: LupaIcono,
  },
  {
    id: "hoja",
    title: "uso de la herramienta",
    content: (
      <div className="scrollable2-container" style={{height: "100%"}}>
        <OverlayScrollbarsComponent
          options={{ scrollbars: { autoHide: 'never', dragScroll: true, clickScroll: true}, }}
          className="scrollable2"
        >
          <div style={{ gap: "1rem", display: "flex", flexDirection: "column"}}>
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
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", flex: "0 0 60%", maxWidth: "60%", gap: "1rem" }}>
              <p className="subtitle-card" style={{ textAlign: "left" }}>
                |visualiza, compara y toma decisiones informadas|
              </p>
              <p className="bodytext-card">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                when an unknown printer took a galley of type and scrambled it to make a type
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                when an unknown printer took a galley of type and scrambled it to make a type
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                when an unknown printer took a galley of type and scrambled it to make a type 
                and more recently with desktop publishing software like Aldus PageMaker including 
                versions of Lorem Ipsum.
              </p>
            </div>
            <div style={{  maxWidth: "40%", display: "flex", flex: "0 0 40%", gap: "2rem", flexDirection: "row", alignItems: "flex-start", position: "relative" }}>
              <div style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "#f4cdd3",
                position: "absolute",
                right: "0",
              }} />
              <div style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "#eeb0ba",
                position: "absolute",
                top: "7rem",
                left: "10%",
              }} />
            </div>

          </div>
        </OverlayScrollbarsComponent>
      </div>
    ),
    images: ["https://via.placeholder.com/150x100"],
    icon: HojaIcono,
  },
  {
    id: "rompecabezas",
    title: "4 ejes temáticos",
    content: (
      <div className="scrollable2-container" style={{height: "100%"}}>
        <OverlayScrollbarsComponent
          options={{ scrollbars: { autoHide: 'never', dragScroll: true, clickScroll: true}, }}
          className="scrollable2"
        >
        <div style={{ gap: "1rem", display: "flex", flexDirection: "column"}}>
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
        </div>
        
      <QuadrantMenu
        mainHeader="temáticas"
        items={[
          {
            title: "ambiental",
            description: "texto ambiental texto ambiental texto ambiental texto ambiental texto ambiental texto ambiental texto ambiental texto ambiental texto ambiental texto ambiental",
            iconUrl: "https://via.placeholder.com/100",
            url: "#",
            mainHeader: ""
          },
          {
            title: "industria",
            description: "texto industria texto industria texto industria texto industria texto industria texto industria texto industria texto industria texto industria",
            iconUrl: "https://via.placeholder.com/100",
            url: "#",
            mainHeader: ""
          },
          {
            title: "equipamiento",
            description: "texto equipamiento texto equipamiento texto equipamiento texto equipamiento texto equipamiento texto equipamiento texto equipamiento texto equipamiento",
            iconUrl: "https://via.placeholder.com/100",
            url: "#",
            mainHeader: ""
          },
          {
            title: "población",
            description: "texto población texto población texto población texto población texto población texto población texto población texto población",
            iconUrl: "https://via.placeholder.com/100",
            url: "#",
            mainHeader: ""
          },
        ]}
      />
      </OverlayScrollbarsComponent>
      </div>
    ),
    images: [],
    icon: RompecabezasIcono,
  },
];

const Accordion = () => {
    const [selectedItem, setSelectedItem] = useState<AccordionItemType | null>(null);

    const handleItemClick = (item: AccordionItemType) => {
        if (selectedItem && selectedItem.id === item.id) {
            setSelectedItem(null);
        } else {
            setSelectedItem(item);
        }
    };

    return (
      <div className="body">

        <div className="speed-dial">
          <div className="speed-dial__item">
            <button type="button" aria-label="Ir al visor" onClick={() => window.location.href = "/visor"}>
                <span className={`button-text${selectedItem ? " hidden" : ""}`}>contacto</span>
                <span className="icon">
                    <img src={ContactIcon} alt="Contact Icon"  />
                </span>
            </button>
          </div>
          <div className="speed-dial__item">
            <button type="button" aria-label="Ir al visor" onClick={() => window.location.href = "/visor"}>
                <span className={`button-text${selectedItem ? " hidden" : ""}`}>equipo</span>
                <span className="icon">
                    <img src={MoreIcon} alt="More Icon"  />
                </span>
            </button>
          </div>
        </div>

          {/* Botones Izquierda */}
          <div className="body__buttonColumn" >
              {items.map((item, index) => (
                  <Button 
                    //className="body__button"
                    className={`body__button${selectedItem?.id === item.id ? " body__button--selected" : ""}`}
                    key={index} 
                    bg={COLORS.GLOBAL.fondo} 
                    //border={`1px solid ${COLORS.GLOBAL.backgroundMedium}`}
                    //border={selectedItem?.id === item.id ? "3px solid black": `1px solid ${COLORS.GLOBAL.backgroundMedium}`} 
                    onClick={() => handleItemClick(item)}
                  >
                    <p className="body__buttonText">{item.title}</p>
                    <img src={item.icon} className="body__buttonIcon" style={{ background: `${COLORS.GLOBAL.fondo}`}} />
                  </Button>
              ))}
          </div>

          {/* Info box derecha */}
          <div className="body__derecha">
            { selectedItem && (
            <Box className="body__box" bg={COLORS.GLOBAL.fondo} boxShadow={`6px 6px 2px ${COLORS.GLOBAL.backgroundMedium}`} >
              {/*<div className="scrollable" style={{ height: "100%", width: "100%", padding: "2rem 1.5rem 1rem 1.5rem", border: "1px solid black" }}>*/}
                {selectedItem.content}
              {/*</div>*/}
              <Button type="button" className="body__closeButton" onClick={() => setSelectedItem(null)} variant="ghost" p={0} minW={0} height="auto">
                <img src={CloseIcon} alt="Cerrar" className="body__closeIcon" />
              </Button>
            </Box>
            )}
          </div>

        </div>
    );
}

export default Accordion;