import React from 'react';
import styled from 'styled-components';
import {motion} from 'framer-motion';
import { devices } from './styled';

const translate1 = [0, -10, 0, 0, 0, 0, 0, 0, 0];
const translate2 = [0, 0, -10, 0, 0, 0, 0, 0, 0];
const translate3 = [0, 0, 0, -10, 0, 0, 0, 0, 0];
const translate4 = [0, 0, 0, 0, -10, 0, 0, 0, 0];
const translate5 = [0, 0, 0, 0, 0, -10, 0, 0, 0];
const translate6 = [0, 0, 0, 0, 0, 0, -10, 0, 0];
const translate7 = [0, 0, 0, 0, 0, 0, 0, -10, 0];

const getTranslateY = (index) => {
    return [
        translate1,
        translate2,
        translate3,
        translate4,
        translate5,
        translate6,
        translate7,
    ][index];
}

const buildAnimation = (index) => {
    return {
        translateY: getTranslateY(index)
    }
}

const transition = {
    duration: 1.5,
    ease: "easeInOut",
    times: [0, 0.1, 0.2, 0.3, 0.4, .5, .6, .7],
    loop: Infinity,
    repeatDelay: .5
};
const LoadingSpinner = () => {
    const letters = 'leerly.'.split('');

    return (
        <Spinner>
            {letters.map((letter, index) => {
                return <motion.div animate={buildAnimation(index)} transition={transition}>{letter}</motion.div>
            })}
        </Spinner>
    )
}

export default LoadingSpinner;

const Spinner = styled.div`
    font-family: Poppins, sans-serif;
    font-size: 34px;
    display: flex;

    @media ${devices.tablet} {
        font-size: 48px;
    }
`;
