import React, { useState } from "react";
import "./QuadrantMenu.scss";
import type { JSX } from 'react';

// Interface for menu grid items and center header
interface QuadrantMenuItem {
    mainHeader: string;
    title: string;
    description: JSX.Element | string;
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
        <div style={{ display: "flex", flexDirection: "column", gap: "2dvh"}}>
            <section className="quadrant-menu" >
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
                                //className="quadrant-menu__item"
                                className={`quadrant-menu__item${activeIndex === index ? " quadrant-menu__item--selected" : ""}`}
                                aria-expanded={activeIndex === index}
                            >
                                <p className="quadrant-menu__item-title">{item.title}</p>
                            </button>

                        </div>
                    ))}
                </div>
            </section>
            {activeItem && (
                <div style={{ display: "flex", flexDirection: "column", gap: "2dvh"}}>
                    <p className={`quadrant-title quadrant-title--${activeIndex}`} >|{activeItem.title}|</p>
                    <div className="quadrant-description">
                        {activeItem.description}
                    </div>
                </div>
            )}
        </div>

    );
}
