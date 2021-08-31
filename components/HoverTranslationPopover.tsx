import React from 'react';
import useTranslationPopoverLogic from 'hooks/useTranslationPopoverLogic';
import { useEffect } from 'react';

const HoverTranslationPopover = ({text, getArticleBody}) => {
    const {
        popoverBody,
        popoverText,
        translateText
    } = useTranslationPopoverLogic(getArticleBody);

    useEffect(() => {
        translateText(text);
    }, []);

    return (
        <>
            {popoverText}
            {popoverBody}
        </>
    )
}

export default HoverTranslationPopover;
