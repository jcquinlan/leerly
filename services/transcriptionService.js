import { v4 as uuidv4 } from 'uuid';

export const fetchArticleTranscription = (transcriptionId) => {
    return fetch(`/api/transcriptions/${transcriptionId}`)
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.error(err);
        });
}

export const NEW_PARAGRAPH_GLYPH = 'newParagraph';
export const WORD_GLYPH = 'word';

export const prepareTranscript = transcript => {
    return transcript.map(speaker => {
        const newParagraphObject = {
            type: NEW_PARAGRAPH_GLYPH
        };

        const words = speaker.words.map(word => {
            return {
                ...word,
                id: uuidv4(),
                type: WORD_GLYPH
            }
        });

        return [...words, newParagraphObject];
    }).flat();
}

export const renderTranscriptForReading = (transcript, {component: Component, onClickWord}) => {
    return transcript.map((glyph, index) => {
        if (glyph.type === WORD_GLYPH) {
            return (
                <Component
                    key={glyph.start_time}
                    highlight={glyph.highlight}
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
