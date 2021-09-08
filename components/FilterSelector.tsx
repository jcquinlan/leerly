import React from 'react';
import Select from 'react-select';
import {ArticleTypeList} from '../services/articleService';
import {ArticleType} from 'types';

interface FilterSelectorProps {
    onChange: (selectedArticleTypes: ArticleType[]) => void;
}
const FilterSelector = ({onChange}: FilterSelectorProps) => {
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
            style={{fontWeight: 300}}
        />
    )
}

export default FilterSelector;
