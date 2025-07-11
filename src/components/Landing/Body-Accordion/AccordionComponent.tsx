import { useState, type JSX } from "react";
import AccordionItem from "./AccordionItem";  // Import the individual accordion item component
import './AccordionComponent.scss';            // Styles for accordion wrapper and components

// SVG icon used for accordion items (a search/magnifying glass icon)
const searchIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 50 50">
    <path d="M 21 3 C 11.62 3 4 10.62 4 20 C 4 29.38 11.62 37 21 37 
             C 24.71 37 28.14 35.8 30.94 33.78 L 44.09 46.91 
             L 46.91 44.09 L 33.91 31.06 C 36.46 28.09 38 24.22 
             38 20 C 38 10.62 30.38 3 21 3 Z M 21 5 
             C 29.3 5 36 11.7 36 20 C 36 28.3 29.3 35 21 35 
             C 12.7 35 6 28.3 6 20 C 6 11.7 12.7 5 21 5 Z" />
  </svg>
);

// Type definition for each accordion item.
// `content` can be either plain string or JSX.Element (React component, element, or fragment).
type AccordionItemType = {
  id: string;                   // Unique id used for keys and accessibility attributes
  title: string;                // Header title shown on the accordion button
  content: JSX.Element | string;// The content shown inside the accordion panel when expanded
  images: string[];             // Optional array of image URLs displayed inside the panel
  icon?: JSX.Element;           // Optional icon shown next to the title in the header button
};

import QuadrantMenu from "../Quadrant-Menu/QuadrantMenu"; // Example complex component to render inside content

// Predefined accordion items data.
// One item includes a custom JSX component (QuadrantMenu) as its content.
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
    images: [],  // No images for this item, as content is custom JSX component
    icon: searchIcon,
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
    icon: searchIcon,
  },
];

// Props type for the AccordionComponent
type AccordionComponentProps = {
  content?: JSX.Element;  // Optional additional JSX content to render inside the accordion wrapper
};

// AccordionComponent renders a list of AccordionItem components
// Manages open/closed state of each item internally using an array of open item ids
export default function AccordionComponent({ content }: AccordionComponentProps) {
  const [openIds, setOpenIds] = useState<string[]>([]);

  // Toggles the open state of the accordion item by id.
  // If the id is already in the open list, it removes it (closing the item).
  // Otherwise, it adds it to open list (opening the item).
  const toggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((openId) => openId !== id) : [...prev, id]
    );
  };

  return (
    <div className="accordion-wrapper">
      {/* Render the predefined accordion items */}
      {items.map(({ id, title, content, images, icon }) => (
        <AccordionItem
          key={id}
          id={id}
          title={title}
          content={content}
          images={images}
          isOpen={openIds.includes(id)}  // Open if this id is in openIds state
          toggle={toggle}                // Pass toggle function down
          icon={icon}
        />
      ))}

      {/* Optional extra JSX content passed as props (e.g. from Landing page) */}
      {content && (
        <div className="accordion-custom">
          {content}
        </div>
      )}
    </div>
  );
}
