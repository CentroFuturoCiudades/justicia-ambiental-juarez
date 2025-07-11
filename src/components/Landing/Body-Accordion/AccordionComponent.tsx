import { useState, useRef, useEffect, type JSX } from "react";
import './AccordionComponent.scss';

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
const items = [
  {
    id: "a",
    title: "uso de la herramienta",
    content: "....",
    images: [
      "https://via.placeholder.com/150x100"
    ],
    icon: searchIcon,
  },
  {
    id: "b",
    title: "Segundo ítem",
    content: "Contenido sin imágenes.",
    images: [],
    icon: searchIcon,
  },
  {
    id: "c",
    title: "Tercer ítem",
    content: "...",
    images: ["https://via.placeholder.com/150x100"],
    icon: searchIcon,
  },
];



export default function AccordionComponent() {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((openId) => openId !== id) : [...prev, id]
    );
  };

  return (
    <div className="accordion-wrapper">
      {items.map(({ id, title, content, images }) => (
        <AccordionItem
          key={id}
          id={id}
          title={title}
          content={content}
          images={images}
          isOpen={openIds.includes(id)}
          toggle={toggle}
          icon={searchIcon} 
        />
      ))}
    </div>
  );
}

type AccordionItemProps = {
  id: string;
  title: string;
  content: string;
  images: string[];
  isOpen: boolean;
  toggle: (id: string) => void;
  icon?: JSX.Element;
};


function AccordionItem({ id, title, content, images, isOpen, toggle, icon }: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [isOpen]);

  return (
    <div className={`accordion-item ${isOpen ? "open" : "closed"}`}>
      <button
        onClick={() => toggle(id)}
        className="accordion-button"
        aria-expanded={isOpen}
        aria-controls={`panel-${id}`}
        id={`accordion-${id}`}
      >
        {title}
        {icon && (
          <span className={`accordion-icon ${isOpen ? "open" : ""}`} aria-hidden="true" role="img">
            {icon}
          </span>
        )}
      </button>


      <div
        id={`panel-${id}`}
        role="region"
        aria-labelledby={`accordion-${id}`}
        className="accordion-panel"
        ref={contentRef}
        style={{ height }}
      >
        <div className="accordion-content">
          <div className="accordion-text">{content}</div>
          {images.length > 0 && (
            <div className="accordion-images">
              {images.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Imagen ${idx + 1} de ${title}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
