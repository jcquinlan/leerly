import React from 'react';
import styled from 'styled-components';
import Colors from './styled/colors';
import {UserLevels} from '../constants';

const LevelSelector = ({level, onSelectLevel}) => {
    return (
        <Levels>
            <Level selected={level === UserLevels.A1} onClick={() => onSelectLevel(UserLevels.A1)}>
                A1
            </Level>

            <Level selected={level === UserLevels.A2} onClick={() => onSelectLevel(UserLevels.A2)}>
                A2
            </Level>

            <Level selected={level === UserLevels.B1} onClick={() => onSelectLevel(UserLevels.B1)}>
                B1
            </Level>

            <Level selected={level === UserLevels.B2} onClick={() => onSelectLevel(UserLevels.B2)}>
                B2
            </Level>

            <Level selected={level === UserLevels.C1} onClick={() => onSelectLevel(UserLevels.C1)}>
                C1
            </Level>

            <Level selected={level === UserLevels.C2} onClick={() => onSelectLevel(UserLevels.C2)}>
                C2
            </Level>
        </Levels>
    )
};

export default LevelSelector;

const Levels = styled.div``;
const Level = styled.div`
    display: inline-block;
    border: 1px solid #eee;
    border-radius: 50px;
    cursor: pointer;
    padding: 10px 20px;
    margin-right: 10px;
    margin-bottom: 10px;

    ${props => props.selected ? `
        background-color: ${Colors.Primary};
        color: #fff;
    `: ``}

    &:hover {
        background-color: ${props => props.selected ? Colors.Primary : Colors.PrimaryLight};
    }
`;