export type WordMapEntry = {
    grade: string;
    tense?: string;
    infinitive?: string;
}

export type TranscriptPortion = {
    text: string;
    start_time: number;
    highlight?: boolean;
    wordMapEntry?: WordMapEntry;
}

export type TranscriptPortionForRender = TranscriptPortion & {
    id: string;
    type: string;
    highlight: boolean;
    wordMapEntry: WordMapEntry;
}

export type GlyphColor = {
    text: string;
    body: string;
}