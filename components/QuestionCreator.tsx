import React, {ChangeEvent, useState, useMemo} from 'react';
import {v4 as uuid} from 'uuid';
import styled from 'styled-components';
import {Card, Input, Button, Colors} from 'components/styled';
import {QuestionTypes, Question, QuestionOptionId, QuestionTypesDisplay} from 'types';

const generateMetadataForQuestionType = (type: QuestionTypes) => {
    switch (type) {
        case QuestionTypes.MULTI_CHOICE:
            return {
                options: [],
                answer: null
            }
        case QuestionTypes.OPEN_ENDED:
            return {};
    }
};

const QuestionCreator = ({questions, setQuestions}) => {
    const [newQuestion, setNewQuestion] = useState<Question | null>(null);
    const [newOption, setNewOption] = useState<string>('');
    const [selectedType, setSelectedType] = useState<QuestionTypes>(QuestionTypes.MULTI_CHOICE);

    const handleNewQuestion = () => {
        setNewQuestion({
            id: uuid(),
            type: selectedType,
            text: '',
            metadata: generateMetadataForQuestionType(selectedType)
        });
    }

    const handleNewQuestionTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newText = e.target.value;
        setNewQuestion(currentNewQuestion => ({...currentNewQuestion, text: newText}));
    }

    const handleNewOption = (e: ChangeEvent<HTMLInputElement>) => {
        setNewOption(e.target.value);
    }

    const setOptionAsAnswer = (id: QuestionOptionId) => {
        setNewQuestion(currentNewQuestion => {
            return {
                ...currentNewQuestion,
                metadata: {
                    ...currentNewQuestion.metadata,
                    answer: id
                }
            }
        });
    }

    const saveOption = () => {
        const newOptionObject = {
            id: uuid(),
            text: newOption
        };

        setNewQuestion(currentQuestion => {
            if (!currentQuestion.metadata.options) {
                return currentQuestion;
            }

            return {
                ...currentQuestion,
                metadata: {
                    ...currentQuestion.metadata,
                    options: [...currentQuestion.metadata.options, newOptionObject]
                }
            }
        });
        setNewOption('');
    }

    const toggleQuestionType = () => {
        setNewQuestion(currentNewQuestion => {
            const newType = currentNewQuestion.type === QuestionTypes.MULTI_CHOICE ?
                QuestionTypes.OPEN_ENDED :
                QuestionTypes.MULTI_CHOICE;

            return {
                ...currentNewQuestion,
                type: newType,
                metadata: generateMetadataForQuestionType(newType)
            }
        })
    }

    const saveQuestion = () => {
        setQuestions(currentQuestions => [...currentQuestions, newQuestion]);
        setNewQuestion(null);
    }

    const deleteQuestion = (questionId: string) => {
        setQuestions(currentQuestions => currentQuestions.filter(question => question.id !== questionId));
    }

    const isNewQuestionValid = useMemo(() => {
        if (!newQuestion) {
            return false;
        }

        if (newQuestion.type === QuestionTypes.OPEN_ENDED) {
            return !!newQuestion.text;
        }

        if (newQuestion.type === QuestionTypes.MULTI_CHOICE) {
            return !!newQuestion.text &&
                newQuestion.metadata.options?.length > 1 &&
                !!newQuestion.metadata.answer;
        }

        return false;
    }, [newQuestion]);

    return (
        <Wrapper>
            <h3>Questions</h3>
            {!questions.length && (
                <p>Please add at least 1 open-ended question</p>
            )}

            {!!questions.length && (
                <QuestionList>
                    {questions.map(question => {
                        return <QuestionPreview>
                            <div>
                                {question.text}
                            </div>

                            <div>
                                <DeleteButton onClick={() => deleteQuestion(question.id)}>X</DeleteButton>
                            </div>
                        </QuestionPreview>
                    })}
                </QuestionList>
            )}

            {!newQuestion && (
                <div>
                    <Button onClick={handleNewQuestion}>Add question</Button>
                </div>
            )}

            {!!newQuestion && (
                <QuestionCard>
                    <QuestionCardHeader>
                        <h5>Question type: {QuestionTypesDisplay[newQuestion.type]}</h5>
                        <div>
                            <Button style={{marginRight: 10}} secondary onClick={toggleQuestionType}>Change question type</Button>
                            <Button secondary onClick={() => setNewQuestion(null)}>Cancel</Button>
                        </div>
                    </QuestionCardHeader>

                    <Input type="text" placeholder="What is the question?" value={newQuestion.text} onChange={handleNewQuestionTextChange} />

                    {newQuestion.type === QuestionTypes.MULTI_CHOICE && (
                        <>
                            {newQuestion.metadata.options && newQuestion.metadata.options.length ?
                                <OptionHeader>Options <small>Select the correct answer</small>:</OptionHeader> :
                                null
                            }

                            <OptionsList>
                                {newQuestion.metadata.options && newQuestion.metadata.options.map(option => {
                                    const isOptionTheAnswer = option.id === newQuestion.metadata.answer;
                                    return (
                                        <Option selected={isOptionTheAnswer} onClick={() => setOptionAsAnswer(option.id)}>
                                            {option.text}
                                        </Option>
                                    )
                                })}
                            </OptionsList>

                            <NewOptionContainer>
                                <Input type="text" name="optiontext" placeholder="Add option" value={newOption} onChange={handleNewOption} />
                                <Button disabled={!newOption} onClick={saveOption}>Add</Button>
                            </NewOptionContainer>
                        </>
                    )}

                    <QuestionCardFooter>
                        <Button disabled={!isNewQuestionValid} onClick={saveQuestion}>Save question</Button>
                    </QuestionCardFooter>
                </QuestionCard>
            )}
        </Wrapper>
    )
}

export default QuestionCreator;


const Wrapper = styled.div`
    margin: 30px 0;
`;
const QuestionList = styled.div``;
const QuestionCard = styled(Card)`
    h5 {
        margin: 0;
        margin-bottom: 10px;
        font-size: 16px;
    }
`;
const QuestionCardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
`;
const OptionHeader = styled.h6`
    margin: 0;
    font-size: 16px;

    small {
        font-weight: 300;
        font-size: 12px;
        padding: 0 10px;
    }
`;
const OptionsList = styled.ul`
    list-style-type: none;
    padding-left: 10px;
`;

type OptionProps = {
    selected?: boolean;
}
const Option = styled.li<OptionProps>`
    cursor: pointer;
    border-radius: 8px;
    padding: 5px 10px;
    transition: 0.3s;

    &:hover {
        ${props => props.selected ? `` : `
            background-color: ${Colors.LightGrey};
            color: #000;
        `}
    }

    ${props => props.selected ? `
        background-color: ${Colors.Primary};
        color: #fff;
    `: ``}
`;
const NewOptionContainer = styled.div`
    display: flex;
    align-items: center;

    ${Input} {
        margin-right: 10px;
        margin-bottom: 0;
    }
`;

const QuestionCardFooter = styled.div`
    margin-top: 10px;
`;

const QuestionPreview = styled(Card)`
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
const DeleteButton = styled.button`
    background-color: ${Colors.LightGrey};
    padding: 5px 10px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
        background-color: ${Colors.Danger};
        color: #fff;
    }
`;