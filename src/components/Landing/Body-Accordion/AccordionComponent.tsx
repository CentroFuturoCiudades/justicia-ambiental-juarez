import { useState, type JSX } from "react";
import AccordionItem from "./AccordionItem";  // Import the individual accordion item component
import './AccordionComponent.scss';            // Styles for accordion wrapper and components
import QuadrantMenu from "../Quadrant-Menu/QuadrantMenu"; // Example complex component to render inside content
import { FaSearch } from "react-icons/fa";

// SVG icon used for accordion items (a search/magnifying glass icon)
const searchIcon = <FaSearch></FaSearch>

// Type definition for each accordion item.
// `content` can be either plain string or JSX.Element (React component, element, or fragment).
type AccordionItemType = {
  id: string;                   // Unique id used for keys and accessibility attributes
  title: string;                // Header title shown on the accordion button
  content: JSX.Element | string;// The content shown inside the accordion panel when expanded
  images: string[];             // Optional array of image URLs displayed inside the panel
  icon?: JSX.Element;           // Optional icon shown next to the title in the header button
};

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
