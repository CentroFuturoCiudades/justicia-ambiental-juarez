import React from "react";
import ReactDOM from "react-dom";

const InfoTooltip = ( cardRect : any ) => {
  return ReactDOM.createPortal(
    <div
      style={{
      position: "fixed",
      top: cardRect.top,
      left: cardRect.right + (window.innerWidth * 0.04),
      width: cardRect.width,
      minHeight: cardRect.height,
      background:  "rgb(254,253,252,0.8)",
      borderRadius: "0.3vw",
      pointerEvents: "auto",
      padding: "1.5vw",
      border: "1.5px solid var(--background-medium)",
      fontSize: "var(--font-size-subtitle)",
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 300,
      fontStyle: "italic",
      }}
    >
        <p>Las Islas de Calor... Estas se calculan a partir de ...
            A mayor XX, mayor XXX
        </p>
    </div>,
    document.body
  );
};

export default InfoTooltip;