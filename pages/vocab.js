import React, {useState, useMemo, useEffect, useContext} from 'react';
import styled from 'styled-components';
import {
    Container,
    HeroWrapper,
    HeroContent,
    Divider,
    Title,
    Subtitle,
    Card
} from '../components/styled';
import LoadingPage from '../components/LoadingPage';
import useGuardRoute from '../hooks/useGuardRoute';
import AppContext from '../contexts/appContext';
import {getAllVocab} from '../services/vocabService';

function VocabPage () {
    useGuardRoute();

    const {user} = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [vocabList, setVocabList] = useState([]);

    useEffect(() => {
        if (!!user) {
            getAllVocab(user.uid)
                .then(vocab => {
                    const vocabData = vocab.docs.map(current => {
                        return current.data();
                    });
                    setVocabList(vocabData);
                })
                .finally(() => setLoading(false));
        }
    }, [user]);

    if (loading) {
        return <LoadingPage></LoadingPage>
    }

    return (
        <>
        <Container>
        <HeroWrapper>
            <HeroContent>
                <Title>vocab</Title>
                <Subtitle>All the vocabulary you wanted to save, for future studying. Coming soon: export to CSV for Anki decks</Subtitle>
            </HeroContent>
        </HeroWrapper>

        <Divider />

        <div>
            {vocabList.map(vocab => (
                <VocabCard>
                    <Foreign>
                        {vocab.spanish}
                    </Foreign>
                    <Translation>
                        "{vocab.english}"
                    </Translation>
                    <div>
                        <Example>Example:</Example>
                        <Sentence>{vocab.sentence}</Sentence>
                    </div>
                </VocabCard>
            ))}
        </div>

        </Container>
        </>
    );
}

export default VocabPage;

const VocabCard = styled(Card)`
    margin-bottom: 30px;
`;

const Foreign = styled.h4`
    text-align: center;
    font-size: 24px;
    margin-bottom: 0px;
`;

const Translation = styled.p`
    margin-top: 0px;
    text-align: center;
`;

const Sentence = styled.p`
    line-height: 24px;
    color: #666;
    font-size: 18px;
    margin-top: 5px;
    font-weight: normal;
`;
const Example = styled.div`
    margin-bottom: 0px;
    font-weight: bold;
    color: #666;
`;

