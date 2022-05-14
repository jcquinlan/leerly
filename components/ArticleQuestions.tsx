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
    margin-bottom: 30px;
`;
const QuestionText = styled.h4`
    margin: 0;
    font-size: 18px;
    font-weight: 300;
    line-height: 28px;
`;
const Question = styled.div`
    margin-bottom: 30px;
`;
const QuestionOptionList = styled.ul`
    margin: 0;
    margin-top: 10px;
    padding-left: 20px;

    li {
        font-size: 18px;
        margin-bottom: 10px;
    }
`;
const QuestionTextWrapper = styled.div`
    display: flex;
`;
const QuestionIndex = styled.div`
    margin-right: 10px;
    font-size: 24px;
    margin-top: 5px;
`;

const buildQuestion = (question, index) => {
    const isMultiChoice = question.type === QuestionTypes.MULTI_CHOICE;

    return (
        <Question>
            <QuestionTextWrapper>
                <QuestionIndex>
                    {index}.)
                </QuestionIndex>
                <div>
                    <QuestionText>{question.text}</QuestionText>

                    {isMultiChoice && (
                        <QuestionOptionList>
                            {question.metadata.options.map(option => {
                                return <li>{option.text}</li>
                            })}
                        </QuestionOptionList>
                    )}
                </div>
            </QuestionTextWrapper>
        </Question>
    )
};

const ArticleQuestions = ({questions}) => {

    const questionCards = useMemo(() => {
        return questions.map((question, index) => {
            return buildQuestion(question, index + 1);
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