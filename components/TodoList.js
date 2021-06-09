import React, { useContext } from 'react';
import styled from 'styled-components';
import appContext from '../contexts/appContext';
import { useLocalStorage, ONE_TRANSLATION_DONE_KEY } from '../hooks/useLocalStorage';

const TodoList = ({readStatuses, playTime, level}) => {
    const {userProfileIsComplete} = useContext(appContext);
    const [wordWasTranslated] = useLocalStorage(ONE_TRANSLATION_DONE_KEY, false)
    const minutesListened = playTime / 60
    const articlesRead = Object.keys(readStatuses).length;

    return (
        <TodoCard>
            <h5>Getting started</h5>
            <ul>
                <Goal complete={articlesRead >= 1}>Mark an article as "read"</Goal>
                <Goal complete={wordWasTranslated}>Translate a word</Goal>
                <Goal complete={minutesListened >= 5}>Listen to 5 minutes of audio</Goal>
                <Goal complete={userProfileIsComplete}>Fill out your profile</Goal>
                <Goal complete={level >= 3}>Get to level 3</Goal>
            </ul>
        </TodoCard>
    )
}

export default TodoList;

const TodoCard = styled.div`
    background: rgb(31,74,184);
    background: linear-gradient(157deg, rgba(31,74,184,1) 0%, rgba(63,199,143,1) 100%);
    color: #fff;
    border-radius: 8px;
    padding: 15px;
    max-width: 250px;

    h5 {
        margin: 0;
        margin-bottom: 10px;
        text-align: center;
        font-size: 20px;
    }

    ul {
        margin: 0;
        padding-left: 20px;
    }
`;

const Goal = styled.li`
    margin-bottom: 10px;
    ${props => props.complete ? `
        text-decoration: line-through; 
    `: ``}
`;