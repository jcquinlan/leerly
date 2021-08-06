import React from 'react';
import styled from 'styled-components';
import Colors from './styled/colors';

const LevelSelector = ({level, onSelectLevel}) => {
    return (
        <Levels>
            <Level selected={level === 'a1'} onClick={() => onSelectLevel('a1')}>
                A1
            </Level>

            <Level selected={level === 'a2'} onClick={() => onSelectLevel('a2')}>
                A2
            </Level>

            <Level selected={level === 'b1'} onClick={() => onSelectLevel('b1')}>
                B1
            </Level>

            <Level selected={level === 'b2'} onClick={() => onSelectLevel('b2')}>
                B2
            </Level>

            <Level selected={level === 'c1'} onClick={() => onSelectLevel('c1')}>
                C1
            </Level>

            <Level selected={level === 'c2'} onClick={() => onSelectLevel('c2')}>
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