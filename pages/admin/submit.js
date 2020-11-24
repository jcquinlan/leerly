import React, {useState, useMemo, useContext} from 'react';
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
import AppContext from '../../contexts/appContext';
import {createNewArticle} from '../../services/articleService';

import TextareaAutosize from 'react-textarea-autosize';

function SubmitPage () {
    useGuardAdminRoute();

    const router = useRouter();
    const {addToast} = useToasts();
    const {user} = useContext(AppContext);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [formState, setFormState] = useState({});
    const formIsFilled = useMemo(() => {
        return !!(formState.article && formState.url);
    }, [formState]);

    const handleClick = async () => {
        createNewArticle({
            added_by: user.uid,
            body: formState.article,
            url: formState.url,
            title: formState.title,
            free: formState.free || false,
            types: selectedTypes
        })
        .then((article) => {
            addToast('Article submitted', {appearance: 'success'});
            router.push(`/articles/${article.id}`);
        })
        .catch(() => {
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

        <TypeSelector onSelect={handleSelectedType} selectedTypes={selectedTypes} />
        <Input type="text" name="url" placeholder="url of original article" required onChange={handleFormState} />
        <Input type="text" name="title" placeholder="title of the article" required onChange={handleFormState} />
        <TextareaAutosize style={textAreaStyles} minRows={10} name='article' placeholder='the summarized, translated article' required onChange={handleFormState} />

        <div>
            <label for='free'>Article is free?</label>
            <Checkbox type='checkbox' name='free' checked={formState.free || false} onChange={handleCheckboxChange} />
        </div>

        <Button onClick={handleClick} disabled={!formIsFilled}>Submit article</Button>

        </Container>
        </>
    );
}

export default SubmitPage;
