import React from 'react';
import styled from 'styled-components';
import {Button} from '../styled';

export const Modal = ({title, subtitle, children}) => {
    return (
        <ModalWrapper>
            <ModalTitle>{title}</ModalTitle>
            <ModalSubtitle>{subtitle}</ModalSubtitle>

            <ButtonRow>
                {children}
            </ButtonRow>
        </ModalWrapper>
    )
}

const ModalWrapper = styled.div`
    padding: 20px;
`;
const ModalTitle = styled.h6`
    text-align: center;
    font-size: 24px;
    margin: 0;
`;
const ModalSubtitle = styled.p`
    margin-bottom: 30px;
`;

const ButtonRow = styled.div`
    display: flex;
    flex-direction: column;

    ${Button} {
        margin-bottom: 10px;
    }
`;