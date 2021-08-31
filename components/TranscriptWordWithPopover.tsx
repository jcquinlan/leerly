import React, {useState, useRef, useContext} from 'react';
import styled from 'styled-components';
import {Popover} from 'react-tiny-popover';
import {TranscriptWord, PopoverBody} from './styled/index';
import UIStateContext from '../contexts/uiStateContext';
import useOnClickAway from 'hooks/useOnClickAway';
import HoverTranslationPopover from './HoverTranslationPopover';

const POPOVER_DELAY = 800;

const TranscriptWordWithPopover = ({text, getArticleBody, children, ...props}) => {
    const {
        isSelectingText,
        hoverVocabPopoverOpen,
        setHoverVocabPopoverOpen
    } = useContext(UIStateContext)
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const popoverTimer = useRef(null);
    const popoverRef = useRef(null);

    useOnClickAway(popoverRef, () => {
        setIsOpen(false);
        setHoverVocabPopoverOpen(false);
        if (popoverTimer.current) {
            clearTimeout(popoverTimer.current);
            popoverTimer.current = null;
        }
    })

    const handleHover = () => {
        if (isSelectingText || hoverVocabPopoverOpen) return;

        const newPopoverTimer = setTimeout(() => {
            setHoverVocabPopoverOpen(true);
            setIsOpen(true);
        }, POPOVER_DELAY);

        popoverTimer.current = newPopoverTimer;
    }

    const handleMouseLeave = () => {
        if (!hoverVocabPopoverOpen && popoverTimer.current) {
            clearTimeout(popoverTimer.current);
            popoverTimer.current = null;
        }
    }

    const renderPopoverContent = () => {
        return (
            <PopoverBody ref={popoverRef}>
                <HoverTranslationPopover text={text} getArticleBody={getArticleBody} />
            </PopoverBody>
        )
    }

    return (
        <Popover
            isOpen={isOpen}
            content={renderPopoverContent()}
            containerStyle={{zIndex: '99'}}
        >
            <TranscriptWord {...props} onMouseEnter={handleHover} onMouseLeave={handleMouseLeave}>
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