import styled from 'styled-components';
import StatsContext from 'contexts/statsContext';
import React, { useContext, useEffect, useMemo } from 'react';
import {
    generateWeekOfWordCountData,
    isWordCountThisPastWeek,
    isWordCountToday,
    calculateWordCountSum,
    getWordCountStreak
} from 'utils/stats';
import {
    StatsRow,
    Stat,
    StatTitle,
    StatNumber
} from 'components/styled';
import {CircularProgressbarWithChildren, buildStyles} from 'react-circular-progressbar';

import 'react-circular-progressbar/dist/styles.css';
import Colors from './styled/colors';

const dayProgressStyles = buildStyles({
    textSize: '16px',
    pathColor: Colors.Primary,
    textColor: Colors.MediumGrey
})

const DailyProgressText = ({text, progress}) => {
    return (
        <p>{text}</p>
    )
}

const WeeklyGoalView = () => {
    const {loadUserWordCounts, wordCountRecords, dailyGoal} = useContext(StatsContext);

    useEffect(() => {
        loadUserWordCounts();
    }, []);

    const wordStats = useMemo(() => {
        const wordCountRecordToday = wordCountRecords.find(isWordCountToday);
        const wordCountRecordsThisWeek = wordCountRecords.filter(isWordCountThisPastWeek);
        const streak = getWordCountStreak(wordCountRecords);

        return {
            todayCount: wordCountRecordToday ? calculateWordCountSum(wordCountRecordToday) : 0,
            weekCount: wordCountRecordsThisWeek.length ?
                wordCountRecordsThisWeek.reduce((memo, wordCountRecord) => {
                    return memo + calculateWordCountSum(wordCountRecord);
                }, 0) :
                0,
            streak
        }
    }, [wordCountRecords]);

    const days = useMemo(() => {
        const dayMap = generateWeekOfWordCountData(wordCountRecords, dailyGoal);

        return Object.values(dayMap).reverse().map(dayObject => {
            return (
                <CircularProgressWrapper>
                    <CircularProgressbarWithChildren
                        value={dayObject.progress}
                        minValue={0}
                        maxValue={1}
                        styles={dayProgressStyles}
                    >
                        <DailyProgressText text={dayObject.name} progress={dayObject.progress} />
                    </CircularProgressbarWithChildren>

                    <PercentageWrapper>
                        {Math.ceil(dayObject.progress * 100)} %
                    </PercentageWrapper>
                </CircularProgressWrapper>
            )
        })
    }, [wordCountRecords]);


    return (
        <>
            <WeekWrapper>
                {days}
            </WeekWrapper>

            <StatsRow>
                <Stat>
                    <StatTitle>Words seen today</StatTitle>
                    <StatNumber>{wordStats.todayCount}<Small> / {dailyGoal}</Small></StatNumber>
                </Stat>

                <Stat>
                    <StatTitle>Words seen this week</StatTitle>
                    <StatNumber>{wordStats.weekCount}</StatNumber>
                </Stat>

                <Stat>
                    <StatTitle>Current streak {wordStats.streak > 0 ? '🔥' : ''}</StatTitle>
                    <StatNumber>{wordStats.streak}</StatNumber>
                </Stat>
            </StatsRow>
        </>
    );
}

export default WeeklyGoalView;

const Small = styled.span`
    font-size: 32px;
    color: ${Colors.MediumGrey};
`;

const WeekWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: start
`;

const CircularProgressWrapper = styled.div`
    margin-right: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const PercentageWrapper = styled.div`
    margin-top: 10px;
    color: ${Colors.MediumGrey};
`;