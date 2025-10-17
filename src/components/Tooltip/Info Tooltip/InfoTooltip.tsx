import { Portal } from "@chakra-ui/react";
import "./InfoTooltip.scss";
import { useMediaQuery } from '@chakra-ui/react';

type InfoTooltipProps = {
  show: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  layerCardRef: React.RefObject<HTMLDivElement | null>;
  selectedLayerData: any;
};

const InfoTooltip = ( { show, containerRef, layerCardRef, selectedLayerData } : InfoTooltipProps ) => {

  if (!show || !layerCardRef.current) return null;

  const cardRect = layerCardRef.current.getBoundingClientRect();
  const [isMobile] = useMediaQuery('(max-width: 800px)')

  return (
    <>
      <Portal container={containerRef}>
        <div
          className="info-tooltip"
          style={ isMobile ? {
            position: "fixed",
            //top: 50,
            //top: cardRect.top + (window.innerHeight * 0.04),
            //bottom: cardRect.bottom + cardRect.height + (window.innerHeight * 0.04) > window.innerHeight ? (window.innerHeight * 0.04) : cardRect.top + cardRect.height + (window.innerHeight * 0.04),
            width: cardRect.width,
            left: cardRect.left,
            minHeight: cardRect.height,
              top: Math.max(cardRect.top - cardRect.height - window.innerHeight * 0.04, window.innerHeight * 0.04),

          }: {
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
          <p className="source"> Fuente: {selectedLayerData?.source || "XXX"} </p>
          <p className="source"><a href="https://tecmx.sharepoint.com/:x:/r/sites/JusticiaAmbiental/_layouts/15/Doc2.aspx?action=edit&sourcedoc=%7B427c6ade-f673-4dc2-a13e-980acd3f4a3f%7D&wdOrigin=TEAMS-MAGLEV.teamsSdk_ns.rwc&wdExp=TEAMS-TREATMENT&wdhostclicktime=1760626723342&web=1">Codebook</a></p>
        </div>
      </Portal>
      <div ref={containerRef} />
    </>
  )
}

export default InfoTooltip;