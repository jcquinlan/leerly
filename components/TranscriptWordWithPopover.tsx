import React, {useState, useRef, useContext} from 'react';
import styled from 'styled-components';
import {Popover} from 'react-tiny-popover';
import {TranscriptWord, PopoverBody} from './styled/index';
import UIStateContext from '../contexts/uiStateContext';
import useTranslationPopoverLogic from 'hooks/useTranslationPopoverLogic';

const POPOVER_DELAY = 800;

const TranscriptWordWithPopover = ({text, children, ...props}) => {
    const {isSelectingText} = useContext(UIStateContext)
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const getArticleBody = () => '';
    const {popoverBody, popoverText, resetPopoverState, translateText} = useTranslationPopoverLogic(getArticleBody);
    const popoverTimer = useRef(null);

    const handleHover = () => {
        if (isSelectingText) return;

        const newPopoverTimer = setTimeout(() => {
            translateText(text);
            setIsOpen(true);
        }, POPOVER_DELAY);
        popoverTimer.current = newPopoverTimer;
    }

    const handleHoverEnd = () => {
        setIsOpen(false);
        if (popoverTimer.current) {
            clearTimeout(popoverTimer.current);
            popoverTimer.current = null;
        }
    }

    const renderPopoverContent = () => {
        return (
            <PopoverBody>
                {popoverText}
                {popoverBody}
            </PopoverBody>
        )
    }

    return (
        <Popover
            isOpen={isOpen}
            content={renderPopoverContent()}
        >
            <TranscriptWord {...props} onMouseEnter={handleHover} onMouseLeave={handleHoverEnd} onTouchStart={handleHover}>
                {children}
            </TranscriptWord>
        </Popover>
    )
}

export default TranscriptWordWithPopover;

const PopoverContainer = styled.div`
    background-color: #fff;
    border-radius: 8px;
    padding: 5px;
`;