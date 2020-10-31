import React from 'react';
import styled from 'styled-components';

const LoadingPage = () => {
    return (
        <FullPageWrapper>
            Loading...
        </FullPageWrapper>
    )
}

export default LoadingPage;

const FullPageWrapper = styled.div`
    height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;
