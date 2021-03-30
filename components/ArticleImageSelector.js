import React, {useState} from 'react';
import styled from 'styled-components';
import {Input, Button, ImageWrapper, ImageAttribution} from './styled';
import {queryUnsplash} from '../services/unsplashService';

export const generateUnsplashUserLink = (image) => {
    const url = image ? `${image.user.profile}?utm_source=leerly&utm_medium=referral` : '';
    return <a href={url} target='_blank'>{image.user.name}</a>
};

const ArticleImageSelector = ({image, onSelectImage}) => {
    const [images, setImages] = useState([]);
    const [query, setQuery] = useState('');

    const searchImages = async () => {
        const images = await queryUnsplash(query);
        setImages(images.results);
        onSelectImage(images.results[0]);
    }

    const setDifferentImage = () => {
        if (!images.length) return;
        const randomImageIndex = Math.floor(Math.random() * images.length);
        onSelectImage(images[randomImageIndex]);
    }

    const imageUserURL = image ? `${image.user.profile}?utm_source=leerly&utm_medium=referral` : '';

    return (
        <ArticleImageSelectorWrapper>
            <div>
                <label for='query'>Search for an image</label>
                <Input name='query' type='text' onChange={(event) => setQuery(event.target.value)} />
                <Button disabled={!query} onClick={() => searchImages()}>Search</Button>
            </div>

            {image && (
                <>
                <ImageWrapper>
                    <img src={image.urls.regular} />
                </ImageWrapper>
                <ImageAttribution>Image from Unsplash, credit to <a href={imageUserURL} target='_blank'>{image.user.name}</a></ImageAttribution>
                {!!images.length && <Button onClick={setDifferentImage}>Try a different {query} image</Button>}
                </>
            )}
        </ArticleImageSelectorWrapper>
    )
}

export default ArticleImageSelector;

const ArticleImageSelectorWrapper = styled.div`
    margin: 30px 0;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 15px;
`;
