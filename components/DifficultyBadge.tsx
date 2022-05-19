import React from 'react';
import styled from 'styled-components';
import { Colors } from './styled';

const Badge = styled.div`
    border-radius: 8px;
    color: ${Colors.MediumGrey};
    background-color: ${Colors.LightGrey};
    padding: 10px;
    display: inline-block;
`;

interface DifficultyBadgeProps {
    difficulty: string;
}
const DifficultyBadge = ({difficulty}: DifficultyBadgeProps) => {
    if (!difficulty) return null;

    return (
        <Badge>
            {difficulty.toUpperCase()}
        </Badge>
    )
};

export default DifficultyBadge;