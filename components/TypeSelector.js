import React from 'react';
import styled from 'styled-components';
import {ArticleTypeList} from '../services/articleService';

const TypeSelector = ({onSelect, selectedTypes}) => {
    return (
        <TypeSelectorWrapper>
            <h6>What type of article is this?</h6>
            <p>Select all that apply</p>

            {ArticleTypeList.map(type => {
                return (
                    <Pill
                        key={type.type}
                        selected={selectedTypes.includes(type.type)}
                        onClick={() => onSelect(type.type)}>
                        {type.display}
                    </Pill>
                );
            })}
        </TypeSelectorWrapper>
    )
};

const TypeSelectorWrapper = styled.div`
    margin-bottom: 30px;

    h6 {
        font-size: 20px;
        margin-bottom: 0;
    }

    p {
        margin: 0 0 15px 0;
    }
`;
const Pill = styled.div`
    display: inline-flex;
    padding: 15px 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 15px;
    margin-bottom: 10px;
    user-select: none;

    ${props => props.selected ? `
        background-color: #1f4ab8; 
        color: #fff;
    `: ''}
`;




export default TypeSelector;
