import './Body.scss';
import { useState } from "react";
import { Button } from "@chakra-ui/react";
import ContactIcon from "/assets/Icono CONTACTO.png";
import MoreIcon from "/assets/Icono MAS_EQUIPO.png";
import Card from "../Card/Card";
import {accordionItems} from './AccordionItems';
import { aboutContent } from './AccordionItems';
import type { AccordionItemType } from './AccordionItems';
import { useMediaQuery } from '@chakra-ui/react';
import { link } from 'd3';

const speedDialButtons = [
  {
    icon: ContactIcon,
    label: "contacto",
    link: "/visor"
  },
  {
    icon: MoreIcon,
    label: "equipo",
    link: "/equipo"
  }
]

const Body = () => {
  const [isMobile] = useMediaQuery('(max-width: 800px)')

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

        {/* Speed Dial */}
        <div className="speed-dial">
          {speedDialButtons.map((button, index) => (
            <div className="speed-dial__item" key={index}>
              <button type="button" onClick={() => window.location.href = button.link}>
                <span className={`button-text${selectedItem ? " hidden" : ""}`}>{button.label}</span>
                <span className="icon">
                  <img src={button.icon} alt={`${button.label} icon`} />
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* Botones Izquierda */}
        <div className={`buttonColumn${isMobile && selectedItem ? " buttonColumn--single" : ""}`}>
          {isMobile && selectedItem ? 
            (
              <Button 
                className="buttonColumn__button buttonColumn__button--selected"
                onClick={() => setSelectedItem(null)}
              >
                <p>{selectedItem.title}</p>
                <span className="buttonColumn__icon">
                  <img src={selectedItem.icon} />
                </span>
              </Button>
            ) : (
              accordionItems.map((item, index) => (
                <Button 
                  className={`buttonColumn__button${selectedItem?.id === item.id ? " buttonColumn__button--selected" : ""}`}
                  key={index} 
                  onClick={() => handleItemClick(item)}
                >
                  <p>{item.title}</p>
                  <span className="buttonColumn__icon">
                    <img src={item.icon} />
                  </span>
                </Button>
              ))
            )
          }
        </div>

      {/* Info box derecha */}
      {selectedItem ? (
        <div className="cardContainer">
          <Card content={selectedItem.content} setSelectedItem={setSelectedItem} />
        </div>
      ):(
        !isMobile && (
          <div className="cardContainer">
            <Card content={aboutContent()} />
          </div>
        )
      )}
    </div>
  );
}

export default Body;