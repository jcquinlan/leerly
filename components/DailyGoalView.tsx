import React, { useContext, useEffect, useMemo } from 'react';
import {DateTime} from 'luxon';
import styled from 'styled-components';
import StatsContext from 'contexts/statsContext';
import {
    isWordCountToday,
    calculateWordCountSum,
} from 'utils/stats';
import {
    StatsRow,
    Stat,
    StatTitle,
    StatNumber
} from 'components/styled'
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';

import 'react-circular-progressbar/dist/styles.css';
import Colors from './styled/colors';

const dayProgressStyles = buildStyles({
    textSize: '16px',
    pathColor: Colors.Primary,
    textColor: Colors.MediumGrey
})

const DailyGoalView = () => {
    const {loadUserWordCounts, wordCountRecords, dailyGoal} = useContext(StatsContext);

    useEffect(() => {
        loadUserWordCounts();
    }, []);

    const wordStats = useMemo(() => {
        const wordCountRecordToday = wordCountRecords.find(isWordCountToday);
        const sumOfToday = wordCountRecordToday ? calculateWordCountSum(wordCountRecordToday) : 0;

        return {
            count: sumOfToday,
            percentage: sumOfToday / dailyGoal

        }
    }, [wordCountRecords, dailyGoal]);

    const now = DateTime.now();

    return (
        <>
            <WeekWrapper>
                <CircularProgressWrapper>
                    <CircularProgressbarWithChildren
                        value={wordStats.percentage}
                        minValue={0}
                        maxValue={1}
                        styles={dayProgressStyles}
                    >
                        <DailyStatWrapper>
                            <DailyStatDay>
                                {now.toFormat('cccc')}    
                            </DailyStatDay> 
                            <DailyStatProgress>
                                {Math.ceil(wordStats.percentage * 100)}<span>%</span>
                            </DailyStatProgress> 
                        </DailyStatWrapper>
                    </CircularProgressbarWithChildren>
                </CircularProgressWrapper>
            </WeekWrapper>

            <StatsRow>
                <Stat>
                    <StatTitle>Words seen today</StatTitle>
                    <StatNumber>{wordStats.count}<Small> / {dailyGoal}</Small></StatNumber>
                </Stat>
            </StatsRow>
        </>
    );
}

export default DailyGoalView;

const DailyStatWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const DailyStatDay = styled.p`
    margin: 0;
`;
const DailyStatProgress = styled.p`
    margin: 0;
    font-size: 48px;
    font-family: Poppins, sans-serif;
    font-weight: 700;
    color: ${Colors.Primary};

    span {
        font-size: 32px;
        font-family: Poppins, sans-serif;
        font-weight: 700;
    }
`;

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