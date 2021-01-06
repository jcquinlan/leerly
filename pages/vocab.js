import React, {useState, useMemo, useEffect, useContext} from 'react';
import styled from 'styled-components';
import {
    Container,
    HeroWrapper,
    HeroContent,
    Divider,
    Title,
    Subtitle,
    Card,
    Colors
} from '../components/styled';
import LoadingPage from '../components/LoadingPage';
import useGuardRoute from '../hooks/useGuardRoute';
import AppContext from '../contexts/appContext';
import {getAllVocab, deleteVocab} from '../services/vocabService';

function VocabPage () {
    useGuardRoute();

    const {user} = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [vocabList, setVocabList] = useState([]);
    const [disableDelete, setDisableDelete] = useState(false);

    useEffect(() => {
        if (!!user) {
            getAllVocab(user.uid)
                .then(vocab => {
                    const vocabData = vocab.docs.map(current => {
                        return {id: current.id, ...current.data()};
                    });
                    setVocabList(vocabData);
                })
                .finally(() => setLoading(false));
        }
    }, [user]);

    const handleDeleteVocab = async (vocabId) => {
        if (disableDelete) return;

        setDisableDelete(true);
        await deleteVocab(vocabId);
        setDisableDelete(false);
        setVocabList(vocabList => vocabList.filter(item => item.id !== vocabId));
    }

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
            {!vocabList.length && (
                <p>Save vocab by highlighting text in an article and saving it.</p>
            )}
            {vocabList.map(vocab => (
                <VocabCard>
                    <VocabHeader onClick={() => handleDeleteVocab(vocab.id)}>
                        <button>Delete</button>
                    </VocabHeader>

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

const VocabHeader = styled.div`
    position: absolute;
    display: none;
    justify-content: flex-end;
    width: 100%;
    top: 0;
    left: 0px;
    padding: 15px;

    button {
        background-color: ${Colors.Danger};
        box-shadow: none;
        border: none;
        border-radius: 5px;
        opacity: .3;
        padding: 5px 10px;
        color: #fff;
        cursor: pointer;

        &:hover {
            opacity: 1;
        }
    }
`;
const VocabCard = styled(Card)`
    margin-bottom: 30px;
    position: relative;

    &:hover {
        ${VocabHeader} {
            display: flex;
        }
    }
`;

const Foreign = styled.h4`
    text-align: center;
    font-size: 24px;
    margin-bottom: 0px;
    margin-top: 0;
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

