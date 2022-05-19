import React from 'react';
import styled from 'styled-components';
import {Colors} from './styled';
import {ArticleTypes} from '../services/articleService';

const TypeList = ({types}) => {
    return (
        <TypeListWrapper>
            <TypeListContainer>
            {
                types.map(type => {
                    return <TypePill
                        key={type}
                        color={Colors.ArticleTypes.copy[type]}
                        backgroundColor={Colors.ArticleTypes.background[type]}>{ArticleTypes[type]}</TypePill>
                })
            }
            </TypeListContainer>
        </TypeListWrapper>
    )
}

export default TypeList;

const TypeListContainer = styled.div``
const TypePill = styled.div`
    display: inline-block;
    background-color: ${props => props.backgroundColor || '#666'};
    color: ${props => props.color || '#000'};
    margin-right: 5px;
    padding: 5px 15px;
    border-radius: 20px;
`;
const TypeListWrapper = styled.div`
    span {
        font-size: 16px;
        font-weight: bold;
    }
`;