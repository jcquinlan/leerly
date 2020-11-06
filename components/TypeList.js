import React from 'react';
import styled from 'styled-components';
import {ArticleTypes} from '../services/articleService';

const TypeList = ({types}) => {
    return (
        <TypeListWrapper>
            <span>Genres: </span>
            {types.map(type => {
                return ArticleTypes[type];
            }).join(', ')}
        </TypeListWrapper>
    )
}

export default TypeList;

const TypeListWrapper = styled.div`
    margin-bottom: 15px;

    span {
        font-size: 16px;
        font-weight: bold;
    }
`;