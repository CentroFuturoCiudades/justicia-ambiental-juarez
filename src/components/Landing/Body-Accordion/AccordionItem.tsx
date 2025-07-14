import { useState, useRef, useEffect, type JSX } from "react";

type AccordionItemProps = {
  id: string;                     // Unique identifier for this accordion item
  title: string;                  // Title text shown on the accordion header button
  content: JSX.Element | string;  // Content to display when expanded (text or JSX)
  images: string[];               // Optional array of image URLs to show inside panel
  isOpen: boolean;                // Whether the accordion item is currently open or closed
  toggle: (id: string) => void;   // Function to toggle open/closed state when header clicked
  icon?: JSX.Element;             // Optional icon shown next to the title in the header
};

export default function AccordionItem({
  id,
  title,
  content,
  images,
  isOpen,
  toggle,
  icon,
}: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);  // Reference to the content container div
  const [height, setHeight] = useState("0px");      // Inline height style for animation

  // When `isOpen` changes, update the height to either the scrollHeight (open) or 0 (closed)
  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [isOpen]);

  return (
    // Root container with class based on open/closed state for styling
    <div className={`accordion-item ${isOpen ? "open" : "closed"}`}>
      {/* Header button that toggles the panel */}
      <button
        onClick={() => toggle(id)}          // Call toggle function with this item's id
        className="accordion-button"
        aria-expanded={isOpen}              // Accessibility: indicates expanded/collapsed state
        aria-controls={`panel-${id}`}       // Links to the controlled content panel
        id={`accordion-${id}`}              // ID used for aria-labelledby on panel
      >
        {title}                            {/* Display the accordion title */}
        {icon && (
          <span
            className={`accordion-icon ${isOpen ? "open" : ""}`} // Optional icon styling
            aria-hidden="true"           // Icon is decorative, so hide from screen readers
          >
            {icon}
          </span>
        )}
      </button>

      {/* The collapsible panel */}
      <div
        id={`panel-${id}`}                // Panel id matches aria-controls on button
        role="region"                    // Landmark role for accessibility
        aria-labelledby={`accordion-${id}`} // Links back to header button label
        className="accordion-panel"
        ref={contentRef}                 // Reference for measuring height
        style={{ height }}               // Inline height for smooth expand/collapse animation
      >
        <div className="accordion-content">
          {/* Content can be JSX or simple text */}
          <div className="accordion-text">{content}</div>

          {/* Render images if provided */}
          {images.length > 0 && (
            <div className="accordion-images">
              {images.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Imagen ${idx + 1} de ${title}`} // Descriptive alt text
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
