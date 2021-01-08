import React, {useState, useMemo, useEffect, useContext} from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import {
    Container,
    HeroWrapper,
    HeroContent,
    Divider,
    Title,
    Subtitle,
    NoticeCard,
    NoticeCardMain
} from '../components/styled';
import LoadingPage from '../components/LoadingPage';
import ArticlePreview, {ArticlesList} from '../components/ArticlePreview';
import useGetArticles from '../hooks/useGetArticles';
import useGuardRoute from '../hooks/useGuardRoute';
import {getArticleReadStatuses, getUserMetrics} from '../services/articleService';
import {getAllVocab} from '../services/vocabService';
import {getAllUserReferralRecords} from '../services/referralService';
import AppContext from '../contexts/appContext';

function ArticlePage () {
    useGuardRoute();

    const {user} = useContext(AppContext);
    const {articles, loading, error} = useGetArticles();
    const [readStatuses, setReadStatuses] = useState({});
    const [vocabList, setVocabList] = useState([]);
    const [playTime, setPlayTime] = useState(0);
    const [cardsStudied, setCardsStudied] = useState(0);
    const [referralRecords, setReferralRecords] = useState(0);

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
            getUserMetrics(user.uid)
                .then(userMetricsRef => {
                    if (userMetricsRef.exists) {
                        const userMetricsData = userMetricsRef.data();

                        setPlayTime(userMetricsData.time_listening || 0);
                        setCardsStudied(userMetricsData.cards_studied || 0);
                    }
                });

            getAllUserReferralRecords(user.uid)
                .then(referralRecords => setReferralRecords(referralRecords.size));
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

            <Stat>
                <p>{cardsStudied}</p>
                Vocab cards reviewed
            </Stat>

            <Stat>
                <p>{referralRecords}</p>
                Free months earned
            </Stat>
        </StatsRow>

        <ArticlesList>
            <Link href="/referral">
                <NoticeCard>
                    <span>Whenever a friend signs up with your referral code, you get a free month of leerly.</span> <br />
                    <NoticeCardMain>Earn unlimited free months of leerly  ⟶</NoticeCardMain>
                </NoticeCard>
            </Link>

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