import { Box, Button } from "@chakra-ui/react";
import HojaIcono from "../../../../public/assets/Icono HOJA.png";
import LupaIcono from "../../../../public/assets/Icono LUPA.png";
import RompecabezasIcono from "../../../../public/assets/Icono ROMPECABEZAS.png";
import CloseIcon from "../../../../public/assets/Icono CERRAR.png"
import QuadrantMenu from "../Quadrant-Menu/QuadrantMenu";
import { COLORS } from "../../../utils/constants";
import './AC.scss';
import { useState } from "react";
import VisorIcon from "../../../../public/assets/Icono MAPA IR AL VISOR.png";
import ContactIcon from "../../../../public/assets/Icono CONTACTO.png";
import MoreIcon from "../../../../public/assets/Icono MAS_EQUIPO.png";

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
    title: "¿qué es la evaluación ambiental?",
    content: (
      <div  style={{ height: "100%", display: "flex", flexDirection: "column" , overflowY: "auto", padding: "1rem 0rem"}} >
        <div className="scrollable" style={{ overflowY: "auto", paddingRight: "1rem", gap: "2rem", display: "flex", flexDirection: "column"}}>
          <div style={{ gap: "1rem", display: "flex", flexDirection: "column"}}>
            <p style={{ fontWeight: "bold", textAlign: "left" , fontSize: "20px"}}>|objetivo|</p>
            <p>
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
          <div style={{ gap: "1rem", display: "flex", flexDirection: "column"}}>
            
            <p style={{ fontWeight: "bold", textAlign: "left" , fontSize: "20px"}}>|justicia ambiental|</p>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
              when an unknown printer took a galley of type and scrambled it to make a type 
              specimen book. It has survived not only five centuries, but also the leap into 
              electronic typesetting, remaining essentially unchanged. It was popularised in 
              the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, 
              and more recently with desktop publishing software like Aldus PageMaker including 
              versions of Lorem Ipsum.
            </p>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: "1rem", width: "100%" }}>
              <p style={{ width: "50%"}}>
                sjsjjsjsjsjsjsjjsjsjssssssssssssssssssssssssssssssssss
                sjsjjsjsjsjsjsjjsjsjsssssssssssssssssssssssssssssssssss
                sjsjjsjsjsjsjsjjsjsjsssssssssssssssssssssssssssssssssss
                sjsjjsjsjsjsjsjjsjsjsssssssssssssssssssssssssssssssssss
                sjsjjsjsjsjsjsjjsjsjsssssssssssssssssssssssssssssssssss
              </p>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmVq-OmHL5H_5P8b1k306pFddOe3049-il2A&s" alt="Descripción de la imagen"></img>
            </div>
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
      <div style={{ height: "100%", display: "flex", flexDirection: "column" , overflowY: "auto", padding: "1rem 0rem"}}>
          <div className="scrollable" style={{ overflowY: "auto", paddingRight: "1rem", gap: "2rem", display: "flex", flexDirection: "column"}}>

        <p style={{ fontWeight: "bold", textAlign: "left" , fontSize: "20px"}}>|metodología|</p>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
          when an unknown printer took a galley of type and scrambled it to make a type 
          specimen book. It has survived not only five centuries, but also the leap into 
          electronic typesetting, remaining essentially unchanged. It was popularised in 
          the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, 
          and more recently with desktop publishing software like Aldus PageMaker including 
          versions of Lorem Ipsum.
        </p>

        <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between",  gap: "1rem", alignItems: "flex-start"}}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "1rem",  }}>
            <p style={{ fontWeight: "bold", textAlign: "left" , fontSize: "20px"}}>|visualiza, compara y toma decisiones informadas|</p>
            <p>
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
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmVq-OmHL5H_5P8b1k306pFddOe3049-il2A&s" style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }}></img>

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
      <div style={{ height: "100%", display: "flex", flexDirection: "column" , overflowY: "auto", padding: "1rem 0rem"}}>
        <div className="scrollable" style={{ overflowY: "auto", paddingRight: "1rem", gap: "2rem", display: "flex", flexDirection: "column"}}>

        <p style={{ fontWeight: "bold", textAlign: "left" , fontSize: "20px"}}>|datos|</p>
        <p>
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
      </div>
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
            setSelectedItem(null); // Close the item if it's already open
        } else {
            setSelectedItem(item);
        }
    };

    return (
      <div className="body">

        {/* botones flotantes */}
        <div className="speed-dial">
          <div className="speed-dial__item">
              <button type="button" aria-label="Ir al visor" onClick={() => window.location.href = "/visor"}>
                  <span className="icon">
                      <img src={VisorIcon} alt="Visor Icon" style={{ height: '50px' }} />
                  </span>
              </button>
          </div>
          <div className="speed-dial__item">
              <button type="button" aria-label="Ir al visor" onClick={() => window.location.href = "/visor"}>
                  { !selectedItem && <span className="button-text">contacto</span> }
                  <span className="icon">
                      <img src={ContactIcon} alt="Contact Icon" style={{ height: '50px' }} />
                  </span>
              </button>
          </div>
          <div className="speed-dial__item">
              <button type="button" aria-label="Ir al visor" onClick={() => window.location.href = "/visor"}>
                  { !selectedItem && <span className="button-text">equipo</span> }
                  <span className="icon">
                      <img src={MoreIcon} alt="More Icon" style={{ height: '50px' }} />
                  </span>
              </button>
          </div>
        </div>

        <div className="body__content">

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
          <Box className="body__box" bg={COLORS.GLOBAL.fondo} border={`1px solid ${COLORS.GLOBAL.backgroundMedium}`} boxShadow={`6px 6px 2px ${COLORS.GLOBAL.backgroundMedium}`} >
            <div className="scrollable" style={{ height: "100%", width: "100%", padding: "2rem 1.5rem 1rem 1.5rem" }}>
              {selectedItem.content}
            </div>
            <button type="button" className="body__closeButton" onClick={() => setSelectedItem(null)} >
              <img src={CloseIcon} alt="Cerrar" style={{ height: "40px",  }} />
            </button>
          </Box>
          )}
        </div>
        </div>
      </div>
    );
}

export default Accordion;