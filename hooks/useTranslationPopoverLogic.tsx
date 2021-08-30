import React from 'react';
import {useState, useContext, useMemo, useEffect} from 'react';
import {useToasts} from 'react-toast-notifications';
import {useRouter} from 'next/router';

import {
    useLocalStorage,
    TRANSLATIONS_TODAY_KEY,
    ONE_TRANSLATION_DONE_KEY,
    initialTranslationsToday
} from './useLocalStorage';
import {translateText as translateTextUtil} from '../services/translationService';
import {createNewVocab} from '../services/vocabService';
import AppContext from '../contexts/appContext';

const MAX_FREE_TRANSLATIONS = 10;

const useTranslationPopoverLogic = (getArticleText) => {
    const router = useRouter();
    const {addToast} = useToasts();
    const {user, userHasProPlan} = useContext(AppContext);
    const [originalText, setOriginalText] = useState(null);
    const [isSavingVocab, setIsSavingVocab] = useState(false);
    const [hasSavedVocab, setHasSavedVocab] = useState(false);
    const [translatedText, setTranslatedText] = useState('');
    const [oneTranslationDone, setOneTranslationDone] = useLocalStorage(ONE_TRANSLATION_DONE_KEY, false);
    const [translationsToday, setTranslationsToday] = useLocalStorage(TRANSLATIONS_TODAY_KEY, initialTranslationsToday());
    const noMoreFreeTranslations = !userHasProPlan && translationsToday.count > MAX_FREE_TRANSLATIONS;

    const translateText = async (spanishText: string): Promise<void> => {
        if (!spanishText) return;

        setOriginalText(spanishText);
        const translatedText = await translateTextUtil(spanishText);
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

    const handleAddToVocabList = async () => {
        const english = translatedText;
        const spanish = originalText;
        const sentence = getSentenceContainingSnippet(spanish, getArticleText());

        try {
            setIsSavingVocab(true);
            await createNewVocab({userId: user.uid, sentence, spanish, english});
            setIsSavingVocab(false);
            setHasSavedVocab(true);
        } catch (e) {
            addToast(e.message, {appearance: 'error'});
        }
    };

    const popoverText = useMemo(() => {
        if (user && noMoreFreeTranslations) {
            return;
        }

        if (translatedText) {
            return <span>{translatedText}</span>;
        }

        return <span>highlight text to translate</span>;
    }, null);

    const popoverBody = useMemo(() => {
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
                <button disabled={isSavingVocab || hasSavedVocab} onClick={() => handleAddToVocabList()}>
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
    }, null);

    const resetPopoverState = () => {
        setTranslatedText('');
        setIsSavingVocab(false);
        setHasSavedVocab(false);
    }

    return {
        popoverBody,
        popoverText,
        resetPopoverState,
        translateText
    }
}

export const getSentenceContainingSnippet = (snippet, text) => {
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

export default useTranslationPopoverLogic;