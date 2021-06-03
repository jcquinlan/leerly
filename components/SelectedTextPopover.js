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
import {
    useLocalStorage,
    TRANSLATIONS_TODAY_KEY,
    ONE_TRANSLATION_DONE_KEY,
    initialTranslationsToday
} from '../hooks/useLocalStorage';

const MAX_FREE_TRANSLATIONS = 10;

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

const SelectedTextPopover = ({elementRef, articleBody, isDemo}) => {
    const router = useRouter();
    const {addToast} = useToasts();
    const {user, userHasProPlan} = useContext(AppContext);
    const [isSavingVocab, setIsSavingVocab] = useState(false);
    const [hasSavedVocab, setHasSavedVocab] = useState(false);
    const [isSelecting, setIsSelecting] = useState(true);
    const [translatedText, setTranslatedText] = useState('');
    const [oneTranslationDone, setOneTranslationDone] = useLocalStorage(ONE_TRANSLATION_DONE_KEY, false);
    const [translationsToday, setTranslationsToday] = useLocalStorage(TRANSLATIONS_TODAY_KEY, initialTranslationsToday());
    const noMoreFreeTranslations = !userHasProPlan && translationsToday.count > MAX_FREE_TRANSLATIONS;

    const debouncedHandleTextSelect = useDebouncedCallback(async () => {
        if (user && noMoreFreeTranslations) {
            return;
        }

        setIsSelecting(false);
        const textToTranslate = getTextSelection();

        if (textToTranslate) {
            const translatedText = await translateText(textToTranslate);
            setTranslatedText(translatedText.translation);
            if (!oneTranslationDone) {
                setOneTranslationDone(true);
            }

            if (!!user && !userHasProPlan) {
                setTranslationsToday(currentTranslationsToday => ({
                    ...currentTranslationsToday,
                    count: currentTranslationsToday.count + 1
                }));
            }
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

    const renderPopoverText = () => {
        if (user && noMoreFreeTranslations) {
            return;
        }

        if (translatedText) {
            return <span>{translatedText}</span>;
        }

        return <span>highlight text to translate</span>;
    }

    const renderPopoverBody = () => {
        if (user && noMoreFreeTranslations) {
            return <span>
                Free acounts get only 10
                <br />
                translations per day.
            </span>;
        }

        // Paying user has translated text -> Show Vocab button
        if (user && translatedText && userHasProPlan) {
            return [
                <br />,
                <button disabled={isSavingVocab || hasSavedVocab} onClick={handleAddToVocabList}>
                    {hasSavedVocab ? 'Vocab saved!' : 'Add to vocab'}
                </button>
            ]
        }

        // Free user has translated text -> Show upgrade message
        if (user && translatedText && !userHasProPlan) {
            return [
                <br />,
                <button disabled={isSavingVocab || hasSavedVocab} onClick={() => router.push('/settings')}>
                    Upgrade your plan to save vocab words
                </button>
            ]
        }

        // No user, must be a demo -> Show sign up message
        if (!user && translatedText) {
            return [
                <br />,
                <button disabled={isSavingVocab || hasSavedVocab} onClick={() => router.push('/register')}>
                    Sign up to save vocab words
                </button>
            ]
        }

    }

    return (
        <Popover
            placementStrategy={placeRightBelow}
            selectionRef={elementRef}
            onTextSelect={debouncedHandleTextSelect.callback}
            onTextUnselect={resetPopoverState}>
            <PopoverBody>
                {renderPopoverText()}
                {renderPopoverBody()}
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