import './Accordion.scss';
import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { COLORS } from "../../../utils/constants";
import ContactIcon from "/assets/Icono CONTACTO.png";
import MoreIcon from "/assets/Icono MAS_EQUIPO.png";
import Card from "../Card/Card";
import {accordionItems} from './AccordionItems';

type AccordionItemType = {
  id: string;                      // Unique identifier
  title: string;                   // Header title shown on the accordion
  content: JSX.Element | string;  // Content shown when item is expanded
  images: string[];               // Optional images displayed in the panel
  icon?: JSX.Element;             // Optional icon next to title
};

const speedDialButtons = [
  {
    icon: ContactIcon,
    label: "contacto",
  },
  {
    icon: MoreIcon,
    label: "equipo",
  }
]

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

        {/* Speed Dial */}
        <div className="speed-dial">
          {speedDialButtons.map((button, index) => (
            <div className="speed-dial__item" key={index}>
              <button type="button" onClick={() => window.location.href = "/visor"}>
                <span className={`button-text${selectedItem ? " hidden" : ""}`}>{button.label}</span>
                <span className="icon">
                  <img src={button.icon} alt={`${button.label} icon`} />
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* Botones Izquierda */}
        <div className="buttonColumn">
            {accordionItems.map((item, index) => (
                <Button 
                  className={`buttonColumn__button${selectedItem?.id === item.id ? " buttonColumn__button--selected" : ""}`}
                  key={index} 
                  bg={COLORS.GLOBAL.fondo} 
                  onClick={() => handleItemClick(item)}
                >
                  <p>{item.title}</p>
                  <img src={item.icon} className="buttonColumn__icon" style={{ background: `${COLORS.GLOBAL.fondo}`}} />
                </Button>
            ))}
        </div>

          {/* Info box derecha */}
          <div className="cardContainer">
            {selectedItem && (
              <Card content={selectedItem.content} setSelectedItem={setSelectedItem} />
            )}
          </div>

        </div>
    );
}

export default Accordion;