import {useState, useContext} from 'react';
import styled from 'styled-components';
import {useToasts} from 'react-toast-notifications';
import {useDebouncedCallback} from 'use-debounce';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import placeRightBelow from 'react-text-selection-popover/lib/placeRightBelow'

import {createNewVocab} from '../services/vocabService';
import {translateText} from '../services/translationService';
import AppContext from '../contexts/appContext';
import { Colors } from './styled';

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

export const SimplifiedSelectedTextPopover = ({elementRef}) => {
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
            placementStrategy={placeRightBelow}
            selectionRef={elementRef}
            onTextSelect={debouncedHandleTextSelect.callback}
            onTextUnselect={resetPopoverState}>
            <PopoverBody>
                <span>{popoverText}</span>
                {translatedText && <br />}

                {translatedText && <button onClick={() => router.push('/register')}>
                    Sign up to save vocab words
                </button>}
            </PopoverBody>
        </Popover>
    );
}

const SelectedTextPopover = ({elementRef, articleBody}) => {
    const router = useRouter();
    const {addToast} = useToasts();
    const {user} = useContext(AppContext);
    const [isSavingVocab, setIsSavingVocab] = useState(false);
    const [hasSavedVocab, setHasSavedVocab] = useState(false);
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
        setIsSavingVocab(false);
        setHasSavedVocab(false);
    }

    const getSentenceContainingSnippet = (snippet, text) => {
        const startIndexOfSelectedText = text.indexOf(snippet);

        // TODO - omg DRY these up please
        const firstPeriodIndex = text.substring(0, startIndexOfSelectedText)
            .split('')
            .reduce((mostRecentPeriod, letter, index) => {
                if (letter === '.' || letter === '!' || letter === '?' || letter === '¿' || letter === '¡') {
                    return index;
                }

                return mostRecentPeriod;
            }, 0);

        const lastPeriodIndex = text.substring(startIndexOfSelectedText + snippet.length)
            .split('')
            .reduce((mostRecentPeriod, letter, index) => {
                if (letter === '.' || letter === '!' || letter === '?') {
                    const newIndex = index + snippet.length + startIndexOfSelectedText;
                    if (newIndex < mostRecentPeriod) {
                        return newIndex;
                    }
                }

                return mostRecentPeriod;
            }, text.length - 1);
        
        return text.substring(firstPeriodIndex + 1, lastPeriodIndex);
    }

    const handleAddToVocabList = async () => {
        const english = translatedText;
        const spanish = getTextSelection();
        const sentence = getSentenceContainingSnippet(spanish, articleBody);

        try {
            setIsSavingVocab(true);
            await createNewVocab({userId: user.uid, sentence, spanish, english});
            setIsSavingVocab(false);
            setHasSavedVocab(true);
        } catch (e) {
            addToast(e.message, {appearance: 'error'});
        }
    };

    const popoverText = isSelecting || !translatedText ? 'highlight text to translate' : translatedText;

    return (
        <Popover
            placementStrategy={placeRightBelow}
            selectionRef={elementRef}
            onTextSelect={debouncedHandleTextSelect.callback}
            onTextUnselect={resetPopoverState}>
            <PopoverBody>
                <span>{popoverText}</span>
                {translatedText && <br />}
                {!!user && translatedText && <button disabled={isSavingVocab || hasSavedVocab} onClick={handleAddToVocabList}>
                    {hasSavedVocab ? 'Vocab saved!' : 'Add to vocab'}
                </button>}

                {!user && translatedText && <button disabled={isSavingVocab || hasSavedVocab} onClick={() => router.push('/register')}>
                    Sign up to save vocab words
                </button>}
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
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #666;

    button {
        margin-top: -5px;
        width: fit-content;
        background-color: ${Colors.Primary};
        color: #fff;
        padding: 10px 15px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color linear 0.3s;

        &:hover {
            background-color: #375ebf;
        }
    }
`;