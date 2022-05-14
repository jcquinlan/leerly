import React, { useMemo } from 'react';
import styled from 'styled-components';
import { QuestionTypes } from 'types';
import { Card } from './styled';

const QuestionsCard = styled(Card)`
    margin-top: 60px;
    padding: 30px;
    border-radius: 10px;
`;
const QuestionsTitle = styled.h3`
    font-size: 24px;
    margin: 0;
    margin-bottom: 15px;
`;
const QuestionText = styled.h4`
    margin: 0;
    font-size: 18px;
    font-weight: 300;
`;
const Question = styled.div`
    margin-bottom: 15px;
`;
const QuestionOptionList = styled.ul`
    margin: 0;
    margin-top: 10px;

    li {
        font-size: 18px;
        margin-bottom: 5px;
    }
`;

const buildOpenEndedQuestion = (question, index) => {
    if (question.type !== QuestionTypes.OPEN_ENDED) return null;

    return (
        <Question>
            <QuestionText>{index}.) {question.text}</QuestionText>
        </Question>
    )
};

const buildMultiChoiceQuestion = (question, index) => {
    if (question.type !== QuestionTypes.MULTI_CHOICE) return null;

    return (
        <Question>
            <QuestionText>{index}.) {question.text}</QuestionText>
            <QuestionOptionList>
                {question.metadata.options.map(option => {
                    return <li>{option.text}</li>
                })}
            </QuestionOptionList>
        </Question>
    )
};

const ArticleQuestions = ({questions}) => {

    console.log(questions);

    const questionCards = useMemo(() => {
        return questions.map((question, index) => {
            return question.type === QuestionTypes.OPEN_ENDED ?
                buildOpenEndedQuestion(question, index + 1) :
                buildMultiChoiceQuestion(question, index + 1);
        });
    }, [questions]);

    return (
        <QuestionsCard>
            <QuestionsTitle>Questions</QuestionsTitle>
            <div>
                {questionCards}
            </div>
        </QuestionsCard>
    )
}

export default ArticleQuestions;