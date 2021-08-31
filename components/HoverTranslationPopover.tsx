import React, {useEffect} from 'react';
import useTranslationPopoverLogic from 'hooks/useTranslationPopoverLogic';

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
