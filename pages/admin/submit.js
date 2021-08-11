import React, {useState, useMemo, useContext} from 'react';
import styled from 'styled-components';
import {useToasts} from 'react-toast-notifications';
import { useRouter } from 'next/router';
import useGuardAdminRoute from '../../hooks/useGuardAdminRoute';
import {
    Container,
    HeroWrapper,
    HeroContent,
    Divider,
    Title,
    Button,
    Input,
    Checkbox
} from '../../components/styled';
import TypeSelector from '../../components/TypeSelector';
import LevelSelector from '../../components/LevelSelector';
import ArticleImageSelector from '../../components/ArticleImageSelector';
import AppContext from '../../contexts/appContext';
import {createNewArticle, uploadAudio} from '../../services/articleService';
import TextareaAutosize from 'react-textarea-autosize';
import {unsplashImageToSimplifiedImage, triggerUnsplashDownload} from '../../services/unsplashService';

function SubmitPage () {
    useGuardAdminRoute();

    const router = useRouter();
    const {addToast} = useToasts();
    const {user} = useContext(AppContext);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [formState, setFormState] = useState({});
    const [audioURL, setAudioURL] = useState(null);
    const [image, setImage] = useState(null);
    const [level, setLevel] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const formIsFilled = useMemo(() => {
        return !!(
            formState.article &&
            formState.url &&
            image &&
            formState.title &&
            formState.transcriptId &&
            !!selectedTypes.length
        );
    }, [formState, image, selectedTypes]);

    const handleClick = async () => {
        setSaving(true);
        try {
            await uploadAudio(audioFile);
            const article = await createNewArticle({
                added_by: user.uid,
                body: formState.article,
                url: formState.url,
                title: formState.title,
                free: formState.free || false,
                types: selectedTypes,
                language: 'spanish',
                audio: `audios/${audioFile.name}`,
                image: unsplashImageToSimplifiedImage(image),
                transcriptId: formState.transcriptId,
                published: false
            });

            await triggerUnsplashDownload(image);

            addToast('Article submitted', {appearance: 'success'});
            router.push(`/articles/${article.id}`);
        } catch (error) {
            addToast('An error occurred', {appearance: 'error'});
        };
        setSaving(false);
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

    const handleSelectedFile = async (e) => {
        const file = e.target.files[0];
        setAudioFile(file);
    }

    const textAreaStyles = {
        width: '100%',
        fontSize: '16px',
        padding: '15px',
        marginBottom: '30px',
        border: 'none',
        backgroundColor: '#eee',
        borderRadius: '8px'
    }

    return (
        <>
        <Container>
        <HeroWrapper>
            <HeroContent>
                <Title>submit article</Title>
            </HeroContent>
        </HeroWrapper>

        <Divider />

        <SelectorWrapper>
            <h6>What type of article is this?</h6>
            <p>Select all that apply</p>
            <TypeSelector onSelect={handleSelectedType} selectedTypes={selectedTypes} />
        </SelectorWrapper>

        {/* <SelectorWrapper>
            <h6>What is the difficulty?</h6>
            <p>Select just one</p>
            <LevelSelector level={level} onSelectLevel={(level) => setLevel(level)} />
        </SelectorWrapper> */}

        <ArticleImageSelector image={image} onSelectImage={(image) => setImage(image)} />

        {!audioURL && (
            <AudioWrapper>
                <label htmlFor='audio'>Audio file upload (mp3 only)</label>
                <input type='file' name='audio' accept='audio/mp3' onChange={handleSelectedFile} />
            </AudioWrapper>
        )}

        <Input type="text" name="url" placeholder="url of original article" required onChange={handleFormState} />
        <Input type="text" name="title" placeholder="title of the article" required onChange={handleFormState} />
        <Input type="text" name="transcriptId" placeholder="the id of the transcript from Sonix" required onChange={handleFormState} />
        <TextareaAutosize style={textAreaStyles} minRows={10} name='article' placeholder='the summarized, translated article' required onChange={handleFormState} />

        <div>
            <label htmlFor='free'>Article is free?</label>
            <Checkbox type='checkbox' name='free' checked={formState.free || false} onChange={handleCheckboxChange} />
        </div>

        <Button onClick={handleClick} disabled={saving || !formIsFilled}>Submit article</Button>

        </Container>
        </>
    );
}

export default SubmitPage;

const AudioWrapper = styled.div`
    margin-bottom: 30px;
`;
const SelectorWrapper = styled.div`
    h6 {
        font-size: 20px;
        margin-bottom: 0;
    }

    p {
        margin: 0 0 15px 0;
    }
`;
