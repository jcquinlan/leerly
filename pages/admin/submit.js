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
    Input
} from '../../components/styled';
import TextArea from '../../components/TextArea';
import TypeSelector from '../../components/TypeSelector';
import AppContext from '../../contexts/appContext';
import {createNewArticle} from '../../services/articleService';

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
            types: selectedTypes
        })
        .then((article) => {
            addToast('Article submitted', {appearance: 'success'});
            router.push(`/articles/${article.id}`);
        })
        .catch(() => {
            addToast('Article submitted', {appearance: 'error'});
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
        <TextArea name='article' placeholder='the summarized, translated article' required onChange={handleFormState} />
        <Button onClick={handleClick} disabled={!formIsFilled}>Submit article</Button>

        </Container>
        </>
    );
}

export default SubmitPage;
