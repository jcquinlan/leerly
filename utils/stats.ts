import { DateTime } from 'luxon';
import { DayProgressMap, WordCountRecord } from 'types';

export const areDaysSame = (a: DateTime, b: DateTime): boolean => {
    return a.startOf('day').ts === b.startOf('day').ts;
}

export const isDateOneDayEarlier = (a: DateTime, b: DateTime): boolean => {
    return a.startOf('day').ts === b.startOf('day').minus({days: 1}).ts;
}

export const isWordCountToday = (wordCountRecord: WordCountRecord): boolean => {
    const date = DateTime.fromSeconds(wordCountRecord.date.seconds);
    const now = DateTime.now();

    return areDaysSame(date, now);
}

export const getWordCountStreak = (wordCountRecords: WordCountRecord[]): number => {
    if (!wordCountRecords.length) {
        return 0;
    }

    // Start by sorting all the word count records by most recent to least recent
    const sortedWordCounts = wordCountRecords.sort((a, b) => {
        return b.date.seconds - a.date.seconds;
    });

    const startingStreak = isWordCountToday(sortedWordCounts[0]) ? 1 : 0;

    // Remove any word count record belonging to today, because we already accounted for that.
    const sortedPastWordCounts = sortedWordCounts
        .filter(wordCountRecord => !isWordCountToday(wordCountRecord));

    // For each word count record, see if the next oldest record belongs to the day before
    // the previous word count record. If it does, we increase their streak by 1.
    const streakCount = sortedPastWordCounts.reduce((memo, wordCountRecord) => {
        if (memo.streakEnded) {
            return memo;
        }

        const currentWordCountRecordDate = DateTime.fromSeconds(wordCountRecord.date.seconds);
        const isCurrentWordCountOneDayBeforePrevious =
            isDateOneDayEarlier(currentWordCountRecordDate, memo.previousWordCountDate);
        
        if (isCurrentWordCountOneDayBeforePrevious) {
            return {
                ...memo,
                count: memo.count + 1,
                previousWordCountDate: currentWordCountRecordDate
            }
        } else {
            return {
                ...memo,
                streakEnded: true
            }
        }
    }, {
        count: startingStreak,
        previousWordCountDate: DateTime.now(),
        streakEnded: false
    });

    return streakCount.count;
}

export const isWordCountThisPastWeek = (wordCountRecord: WordCountRecord): boolean => {
    const date = DateTime.fromSeconds(wordCountRecord.date.seconds);
    return date.startOf('day') > DateTime.now().minus({days: 7});
}

export const calculateWordCountSum = (wordCountRecord: WordCountRecord) => {
    return Object.values(wordCountRecord.words).reduce((memo, count) => {
        return memo + count;
    }, 0);
}

export const generateWeekOfWordCountData = (wordCounts: WordCountRecord[], goal: number): DayProgressMap => {
    const wordCountsDayMap = wordCounts.reduce<Record<string, WordCountRecord>>((memo, wordCount) => {
        const dayKey = DateTime.fromSeconds(wordCount.date.seconds).toFormat('MM-dd-yyyy');
        memo[dayKey] = wordCount;
        return memo;
    }, {});

    const days = {};
    for (let i = 0; i < 7; i++) {
        const now = DateTime.now().minus({ days: i });
        const dayKey = now.toFormat('MM-dd-yyyy');
        const wordCountForThisDay = wordCountsDayMap[dayKey];

        let dayObject = {
            progress: 0,
            name: now.toFormat('ccc')
        };

        if (wordCountForThisDay) {
            const numberOfWordsCounted = calculateWordCountSum(wordCountForThisDay);
            dayObject.progress = numberOfWordsCounted / goal;
        }

        days[dayKey] = dayObject;
    }

    return days;
}