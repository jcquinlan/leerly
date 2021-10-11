import {useContext, useState} from 'react';
import appContext from '../contexts/appContext';
import {updateWordCounts} from '../services/userService';
import {getWordCounts} from '../services/userService';

const DEFAULT_DAILY_GOAL = 50;

const useStatsContext = () => {
    const [wordCountRecords, setWordCountRecords] = useState([]);
    const {idToken} = useContext(appContext);

    const dailyGoal = DEFAULT_DAILY_GOAL;

    const updateWordCountsWithIdToken = (wordCounts) => {
        return updateWordCounts(idToken, wordCounts);
    }

    const loadUserWordCounts = async () => {
        if (!idToken) {
            return;
        }

        const incomingWordCounts = await getWordCounts(idToken);
        setWordCountRecords(incomingWordCounts);
    }

    return {
        dailyGoal,
        wordCountRecords,
        loadUserWordCounts,
        updateWordCounts: updateWordCountsWithIdToken
    }
}

export default useStatsContext;