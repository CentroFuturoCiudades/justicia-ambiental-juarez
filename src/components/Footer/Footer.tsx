import React from "react";
import "./Footer.scss";

const logos = [
  { src: "/logos/tec-centro.png", alt: "Tecnológico de Monterrey y Centro para el Futuro de las Ciudades" },
  { src: "/logos/banco-desarrollo.png", alt: "Banco de Desarrollo de América del Norte" },
  { src: "/logos/baker.png", alt: "Baker Institute" },
  { src: "/logos/rice.png", alt: "Rice University" },
];

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__logos">
        {logos.map((logo, index) => (
          <img
            key={index}
            src={logo.src}
            alt={logo.alt}
            className="footer__logo"
          />
        ))}
      </div>
    </footer>
  );
};

export default Footer;
