import React from 'react';
import styled from 'styled-components';
import {Colors} from './styled';
import {ArticleTypeList} from '../services/articleService';

const TypeSelector = ({onSelect, selectedTypes}) => {
    return (
        <TypeSelectorWrapper>
            {ArticleTypeList.map(type => {
                const selected = selectedTypes.includes(type.type);

                return (
                    <TypePill
                        key={type.type}
                        selected={selected}
                        color={selected ? Colors.ArticleTypes.copy[type.type] : null}
                        backgroundColor={selected ? Colors.ArticleTypes.background[type.type] : null}
                        onClick={() => onSelect(type.type)}>
                        {type.display}
                    </TypePill>
                );
            })}
        </TypeSelectorWrapper>
    )
};

const TypeSelectorWrapper = styled.div`
    margin-bottom: 30px;
`;

const TypePill = styled.div`
    display: inline-block;
    background-color: ${props => props.backgroundColor || '#eee'};
    color: ${props => props.color || '#000'};
    margin-right: 5px;
    padding: 5px 15px;
    border-radius: 20px;
    margin-top: 5px;
    cursor: pointer;
`;




export default TypeSelector;
