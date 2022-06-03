import React, {useState, useMemo, useEffect, useContext} from 'react';
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';
import {useRouter} from 'next/router';
import {
    Container,
    NoticeCard,
    NoticeCardMain,
    Colors,
    SearchInput
} from '../components/styled';
import {sizes} from '../components/styled/mediaQueries';
import ArticlePreview, {ArticlesList} from '../components/ArticlePreview';
import useGuardRoute from '../hooks/useGuardRoute';
import {getArticleReadStatuses} from '../services/articleService';
import AppContext from '../contexts/appContext';
import WeeklyGoalView from '../components/WeeklyGoalView';
import DailyGoalView from '../components/DailyGoalView';
import articlesContext from '../contexts/articlesContext';
import useWindowSize from '../hooks/useWindowSize';
import useDebounce from '../hooks/useDebounce';
import Link from 'next/link';
import TypeSelector from '../components/TypeSelector';

const PAGE_SIZE = 10;

function ArticlePage () {
    useGuardRoute();

    const router = useRouter();
    const {user, userHasProPlan} = useContext(AppContext);
    const {articles, loadArticles, loading, searchArticles} = useContext(articlesContext);
    const [selectedFilterTypes, setSelectedFilterTypes] = useState([]);
    const [readStatuses, setReadStatuses] = useState({});
    const [offset, setOffset] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 400);
    const size = useWindowSize();

    useEffect(() => {
        loadArticles(selectedFilterTypes, debouncedSearchTerm);
    }, [selectedFilterTypes, debouncedSearchTerm]);

    const articlesToShow = useMemo(() => {
        if (!articles) {
            return [];
        }

        return articles.slice(offset, offset + PAGE_SIZE);
    }, [articles, offset]);

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

    const handleTypeChange = (newType) => {
        setSelectedFilterTypes(selectedTypes => {
            const isSelected = selectedTypes.includes(newType);

            if (isSelected) {
                return selectedTypes.filter(selectedType => selectedType !== newType);
            } else {
                return [...selectedTypes, newType];
            }
        });
    }

    return (
        <>
        <Container>

        {!userHasProPlan && (
            <NoticeCard onClick={() => router.push('/settings')}>
                <span>leerly Pro members get vocab studying, all articles, unlimited translations, and more.</span> <br />
                <NoticeCardMain>Upgrade now ⟶</NoticeCardMain>
            </NoticeCard>
        )}

        <DashboardHeader>
            <DashboardHeaderTitle>Your Weekly Progress</DashboardHeaderTitle>
            {size.width >= sizes.mobileL && (
                <WeeklyGoalView />
            )}

            {size.width < sizes.mobileL && (
                <DailyGoalView />
            )}
        </DashboardHeader>
        <Link href="/dictionary">
            <AllProgress>
                See your full progress ⟶
            </AllProgress>
        </Link>

        <div style={{width: '100%'}}>
            <SearchInput
                value={searchTerm}
                onChange={(value) => setSearchTerm(value)}
                placeholder="Search articles"
            />
            <TypeSelector selectedTypes={selectedFilterTypes} onSelect={handleTypeChange} />
        </div>

        <ArticlesList>
            {loading && !articlesToShow.length && (
                <div style={{textAlign: 'center', padding: '20px 0'}}>Loading articles...</div>
            )}

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

const DashboardHeaderTitle = styled.h4`
    margin-top: 0;
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

const DashboardHeader = styled.div`
    border: 1px solid ${Colors.LightGrey};
    padding: 30px;
    border-radius: 8px 8px 0 0;
`;

const AllProgress = styled.div`
    text-align: center;
    border: 1px solid ${Colors.LightGrey};
    border-top: none;
    margin-bottom: 50px;
    border-radius: 0 0 8px 8px;
    padding: 15px 0;
    cursor: pointer;
    font-family: Source Sans Pro, sans-serif;
`;
