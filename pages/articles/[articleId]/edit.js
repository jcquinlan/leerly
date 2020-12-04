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
import ArticleImageSelector from '../../../components/ArticleImageSelector';
import useGetArticle from '../../../hooks/useGetArticle';
import {updateArticle, uploadAudio} from '../../../services/articleService';
import {unsplashImageToSimplifiedImage, triggerUnsplashDownload} from '../../../services/unsplashService';

function ArticlePage () {
    useGuardAdminRoute();

    const router = useRouter();
    const {article, loading, error} = useGetArticle(router.query.articleId);

    const {addToast} = useToasts();
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [formState, setFormState] = useState({});
    const [image, setImage] = useState(null);
    const [updatedImage, setUpdatedImage] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const [newAudio, setNewAudio] = useState(null);
    const formIsFilled = useMemo(() => {
        return !!(formState.article && formState.url && formState.title && image && !!selectedTypes.length);
    }, [formState]);

    useEffect(() => {
      if (article) {
        setSelectedTypes(article.types);
        setImage(article.image);
        setAudioURL(article.audio);
        setFormState({
          url: article.url,
          title: article.title,
          article: article.body,
          free: article.free
        });
      }
    }, [article]);

    const handleClick = async () => {
        try {
            const newAudioURL = newAudio ? `audios/${newAudio.name}` : null;

            if (newAudio) {
                await uploadAudio(newAudio);
            }

            await updateArticle(article.id, {
                body: formState.article,
                url: formState.url,
                title: formState.title,
                free: formState.free || false,
                audio: newAudioURL || audioURL || null,
                types: selectedTypes,
                image: updatedImage ? unsplashImageToSimplifiedImage(image) : article.image ? article.image : null
            });

            if (updatedImage) {
                await triggerUnsplashDownload(image);
            }

            addToast('Article updated', {appearance: 'success'});
            router.push(`/articles/${article.id}`);

        } catch (err) {
            console.log(err);
            addToast('An error occurred', {appearance: 'error'});
        };
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

    const setImageAndFlagAsNew = (unsplashImage) => {
        setUpdatedImage(true);
        setImage(unsplashImage);
    }

    const handleSelectedFile = (event) => {
        const file = event.target.files[0];
        setNewAudio(file);
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

        <ArticleImageSelector image={image} onSelectImage={(image) => setImageAndFlagAsNew(image)} />

        {audioURL && (
            <AudioWrapper>
                <span>audio file: {audioURL}</span>
                <Button onClick={() => setAudioURL(null)}>Select new audio</Button>
            </AudioWrapper>
        )}

        {!audioURL && (
            <>
            <label for='audio'>mp3 audio file</label>
            <input type='file' name='audio' accept='audio/mp3' onChange={handleSelectedFile} />
            </>
        )}

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

const AudioWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;

    button {
        margin-top: 10px;
        width: fit-content;
    }
`;
