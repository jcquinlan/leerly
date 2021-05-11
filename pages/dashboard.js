import React, {useState, useMemo, useEffect, useContext} from 'react';
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';
import {
    Container,
    HeroWrapper,
    HeroContent,
    Divider,
    Title,
    Subtitle,
    HelpText,
    NoticeCard,
    NoticeCardMain
} from '../components/styled';
import LoadingPage from '../components/LoadingPage';
import ArticlePreview, {ArticlesList} from '../components/ArticlePreview';
import useGuardRoute from '../hooks/useGuardRoute';
import {getArticleReadStatuses, getUserMetrics} from '../services/articleService';
import AppContext from '../contexts/appContext';
import ProgressBar from '../components/ProgressBar';
import {calculateStatsLevel} from '../utils/stats';
import useGetDashboardArticles from '../hooks/useGetDashboardArticles';
import { useRouter } from 'next/router';
import TypeSelector from '../components/TypeSelector';

const PAGE_SIZE = 10;

function ArticlePage () {
    useGuardRoute();

    const router = useRouter();
    const {user, userHasProPlan} = useContext(AppContext);
    const {articles, loading, error} = useGetDashboardArticles();
    const [readStatuses, setReadStatuses] = useState({});
    const [playTime, setPlayTime] = useState(0);
    const [cardsStudied, setCardsStudied] = useState(0);
    const [offset, setOffset] = useState(0);
    const [selectedFilterTypes, setSelectedFilterTypes] = useState([]);

    const articlesToShow = useMemo(() => {
        if (!articles) {
            return [];
        }

        return articles.slice(offset, offset + PAGE_SIZE);
    }, [articles, offset]);

    const levelData = useMemo(() => {
        const articlesRead = Object.keys(readStatuses).length;
        return calculateStatsLevel({
            minutesListening: playTime,
            cardsReviewed: cardsStudied,
            articlesRead
        });
    }, [readStatuses, playTime, readStatuses]);

    const maxPages = useMemo(() => {
        if (!articles) {
            return 0;
        }

        if (articles.length < PAGE_SIZE) {
            return 1;
        }

        return Math.floor(articles.length / PAGE_SIZE);
    }, [articles])

    const handlePageChange = (data) => {
        setOffset(data.selected * PAGE_SIZE);
    }

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
        }
    }, [articles]);

    const handleSelectedFilterType = (newType) => {
        const typeIsAlreadySelected = selectedFilterTypes.includes(newType);
        if (typeIsAlreadySelected) {
            setSelectedFilterTypes(selectedFilterTypes.filter(type => type !== newType));
        } else {
            setSelectedFilterTypes([...selectedFilterTypes, newType]);
        }
    }

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

        {!userHasProPlan && (
            <NoticeCard onClick={() => router.push('/settings')}>
                <span>leerly Pro members get vocab studying, all articles, unlimited translations, and more.</span> <br />
                <NoticeCardMain>Upgrade now ⟶</NoticeCardMain>
            </NoticeCard>
        )}

        <LevelInfo>
            <LevelInfoHeader>
                <CurrentLevel>lvl. {levelData.level}</CurrentLevel>
                <span>{levelData.percentage * 100}%</span>
                <span>lvl. {levelData.level + 1}</span>
            </LevelInfoHeader>
            <ProgressBar progress={levelData.percentage * 100} />
            <HelpText>You progress in level by reading more articles, listening to more audio, and studying more vocab</HelpText>
        </LevelInfo>

        <StatsRow>
            <Stat>
                <p>{Object.keys(readStatuses).length}</p>
                Articles read
            </Stat> 

            <Stat>
                {timeString}
                Time spent listening
            </Stat>

            <Stat disabled={!userHasProPlan}>
                <p>{cardsStudied}</p>
                Vocab cards reviewed
            </Stat>
        </StatsRow>

        <TypeSelector selectedTypes={selectedFilterTypes} onSelect={handleSelectedFilterType} />

        <ArticlesList>
            {articlesToShow.map(article => (
                <ArticlePreview key={article.id} article={article} read={readStatuses[article.id]}/>
            ))}
        </ArticlesList>

        <PaginationStyles>
            <ReactPaginate
                pageCount={maxPages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                onPageChange={handlePageChange}
                activeClassName="active"
            />
        </PaginationStyles>

        </Container>
        </>
    );
}

export default ArticlePage;

const LevelInfo = styled.div`
    padding: 0 30px;

    ${HelpText} {
        margin: 20px 0;
        margin-top: 5px;
    }
`;

const LevelInfoHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 10px 0;
    font-family: 'Poppins', sans-serif;
`;

const CurrentLevel = styled.span`
    font-size: 24px;
    font-weight: bold;
`;

const PaginationStyles = styled.div`
    display: flex;
    justify-content: center;

    li {
        display: inline-block;
        margin-right: 15px;
        cursor: pointer;
        font-size: 18px;
    }

    .active  {
        text-decoration: underline;
    }
`;
const StatsRow = styled.div`
    padding: 20px 30px;
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

    ${props => props.disabled ? `
        opacity: .3;
    `: ``}
`;