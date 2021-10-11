import React, {useContext} from 'react';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import {
    Container,
    Colors
} from '../components/styled';
import useGuardRoute from '../hooks/useGuardRoute';
import AppContext from '../contexts/appContext';
import useWindowSize from '../hooks/useWindowSize';


function DictionaryPage () {
    useGuardRoute();

    const router = useRouter();
    const {user, userHasProPlan} = useContext(AppContext);

    return (
        <Container>

        </Container>
    );
}

export default DictionaryPage;

