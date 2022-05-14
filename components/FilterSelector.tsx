import React from 'react';
import styled from 'styled-components';
import Select, { components } from 'react-select';
import { ArticleTypeList } from '../services/articleService';
import { ArticleType } from 'types';
import { Colors } from './styled';

const customStyles = {
    multiValue: (styles, { data }) => {
        return {
            ...styles,
            backgroundColor: Colors.ArticleTypes.background[data.value],
            borderRadius: '20px',
            paddingLeft: 5
        };
    },
    multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: Colors.ArticleTypes.copy[data.value]
    }),
    multiValueRemove: (styles, { data }) => ({
        ...styles,
        borderRadius: '0 20px 20px 0',
        cursor: 'pointer'
    })
}

interface FilterSelectorProps {
    onChange: (selectedArticleTypes: ArticleType[]) => void;
}
const FilterSelector = ({ onChange }: FilterSelectorProps) => {
    const options = ArticleTypeList.map((entry) => {
        return {
            value: entry.type,
            label: entry.display
        };
    });

    return (
        <Select
            options={options}
            isMulti
            isClearable
            onChange={onChange}
            placeholder="Select up to 10 filters..."
            style={{ fontWeight: 300 }}
            styles={customStyles}
        />
    )
}

export default FilterSelector;

const GenrePill = styled.div<{ backgroundColor: string }>`
    padding: 5px 7px;
    border-radius: 20px;
    color: ${props => props.color};
    backgroundColor: ${props => props.backgroundColor};
`;