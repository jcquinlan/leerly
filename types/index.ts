export type CleanedFirebaseDate = {
    seconds: number;
    nanoseconds: number;
}
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
	date: CleanedFirebaseDate,
	words: WordCount
}

export type ArticleType = {
    type: string;
    display: string;
}

export type DayProgress = {
    progress: number;
    name: string;
}
export type DayProgressMap = Record<string, DayProgress>;
