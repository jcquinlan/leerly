export type WordMapEntry = {
    grade: string;
    tense?: string;
    infinitive?: string;
}

export type TranscriptPortion = {
    text: string;
    start_time: number;
}

export type TranscriptPortionForRender = TranscriptPortion & {
    id: string;
    type: string;
    index: number;
    highlight: boolean;
    seen?: boolean;
    wordMapEntry?: WordMapEntry;
}

export type WordCount = Record<string, number>;
export type WordCountRecord = {
    userId: string,
	week: number,
	year: number,
	date: Date,
	words: WordCount
}

export type ArticleType = {
    type: string;
    display: string;
}
