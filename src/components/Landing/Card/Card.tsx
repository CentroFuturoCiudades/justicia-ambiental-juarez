import './Card.scss'
import { COLORS } from "../../../utils/constants";
import { Box } from '@chakra-ui/react';
import {OverlayScrollbarsComponent} from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';
import CloseIcon from "/assets/Icono CERRAR.png"
import Close from "/assets/Cerrar.png"
import type { JSX } from 'react';

type CardProps = {
    content: JSX.Element | string;
    setSelectedItem?: (item: any) => void;
    downloadButton?: JSX.Element;
    setMobileVisibleElement?: any;
};

const Card = ({ content, setSelectedItem, downloadButton, setMobileVisibleElement } : CardProps) => {
    return (
        <div style={{width: "100%", height: "100%"}}>
            <Box className='card' bg={COLORS.GLOBAL.fondo} >
                <OverlayScrollbarsComponent
                    options={{ scrollbars: { autoHide: 'never', dragScroll: true, clickScroll: true}, }}
                    className="scroll-content"
                >
                    {content}
                </OverlayScrollbarsComponent>
                { setSelectedItem &&
                    <button className="closeButton" onClick={() => {
                        if (setMobileVisibleElement) setMobileVisibleElement('')
                        setSelectedItem(null)
                    }} >
                        <img src={Close} alt="Cerrar"/>
                    </button>
                }
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
