import React, {useState, useMemo, useEffect, useContext} from 'react';
import styled from 'styled-components';
import {
    Container,
    HeroWrapper,
    HeroContent,
    Divider,
    Title,
    Subtitle
} from '../components/styled';
import LoadingPage from '../components/LoadingPage';
import ArticlePreview, {ArticlesList} from '../components/ArticlePreview';
import useGetArticles from '../hooks/useGetArticles';
import useGuardRoute from '../hooks/useGuardRoute';
import {getArticleReadStatuses, getUserListeningTime} from '../services/articleService';
import {getAllVocab} from '../services/vocabService';
import AppContext from '../contexts/appContext';

function ArticlePage () {
    useGuardRoute();

    const {user} = useContext(AppContext);
    const {articles, loading, error} = useGetArticles();
    const [readStatuses, setReadStatuses] = useState({});
    const [vocabList, setVocabList] = useState([]);
    const [playTime, setPlayTime] = useState(0);

    const timeString = useMemo(() => {
        if (playTime < 60) {
            return <p>{playTime} <TimeUnit>seconds</TimeUnit></p>;
        }
        
        const minutes = Math.floor(playTime / 60);

        if (minutes < 60) {
            return <p>{minutes} <TimeUnit>mins.</TimeUnit></p>;
        }

        const hours = Math.floor(minutes / 60);
        const leftoverMinutes = minutes % 60;

        return <p>{hours} <TimeUnit>hrs.</TimeUnit> {leftoverMinutes} <TimeUnit>mins.</TimeUnit></p>;
    }, [playTime]);

    useEffect(() => {
        if (user) {
            getUserListeningTime(user.uid)
                .then(listeningMetricRef => {
                    if (listeningMetricRef.exists) {
                        setPlayTime(listeningMetricRef.data().value);
                    }
                });
        }
    }, [user]);

    useEffect(() => {
        if (articles.length) {
            getArticleReadStatuses(user.uid)
                .then(readStatusesRef => {
                    const readStatusesById = readStatusesRef.docs.reduce((memo, current) => {
                        const data = current.data();
                        memo[data.articleId] = current;
                        return memo;
                    }, {});
                    setReadStatuses(readStatusesById);
                })

            getAllVocab(user.uid)
                .then(vocabListRef => {
                    const vocabListData = vocabListRef.docs.map(vocabRef => {
                        return vocabRef.data();
                    });
                    setVocabList(vocabListData);
                });
        }
    }, [articles]);

    if (loading) {
        return <LoadingPage></LoadingPage>
    }

    return (
        <>
        <Container>
        <HeroWrapper>
            <HeroContent>
                <Title>dashboard</Title>
                <Subtitle>See all the recent articles, or search through the archives of older material.</Subtitle>
            </HeroContent>
        </HeroWrapper>

        <Divider />

        <StatsRow>
            <Stat>
                <p>{Object.keys(readStatuses).length}</p>
                Articles read
            </Stat> 

            <Stat>
                <p>{vocabList.length}</p>
                Vocab cards
            </Stat> 

            <Stat>
                {timeString}
                Time spent listening
            </Stat>
        </StatsRow>

        <ArticlesList>
            {/* <a href="https://forms.gle/Je6gXA1tLGT1bxRh6" target="_blank">
                <NoticeCard>
                    <span>How did you hear about leerly?</span> <br />
                    <NoticeCardMain>Let us know ⟶</NoticeCardMain>
                </NoticeCard>
            </a> */}

            {articles.map(article => (
                <ArticlePreview key={article.id} article={article} read={readStatuses[article.id]}/>
            ))}
        </ArticlesList>

        </Container>
        </>
    );
}

export default ArticlePage;

const StatsRow = styled.div`
    padding: 0 30px;
`;

const TimeUnit = styled.span`
    font-size: 14px;
`;

const Stat = styled.div`
    display: inline-block;
    margin-right: 15px;
    margin-bottom: 15px;
    padding: 10px 15px;
    background-color: #eee;
    border-radius: 8px;
    width: fit-content;
    min-width: 100px;
    color: #666;

    p {
        font-size: 30px;
        margin: 0;
        color: #000;
        font-weight: bold;
    }
`;