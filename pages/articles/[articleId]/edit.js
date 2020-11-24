import React, {useState, useMemo, useEffect} from 'react';
import styled from 'styled-components';
import {useToasts} from 'react-toast-notifications';
import {useRouter} from 'next/router';
import {
    Container,
    HeroWrapper,
    HeroContent,
    Divider,
    Title,
    Input,
    TextArea,
    Button,
    Checkbox
} from '../../../components/styled';
import useGuardAdminRoute from '../../../hooks/useGuardAdminRoute';
import TypeSelector from '../../../components/TypeSelector';
import LoadingPage from '../../../components/LoadingPage';
import useGetArticle from '../../../hooks/useGetArticle';
import {updateArticle} from '../../../services/articleService';

function ArticlePage () {
    useGuardAdminRoute();

    const router = useRouter();
    const {article, loading, error} = useGetArticle(router.query.articleId);

    const {addToast} = useToasts();
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [formState, setFormState] = useState({});
    const formIsFilled = useMemo(() => {
        return !!(formState.article && formState.url);
    }, [formState]);

    useEffect(() => {
      if (article) {
        setSelectedTypes(article.types);
        setFormState({
          url: article.url,
          title: article.title,
          article: article.body,
          free: article.free
        });
      }
    }, [article]);

    const handleClick = async () => {
        updateArticle(article.id, {
            body: formState.article,
            url: formState.url,
            title: formState.title,
            free: formState.free || false,
            types: selectedTypes
        })
        .then(() => {
            addToast('Article updated', {appearance: 'success'});
            router.push(`/articles/${article.id}`);
        })
        .catch((err) => {
            console.log(err);
            addToast('An error occurred', {appearance: 'error'});
        });
    };

    const handleSelectedType = (newType) => {
        const typeIsAlreadySelected = selectedTypes.includes(newType);
        if (typeIsAlreadySelected) {
            setSelectedTypes(selectedTypes.filter(type => type !== newType));
        } else {
            setSelectedTypes([...selectedTypes, newType]);
        }
    }

    const handleFormState = (event) => {
        const newState = {
            ...formState,
            [event.target.name]: event.target.value
        };
        setFormState(newState);
    }

    const handleCheckboxChange = (event) => {
        const newState = {
            ...formState,
            [event.target.name]: event.target.checked
        };
        setFormState(newState);
    }

    if (loading) {
      return <LoadingPage></LoadingPage>;
    }

    return (
        <>
        <Container>
        <HeroWrapper>
            <HeroContent>
                <Title>edit article</Title>
            </HeroContent>
        </HeroWrapper>

        <Divider />

        <TypeSelector onSelect={handleSelectedType} selectedTypes={selectedTypes} />
        <Input type="text" name="url" value={formState.url || ''} placeholder="url of original article" defaultValue={formState.url} required onChange={handleFormState} />
        <Input type="text" name="title" value={formState.title || ''} placeholder="title of the article" defaultValue={formState.title} required onChange={handleFormState} />
        <TextArea name='article' value={formState.article || ''} placeholder='the summarized, translated article' defaultValue={formState.article} required onChange={handleFormState} />

        <div>
            <label for='free'>Article is free?</label>
            <Checkbox type='checkbox' name='free' checked={formState.free || false} onChange={handleCheckboxChange} />
        </div>

        <Button onClick={handleClick} disabled={!formIsFilled}>Save article</Button>

        </Container>
        </>
    );
}

export default ArticlePage;
