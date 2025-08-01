import React, { useState } from "react";
import "./QuadrantMenu.scss";

// Interface for menu grid items and center header
interface QuadrantMenuItem {
    mainHeader: string;
    title: string;
    description: string;
    iconUrl: string;
    url: string;
}

//interface for simplifiying props of the component
interface QuadrantMenuProps {
    items: QuadrantMenuItem[];
    mainHeader: string;
}

export default function QuadrantMenu({ items, mainHeader }: QuadrantMenuProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [activeItem, setActiveItem] = useState<QuadrantMenuItem | null>(null);

    const toggleIndex = (item: QuadrantMenuItem, index: number) => {
        if(activeItem && activeItem.title === item.title) {
            setActiveItem(null);
            setActiveIndex(null);
        } else {
            setActiveItem(item);
            setActiveIndex(index);
        }
    }
        //setActiveIndex(prev => (prev === index ? null : index));

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
            <section className="quadrant-menu" style={{ border: "3px solid black"}}>
                <header className="quadrant-menu__header">
                    <h2>{mainHeader}</h2>
                </header>

                <div className="quadrant-menu__grid">
                    {items.map((item, index) => (
                        <div
                            className={`quadrant-menu__grid-item quadrant-menu__item-${index}`}
                            key={index}
                        >
                            <button
                                onClick={() => toggleIndex(item, index)}
                                className="quadrant-menu__item"
                                aria-expanded={activeIndex === index}
                            >
                                {item.title}
                            </button>

                        </div>
                    ))}
                </div>
            </section>
            {activeItem && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", border: "3px solid black"}}>
                    <p className={`quadrant-title--${activeIndex}`} style={{ fontWeight: 'bold', fontSize: "20px" }}>{activeItem.title}</p>
                    <p>
                        {activeItem.description}
                    </p>
                </div>
            )}
        </div>

    );
}
