// AccordionComponent.tsx

import { useState, type JSX } from "react";
import './AccordionComponent.scss';                              // Styles for accordion layout
import AccordionItem from "./AccordionItem";                     // Individual accordion item
import QuadrantMenu from "../Quadrant-Menu/QuadrantMenu";        // Example custom component
// Icon used for the accordion items
const searchIcon = <img src="/assets/Icono LUPA.png" alt="icono lupa" style={{ width: '100%', height: '40px' }} />;
const leafIcon = <img src="/assets/Icono HOJA.png" alt="icono hoja" style={{ width: '100%', height: '40px' }} />;
const puzzleIcon = <img src="/assets/Icono ROMPECABEZAS.png" alt="icono rompecabezas" style={{ width: '100%', height: '36px' }} />;

// Type definition for accordion items
type AccordionItemType = {
  id: string;                      // Unique identifier
  title: string;                   // Header title shown on the accordion
  content: JSX.Element | string;  // Content shown when item is expanded
  images: string[];               // Optional images displayed in the panel
  icon?: JSX.Element;             // Optional icon next to title
};

// Predefined accordion item data
const items: AccordionItemType[] = [
  {
    id: "a",
    title: "uso de la herramienta",
    content: "Esto es una descripción básica.",
    images: ["https://via.placeholder.com/150x100"],
    icon: searchIcon,
  },
  {
    id: "b",
    title: "Menú interactivo",
    content: (
      <QuadrantMenu
        mainHeader="Elige un cuadrante"
        items={[
          {
            title: "Item 1",
            description: "Descripción del item 1",
            iconUrl: "https://via.placeholder.com/100",
            url: "#",
            mainHeader: ""
          },
          {
            title: "Item 2",
            description: "Descripción del item 2",
            iconUrl: "https://via.placeholder.com/100",
            url: "#",
            mainHeader: ""
          },
          {
            title: "Item 3",
            description: "Descripción del item 3",
            iconUrl: "https://via.placeholder.com/100",
            url: "#",
            mainHeader: ""
          },
          {
            title: "Item 4",
            description: "Descripción del item 4",
            iconUrl: "https://via.placeholder.com/100",
            url: "#",
            mainHeader: ""
          },
        ]}
      />
    ),
    images: [],
    icon: leafIcon,
  },
  {
    id: "c",
    title: "Más contenido",
    content: (
      <div>
        <p>Contenido más complejo</p>
        <ul>
          <li>Elemento 1</li>
          <li>Elemento 2</li>
        </ul>
      </div>
    ),
    images: ["https://via.placeholder.com/150x100"],
    icon: puzzleIcon,
  },
];

// Props definition for AccordionComponent
type AccordionComponentProps = {
  content?: JSX.Element; // Optional content to render below the accordion
};

/**
 * AccordionComponent renders a list of AccordionItem components.
 * When one item is opened, all other items are hidden from the UI.
 * Clicking the same item again resets the view, showing all items again.
 */
export default function AccordionComponent({ content }: AccordionComponentProps) {
  const [openIds, setOpenIds] = useState<string[]>([]);

  /**
   * Toggles an item by its ID.
   * - If it's already open, it resets to show all items (i.e., closes it).
   * - If it's closed, it becomes the only visible item; all others are hidden.
   */
  const toggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? [] : [id]
    );
  };

  return (
    <div className="accordion-wrapper" style={{border: "1px solid red"}}>
      {/* Render all items if none is selected, otherwise show only the selected item */}
      {openIds.length === 0
        ? items.map(({ id, title, content, images, icon }) => (
            <AccordionItem
              key={id}
              id={id}
              title={title}
              content={content}
              images={images}
              isOpen={false}
              toggle={toggle}
              icon={icon}
            />
          ))
        : items
            .filter((item) => openIds.includes(item.id))
            .map(({ id, title, content, images, icon }) => (
              <AccordionItem
                key={id}
                id={id}
                title={title}
                content={content}
                images={images}
                isOpen={true}
                toggle={toggle}
                icon={icon}
              />
            ))}

      {/* Optional custom content below the accordion */}
      {content && (
        <div className="accordion-custom">
          {content}
        </div>
      )}
    </div>
  );
}
