import './Card.scss'
import { COLORS } from "../../../utils/constants";
import { Box, Button } from '@chakra-ui/react';
import {OverlayScrollbarsComponent} from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';
import CloseIcon from "/assets/Icono CERRAR.png"
import type { JSX } from 'react';

type CardProps = {
    content: JSX.Element | string;
    setSelectedItem: (item: any) => void;
    downloadButton?: JSX.Element;
};

const Card = ({ content, setSelectedItem, downloadButton } : CardProps) => {
    return (
        <div style={{width: "100%", height: "100%"}}>
            <Box className='card' bg={COLORS.GLOBAL.fondo} >
                <OverlayScrollbarsComponent
                    options={{ scrollbars: { autoHide: 'never', dragScroll: true, clickScroll: true}, }}
                    className="scroll-content"
                >
                    {content}
                </OverlayScrollbarsComponent>
                <Button type="button" className="closeButton" onClick={() => setSelectedItem(null)} variant="ghost" p={0} minW={0} height="auto">
                    <img src={CloseIcon} alt="Cerrar" className="closeIcon" />
                </Button>
                {downloadButton &&
                 <div className="downloadButtonContainer">
                     {downloadButton}
                 </div>
                }
            </Box>
        </div>
    );
};

export default Card;
