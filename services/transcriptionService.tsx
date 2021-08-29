import { v4 as uuidv4 } from 'uuid';
import {TranscriptPortionForRender} from 'types';

export const NEW_PARAGRAPH_GLYPH = 'newParagraph';
export const WORD_GLYPH = 'word';

export const fetchArticleTranscription = (transcriptionId, userLevel) => {
    return fetch(`/api/transcriptions/${transcriptionId}${userLevel ? `?difficulty=${userLevel}` : ''}`)
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.error(err);
        });
}

export const prepareTranscript = (transcript): Omit<TranscriptPortionForRender, 'wordMapEntry'>[] => {
    return transcript.map(speaker => {
        const newParagraphObject = {
            type: NEW_PARAGRAPH_GLYPH
        };

        const words = speaker.words.map(word => {
            return {
                ...word,
                id: uuidv4(),
                type: WORD_GLYPH,
                highlight: false
            }
        });

        return [...words, newParagraphObject];
    }).flat();
}

export const renderTranscriptForReading = (transcript: TranscriptPortionForRender[], {component: Component, onClickWord}) => {
    return transcript.map((glyph) => {
        if (glyph.type === WORD_GLYPH) {
            return (
                <Component
                    key={glyph.start_time}
                    isActive={glyph.highlight}
                    seen={glyph.seen}
                    isVocab={!!glyph.wordMapEntry}
                    onClick={() => onClickWord(glyph)}
                >
                    {glyph.text}
                </Component>
            );
        }

        if (glyph.type === NEW_PARAGRAPH_GLYPH) {
            return [<br />, <br />];
        }
    });
}

export const renderTranscriptForStorybook = (transcript, decorateWord) => {
    return transcript.map((glyph, index) => {
        if (glyph.type === WORD_GLYPH) {
            return decorateWord(glyph);

        }

        if (glyph.type === NEW_PARAGRAPH_GLYPH) {
            return [<br />, <br />];
        }
    });
}
