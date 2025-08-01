import { Box, Button } from "@chakra-ui/react";
import HojaIcono from "../../../assets/Icono HOJA.png";
import LupaIcono from "../../../assets/Icono LUPA.png";
import RompecabezasIcono from "../../../assets/Icono ROMPECABEZAS.png";
import CloseIcon from "../../../assets/Icono CERRAR.png"
import ScrollBar from "../../../assets/SLIDER.png";
import QuadrantMenu from "../Quadrant-Menu/QuadrantMenu";
import { COLORS } from "../../../utils/constants";
import './AC.scss';
import { useState } from "react";

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
      <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "2rem" , overflowY: "auto", border: "1px solid blue"}}>
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
    ),
    images: ["https://via.placeholder.com/150x100"],
    icon: LupaIcono,
  },
  {
    id: "hoja",
    title: "uso de la herramienta",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem", border: "1px solid blue", overflowY: "auto", height: "100%", width: "100%" }}>
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

        <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between",  gap: "1rem", border: "1px solid red", alignItems: "flex-start"}}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "1rem", border: "1px solid red",  }}>
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
    ),
    images: ["https://via.placeholder.com/150x100"],
    icon: HojaIcono,
  },
  {
    id: "rompecabezas",
    title: "4 ejes temáticos",
    content: (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "2rem" , overflowY: "auto", border: "1px solid blue"}}>
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
        <div className="body__content">

        {/* Botones Izquierda */}
        <div className="body__buttonColumn" >
            {items.map((item, index) => (
                <Button 
                  className="body__button"
                  key={index} 
                  bg={COLORS.GLOBAL.fondo} 
                  border={`1px solid ${COLORS.GLOBAL.backgroundMedium}`} 
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
          <Box bg={COLORS.GLOBAL.fondo} height={"100%"} border={`1px solid ${COLORS.GLOBAL.backgroundMedium}`} boxShadow={`6px 6px 2px ${COLORS.GLOBAL.backgroundMedium}`} display="flex" flexDirection="column" position={"relative"}>
            <div style={{ height: "100%", width: "100%", padding: "2rem", border: '1px solid red' }}>
              {selectedItem.content}
            </div>
            <img src={CloseIcon} alt="Cerrar" style={{ height: "40px", position: "absolute", right: "8px", top: "10px" }} />
          </Box>
          )}
        </div>
        </div>
      </div>
    );
}

export default Accordion;