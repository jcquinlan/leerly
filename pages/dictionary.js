import React, {useContext, useEffect, useState, useMemo} from 'react';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import {
    Container,
    StatsRow,
    Stat,
    StatNumber,
    StatTitle,
    Title,
    Subtitle
} from '../components/styled';
import {getNextDifficultyLevel} from '../services/corpusService';
import DictionaryTable from '../components/DictionaryTable';
import useGuardRoute from '../hooks/useGuardRoute';
import AppContext from '../contexts/appContext';
import StatsContext from '../contexts/statsContext';
import LoadingPage from 'components/LoadingPage';
import ProgressBar from '../components/ProgressBar';
import {DifficultyLevelCompletionPercentages} from '../constants';

function DictionaryPage () {
    useGuardRoute();

    const {userProfile} = useContext(AppContext);
    const {loadDictionary} = useContext(StatsContext);
    const [dictionary, setDictionary] = useState([]);

    useEffect(() => {
        loadDictionary().then(setDictionary);
    }, []);

    const {completedWordCount, seenWordCount, totalProgress} = useMemo(() => {
        if (!dictionary.length || !userProfile?.levels?.spanish) {
            return {
                completedWordCount: 0,
                seenWordCount: 0,
                totalProgress: 0
            }
        } else {
            const completedWordCount = dictionary.filter(({completed}) => completed).length;
            const seenWordCount = dictionary.filter(({count}) => count > 0).length;
            const numberOfWordsInDifficulty = dictionary.length;
            // Since there are so many words in each difficulty category, we don't expect
            // the user to actually complete every word, but rather just a large chunk of them.
            // The percentage of words they need to complete varies depending on the difficulty level.
            const completionNumberForDifficulty =
                Math.floor(numberOfWordsInDifficulty * DifficultyLevelCompletionPercentages[userProfile.levels.spanish]);
            const totalProgress = Math.round((seenWordCount / completionNumberForDifficulty) * 100);

            return {
                completedWordCount,
                seenWordCount,
                totalProgress
            }
        }
    }, [dictionary, userProfile]);

    if (!dictionary.length || !userProfile) {
        return <LoadingPage />
    }

    if (!userProfile?.levels?.spanish) {
        return (
            <Container>
                <Title>Want to see your progress?</Title>
                <Subtitle>Set your difficulty level in your profile.</Subtitle>
                <a href="/settings">Go to your profile ⟶</a>
            </Container>
        )
    }

    return (
        <Container>
            <Header>
                <Title>Your overall progress</Title>
                <Subtitle>See your progress to the next level, word by word.</Subtitle>
            </Header>

            <ProgressBarWrapper>
                <ProgressBar progress={totalProgress} />
                <ProgressText>
                    <span>Current level: {userProfile?.levels?.spanish?.toUpperCase()}</span>
                    <span>Next level: {getNextDifficultyLevel(userProfile?.levels?.spanish).toUpperCase()}</span>
                </ProgressText>
            </ProgressBarWrapper>
            <StatsRow style={{margin: '20px 0 30px 0'}}>
                <Stat>
                    <StatTitle>Total words seen</StatTitle>
                    <StatNumber>{seenWordCount}</StatNumber>
                </Stat>

                <Stat>
                    <StatTitle>Total words completed</StatTitle>
                    <StatNumber>{completedWordCount}</StatNumber>
                </Stat>

                <Stat>
                    <StatTitle>Progress through level</StatTitle>
                    <StatNumber>{totalProgress}%</StatNumber>
                </Stat>
            </StatsRow>
            <DictionaryTable dictionary={dictionary} />
        </Container>
    );
}

export default DictionaryPage;

const Header = styled.div`
    margin-bottom: 40px;
`;
const ProgressBarWrapper = styled.div`
    margin-bottom: 40px;
`;

const ProgressText = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px;
`;

