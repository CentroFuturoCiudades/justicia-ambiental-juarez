import { Portal } from "@chakra-ui/react";
import "./InfoTooltip.scss";

const InfoTooltip = ( { show, containerRef, layerCardRef, selectedLayerData } : any ) => {

  if (!show || !layerCardRef.current) return null;  
  const cardRect = layerCardRef.current.getBoundingClientRect();

  return (
    <>
      <Portal container={containerRef}>
        <div
          className="info-tooltip"
          style={{
            position: "fixed",
            top: cardRect.top,
            left: cardRect.right + (window.innerWidth * 0.04),
            width: cardRect.width,
            minHeight: cardRect.height,
          }}
        >
          <p style={{ flex: 1 }}>
            {selectedLayerData?.description || "Información no disponible para esta capa."}
          </p>
          <p className="source"> Fuente: XXX </p>
        </div>
      </Portal>
      <div ref={containerRef} />
    </>
  )
}

export default InfoTooltip;