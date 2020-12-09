import {useState} from 'react';
import styled from 'styled-components';
import {useDebouncedCallback} from 'use-debounce';
import dynamic from 'next/dynamic';

import {translateText} from '../services/translationService';

const Popover = dynamic(
    () => import('react-text-selection-popover'),
    {
        ssr: false
    }
);

const getTextSelection = () => {
    if (!!window) {
        const selectionInstance = window.getSelection();
        return selectionInstance.toString();
    }
}

const SelectedTextPopover = ({elementRef}) => {
    const [isSelecting, setIsSelecting] = useState(true);
    const [translatedText, setTranslatedText] = useState('');
    const debouncedHandleTextSelect = useDebouncedCallback(async () => {
        setIsSelecting(false);
        const textToTranslate = getTextSelection();

        if (textToTranslate) {
            const translatedText = await translateText(textToTranslate);
            setTranslatedText(translatedText.translation);
        }
    }, 1000);

    const resetPopoverState = () => {
        setIsSelecting(true);
        setTranslatedText('');
    }

    const popoverText = isSelecting || !translatedText ? 'highlight text to translate' : translatedText;

    return (
        <Popover
            selectionRef={elementRef}
            onTextSelect={debouncedHandleTextSelect.callback}
            onTextUnselect={resetPopoverState}>
            <PopoverBody>
                {popoverText}
            </PopoverBody>
        </Popover>
    );
}

export default SelectedTextPopover;

const PopoverBody = styled.div`
    margin: 10px 0;
    padding: 15px;
    background-color: #fff;
    border-radius: 8px;
    border: 1 px solid #eee;
    box-shadow: 0px 10px 25px 0px rgba(0,0,0,0.34);

    color: #666;
`;