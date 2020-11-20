import React from 'react';
import styled from 'styled-components';
import {Colors} from './index';

const ReadCheck = ({checked}) => {
    return <CheckMark checked={checked}>✓</CheckMark>
}

const CheckMark = styled.div`
    margin-right: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    background-color: ${Colors.LightGrey};
    color: ${Colors.MediumGrey};

    ${props => props.checked ? `
        background-color: ${Colors.Green};
        color: #fff; 
    `: ''}
`;

export default ReadCheck;
