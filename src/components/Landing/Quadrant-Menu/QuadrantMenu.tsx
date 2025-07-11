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

    const toggleIndex = (index: number) =>
        setActiveIndex(prev => (prev === index ? null : index));

    return (
        <section className="quadrant-menu">
            <header className="quadrant-menu__header">
                <h2>{mainHeader}</h2>
            </header>

            <div className="quadrant-menu__grid">
                {items.map(({ title, description, iconUrl, url }, index) => (
                    <article
                        className={`quadrant-menu__grid-item quadrant-menu__item-${index}`}
                        key={index}
                    >
                        <button
                            onClick={() => toggleIndex(index)}
                            className="quadrant-menu__item"
                            aria-expanded={activeIndex === index}
                        >
                            {title}
                        </button>

                        {activeIndex === index && (
                            <div className="quadrant-menu__item-details">
                                <h3 className={`quadrant-menu__item-title quadrant-title--${index}`}>
                                    {title}
                                </h3>

                                <p className="quadrant-menu__item-description">{description}</p>
                                <img
                                    src={iconUrl}
                                    alt={title ? `${title} icon` : "Icon"}
                                    className="quadrant-menu__item-icon"
                                />
                                <a
                                    href={url}
                                    target="_blank"
                                    className="quadrant-menu__item-link"
                                >
                                    <br />
                                    Learn more
                                </a>
                            </div>
                        )}
                    </article>
                ))}
            </div>
        </section>
    );
}
