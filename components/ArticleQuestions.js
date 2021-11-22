import e from "cors";
import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { Colors, Subtitle, Button } from "../components/styled";
import { useLocalStorage, REFERRAL_CODE_KEY } from "../hooks/useLocalStorage";

const log = true;

export default function ArticleQuestions(props) {
  const { articleID, questions } = props;

  const [counter, setCounter] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(questions[counter]);
  const [activeAnswer, setActiveAnswer] = useState({});

  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    setActiveQuestion(questions[counter])
  }, [counter])

  useEffect(() => {
    if (activeQuestion) {
      let storedAnswer = window.localStorage.getItem(activeQuestion.id) ?? null;
      setActiveAnswer({ questionId: activeQuestion.id, answer: storedAnswer});
    }
  }, [activeQuestion]);

  useEffect(() => {
    window.localStorage.setItem(activeAnswer.questionId, activeAnswer.answer);
  }, [activeAnswer]);

  const handleSubmit = async prevQuest => {
    var { questionId, answer: newAnswer } = activeAnswer;

    // push to answers array
    var allAnswers = await handleAnswers(questionId, newAnswer);
    setAnswers(allAnswers);

    log && console.log('allAnswers', allAnswers);

    // set counter...
    if (prevQuest) setCounter(counter - 1);
    else if (questionId && newAnswer && (counter + 1 !== questions.length)) {
      setCounter(counter + 1);
    }
  };

  const handleAnswers = async (questionId, newAnswer) => {
    var allAnswers = [...answers];
    var answerId;

    if (allAnswers.length > 0) allAnswers.map((ans, i) => {
      if (ans.questionId == questionId) {
        answerId = i;
      } 
    });

    if (answerId >= 0) allAnswers[answerId].answer = newAnswer;
    else allAnswers.push({ questionId: questionId, answer: newAnswer });

    return allAnswers;
  };

  return (
    <QuestionsContainer>
      <QuestionsWrapper>
        <QuestionsCounter>
          {counter + 1} / {questions.length}
        </QuestionsCounter>

        <Divider />

        <Subtitle>{activeQuestion.text}</Subtitle>

        <QuestionForm
          activeQuestion={activeQuestion}
          activeAnswer={activeAnswer}
          setActiveAnswer={setActiveAnswer}
        />

        <ButtonsWrapper>
          <div style={{ margin: "15px 0px 5px 0px" }}>
            <Button 
              type="secondary" 
              onClick={() => handleSubmit()}
              disabled={!activeAnswer.answer}
            >
              {counter < questions.length - 1
                ? "Next Question"
                : "Submit Answers"}
            </Button>
          </div>
          {counter > 0 && (
            <PreviousButton onClick={() => handleSubmit(true)}>
              Previous Question
            </PreviousButton>
          )}
        </ButtonsWrapper>
      </QuestionsWrapper>
    </QuestionsContainer>
  );
}

const QuestionForm = (props) => {
  const { activeQuestion, activeAnswer, setActiveAnswer } = props;
  const { id, type, metadata } = activeQuestion;

  if (metadata && metadata.choices) {
    return metadata.choices.map((choice) => {
      return (
        <Choice>
          <RadioButton
            type="radio"
            name="radio"
            value={choice ? choice : activeAnswer}
            checked={activeAnswer === choice}
            onChange={() =>
              setActiveAnswer({
                questionId: id,
                answer: choice,
              })
            }
          />
          <p> {choice} </p>
        </Choice>
      );
    });
  } else {
    return (
      <OpenAnswerWrapper>
        <textarea
          rows={4}
          value={activeAnswer.answer ?? ''}
          placeholder="Write however much or little you'd like."
          onChange={(event) =>
            setActiveAnswer({
              questionId: id,
              answer: event.target.value,
            })
          }
        />
      </OpenAnswerWrapper>
    );
  }
};

const QuestionsContainer = styled.div`
  display: inline-flex;
  background: rgba(196, 196, 196, 0.15);
  position: relative;
  justify-content: center;
  width: 100vw;
  margin: 30px 0px 30px -50vw;
  padding: 20px 0px 40px 0px;
  left: 50%;
`;

const QuestionsWrapper = styled.div`
  overflow-wrap: break-word;
  width: 50%;
`;

const QuestionsCounter = styled.p`
  transform: scale(0.8);
  text-align: center;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${Colors.MediumGrey};
  margin: 25px auto;
`;

const OpenAnswerWrapper = styled.div`
  textarea {
    width: 100%;
    padding: 10px;
    background-color: #eee;
    border: 1px solid #ddd;
    outline: 0;
    border-radius: 8px;
    font-size: 16px;
    line-height: 24px;
    &:focused {
      border-color: ${Colors.Primary};
    }
  }
`;

const ButtonsWrapper = styled.div`
  display: relative;
  text-align: center;
  margin: 0 auto;
`;

const PreviousButton = styled.button`
  border: none;
`;

const Choice = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
  position: relative;
  border: 1px solid #ccc;
  box-sizing: border-box;
  border-radius: 2px;
  margin-bottom: 10px;
`;

const RadioButtonLabel = styled.label`
  position: absolute;
  top: 25%;
  left: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 1px solid #ccc;
`;

const RadioButton = styled.input`
  opacity: 0;
  z-index: 1;
  cursor: pointer;
  width: 25px;
  height: 25px;
  margin-right: 10px;
  &:hover ~ ${RadioButtonLabel} {
    background: ${Colors.Primary};
    &::after {
      content: "\f005";
      font-family: "FontAwesome";
      display: block;
      color: white;
      width: 12px;
      height: 12px;
      margin: 4px;
    }
  }
  &:checked + ${Choice} {
    background: yellowgreen;
    border: 2px solid yellowgreen;
  }
  &:checked + ${RadioButtonLabel} {
    background: yellowgreen;
    border: 1px solid yellowgreen;
    &::after {
      content: "\f005";
      font-family: "FontAwesome";
      display: block;
      color: white;
      width: 12px;
      height: 12px;
      margin: 4px;
    }
  }
`;
