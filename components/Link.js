import React, {useContext} from 'react';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import AppContext from '../contexts/appContext';

const Link = ({href, children}) => {
    const router = useRouter();
    const {setNavOpen} = useContext(AppContext);

    const handleClick = () => {
        setNavOpen(false);
        router.push(href);
    };

    return <LinkSpan onClick={handleClick} role="link">{children}</LinkSpan>;
};

const LinkSpan = styled.span`
    display: block;
    margin-bottom: 15px;
    font-size: 24px;
`;

export default Link;