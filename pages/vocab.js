import React, {useState, useEffect, useContext} from 'react';
import styled from 'styled-components';
import {ExportToCsv} from 'export-to-csv';
import {
    Container,
    HeroWrapper,
    HeroContent,
    Divider,
    Title,
    Subtitle,
    Card,
    Colors,
    NoticeCard,
    NoticeCardMain,
    Button
} from '../components/styled';
import LoadingPage from '../components/LoadingPage';
import useGuardRoute from '../hooks/useGuardRoute';
import AppContext from '../contexts/appContext';
import {getAllVocab, deleteVocab} from '../services/vocabService';
import VocabQuiz from '../components/VocabQuiz';
import useUserMetrics from '../hooks/useUserMetrics';
import { updateUserCardsStudiedActivityMetric } from '../services/articleService';
import useGuardPaidRoute from '../hooks/useGuardPaidRoute';

function VocabPage () {
    useGuardRoute();
    useGuardPaidRoute();

    const {user} = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [vocabList, setVocabList] = useState([]);
    const [disableDelete, setDisableDelete] = useState(false);
    const [isStudying, setIsStudying] = useState(false);
    const {cardsStudied} = useUserMetrics();

    const hasSufficientCardsToStudy = vocabList.length > 9;

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

    const handleQuizFinished = (completedCards) => {
        updateUserCardsStudiedActivityMetric(user.uid, completedCards + cardsStudied);
    }

    const handleExportVocab = () => {
        const options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            showLabels: true, 
            title: 'leerly vocab export',
            useTextFile: false,
            useKeysAsHeaders: true
          };
         
        const csvExporter = new ExportToCsv(options);
        const data = vocabList.map(vocab => {
            return {
                english: vocab.english,
                spanish: vocab.spanish,
                sentence: vocab.sentence
            }
        });
         
        csvExporter.generateCsv(data);
    }

    if (loading) {
        return <LoadingPage></LoadingPage>
    }

    return (
        <>
        <Container>
        <HeroWrapper>
            <HeroContent>
                <Title>vocab / studying</Title>
                <Subtitle>All your saved vocab, ready for studying.</Subtitle>
            </HeroContent>
        </HeroWrapper>

        <Divider />
        {!isStudying && (
            <div>
                {!!vocabList.length && (
                    <ButtonRow>
                        <Button disabled={!vocabList.length} onClick={handleExportVocab}>Export cards as CSV</Button>
                    </ButtonRow>
                )}

                {!vocabList.length && (
                    <p>Save vocab by highlighting text in an article and saving it.</p>
                )}

                {hasSufficientCardsToStudy && (
                    <NoticeCard theme="Warm" onClick={() => setIsStudying(true)}>
                        <span>Review your flashcards right in leerly</span> <br />
                        <NoticeCardMain>Click here to start studying</NoticeCardMain>
                    </NoticeCard> 
                )}

                {!hasSufficientCardsToStudy && (
                    <NoticeCard theme="Grey">
                        <span>Once you have some vocab saved, you can study it.</span> <br />
                        <NoticeCardMain>{vocabList.length}/10 vocab cards saved</NoticeCardMain>
                    </NoticeCard> 
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
        )}

        {isStudying && <VocabQuiz vocab={vocabList} onCloseQuiz={() => setIsStudying(false)} onFinish={handleQuizFinished} />}

        </Container>
        </>
    );
}

export default VocabPage;

const ButtonRow = styled.div`
    display: flex;
    margin-bottom: 30px;
    flex-flow: row-reverse;
`;

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

