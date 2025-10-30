import { useAppContext } from "../../context/AppContext";
import "./LayerCard.scss";
import { IoInformationCircleSharp } from "react-icons/io5";
import { useEffect, useState, type JSX } from "react";
import { useMediaQuery } from '@chakra-ui/react';
import EChartsReact from "echarts-for-react";

type LayerCardProps = {
    layer: any;
    rangeGraphRef: React.RefObject<HTMLDivElement | null>;
    onInfoHover: React.Dispatch<React.SetStateAction<boolean>>;
    layerCardRef?: React.RefObject<HTMLDivElement | null>;
    infoCardOpen?: boolean;
};


const LayerCard = ({ layer, rangeGraphRef, onInfoHover, layerCardRef, infoCardOpen }: LayerCardProps) => {

    const { 
        selectedAGEBS, 
        selectedColonias, 
        activeLayerKey, 
        mapLayerInstance,
        tematicaData,
        selectedLayer,
        jsonData,
    } = useAppContext();

    const [isMobile] = useMediaQuery('(max-width: 800px)');
    const [graphs, setGraphs] = useState([]); // if there is more than 1 graph

    // ya no usa fetch, usa jsonData del context
    const renderGraphs = () => {
        if (!jsonData || !layer?.graphs) {
            setGraphs([]);
            return;
        };

        // n graphs to render
        const graphComponents = layer.graphs.map((graph) => {

            const option = typeof graph.option === "function"
                ? graph.option(jsonData)
                : graph.option;

          return (
            <div className="graph">
                {graph.title && <div className="graph__title">{graph.title}</div>}
                {graph.description && <div className="graph__description">{graph.description}</div>}
                <EChartsReact  key={`${layer}-${graph.url}`} option={option} style={{ width: "100%", height: "min(30dvh, 17.5dvw)" }} />
                <div className="graph__legend">
                    {graph.legend && Object.entries(graph.legend).map(([key, color]) => (
                        <div key={key} className="graph__legend__item">
                            <span className="graph__legend__color" style={{ backgroundColor: color as string }}></span>
                            {key}
                        </div>
                    ))}
                </div>
            </div>
          );
        });

        setGraphs(graphComponents);
    };

    useEffect(() => {
        renderGraphs();
    }, [jsonData]);


    //if ( !mapLayerInstance || !layer || selectedLayer === layer) return;
    if(!mapLayerInstance || !layer || mapLayerInstance.title !== layer.title) {
        //console.log("LayerCard: mapLayerInstance or layer mismatch", mapLayerInstance?.title, layer?.title);
        console.log('no mapLayerInstance');
        return null;
    }
    if((!tematicaData || !tematicaData.allFeatures || !tematicaData.allFeatures.length) && activeLayerKey) return null;

    const themeKey = layer?.tematica;
    let selected: string[] = [];
    let average = 0;
    if (activeLayerKey) {
        selected = activeLayerKey === "agebs" ? selectedAGEBS : selectedColonias;

        average = mapLayerInstance.getAverage(
            //tematicaData.features,
            tematicaData.allFeatures, 
            selected, 
            layer.juarezTotal ? layer.propertyAbsolute : layer.property, //property a base de la cual quiero el average (si hay juarez total quiero usar la property absoluta)
            activeLayerKey,
            layer.juarezTotal,
            layer.filter
        );
    } else {
        average = mapLayerInstance.positiveAvg;
    }

    //console.log("average", average);
    //console.log("maplayerinstance positiveAvg", mapLayerInstance.positiveAvg);
    const category = layer.getAvgThreshold ? layer.getAvgThreshold(layer.filter ? mapLayerInstance.positiveAvg : average) : null;
    const description = mapLayerInstance.getDescription ? mapLayerInstance.getDescription(
        selected, //agebs/colonias
        activeLayerKey, // key
        average, //average number
        layer.descriptionCategories, //categories object (optional)
        layer.juarezCard, //juarez card JSX
        layer.selectionCard, //selection card JSX
        category, //category string
    ) : layer.juarezCard();

    //if(average === null || isNaN(average)) return null;


    return (
        <div  className={`layerCard layerCard--${themeKey}`} ref={layerCardRef}>
            <div className={`layerCard__header layerCard--${themeKey}`}> 
                <p className="layerCard__header__title">
                    {selected.length === 0 ? layer.title : 
                    `${layer?.title} por ${activeLayerKey === "agebs" ? "AGEBS" : "Colonias"}`}
                </p>
                <span
                    onMouseEnter={() => onInfoHover(!infoCardOpen)}
                    onClick={() => onInfoHover(!infoCardOpen)}

                    style={{ display: "inline-block", cursor: "pointer" }}
                >
                    <IoInformationCircleSharp className="layerCard__header__icon"/>
                </span>
            </div>
            <div key={layer.title} className="layerCard__content">
                <div className="layerCard__body">
                    <p>{description}</p>
                </div>
                <div >
                     { layer.graphs ? 
                        (jsonData ? 
                            <div className="graph-container">{graphs}</div> : null
                        ) 
                        :
                        <div ref={rangeGraphRef} >
                            {mapLayerInstance?.getRangeGraph(selected.length > 0 ? average: 0, selected.length)}
                        </div>
                     }                    
                </div>
                
                {/*<div ref={rangeGraphRef} style={{ overflow: "hidden", padding: " 1dvw 0.5dvw 1.5dvw 0.5dvw" }}>*/}
            </div>
        </div>
    );
}

export default LayerCard;