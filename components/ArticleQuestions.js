import e from "cors";
import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";

import appContext from '../contexts/appContext';
import { createNewAnswers } from '../services/answersService';
import { Colors, Subtitle, Button } from "../components/styled";

const log = true;

export default function ArticleQuestions(props) {
  const { articleId, questions } = props;
  const {user} = useContext(appContext);

  const [counter, setCounter] = useState(0);
  const [publish, setPublish] = useState(true);

  const [activeQuestion, setActiveQuestion] = useState(questions[counter]);
  const [activeAnswer, setActiveAnswer] = useState({});
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    console.log("PUBLISH", publish);
  }, [publish]);

  useEffect(() => {
    setActiveQuestion(questions[counter]);
  }, [counter]);

  useEffect(() => {
    if (activeQuestion) {
      let storedAnswer = window.localStorage.getItem(activeQuestion.id) ?? "";
      setActiveAnswer({ questionId: activeQuestion.id, answer: storedAnswer });
    }
  }, [activeQuestion]);

  useEffect(() => {
    log && console.log("activeAnswer", activeAnswer);
    window.localStorage.setItem(activeAnswer.questionId, activeAnswer.answer);
  }, [activeAnswer]);

  // LOGIC //////////////////////////////////////////////////////////////////
  const handleNextQuestion = async (prevQuest) => {
    var { questionId, answer: newAnswer } = activeAnswer;

    // push to allAnswers array
    const allAnswers = await handleAnswers(questionId, newAnswer);
    allAnswers && setAnswers(allAnswers)

    // set counter...
    if (prevQuest) setCounter(counter - 1); // previous question 
    else if (questionId && newAnswer && counter + 1 !== questions.length) {
      setCounter(counter + 1); // next question
    } else handleSubmitAnswers(allAnswers); // submit answers
  };

  const handleAnswers = async (questionId, newAnswer) => {
    var allAnswers = [...answers];
    var answerId;

    if (allAnswers.length > 0)
      allAnswers.map((ans, i) => {
        if (ans.questionId == questionId) {
          answerId = i;
        }
      });

    if (answerId >= 0) allAnswers[answerId].answer = newAnswer;
    else allAnswers.push({ questionId: questionId, answer: newAnswer });

    return allAnswers;
  };

  const handleSubmitAnswers = async allAnswers => {
    const { uid = '' } = user;

    if (allAnswers && Array.isArray(allAnswers) ) {
      try {
        let res = await createNewAnswers({ uid, articleId, publish, allAnswers });
        log && console.log('createNewAnswers response:', res)
      } catch(err) {
        console.log('Error posting answers to database:', err)
        return
      }
    }

  };

  // RENDER //////////////////////////////////////////////////////////////////
  return (
    <QuestionsContainer>
      <QuestionsWrapper>
        <QuestionsCounter>
          {counter + 1} / {questions.length}
        </QuestionsCounter>

        <Divider />

        {/* QUESTION & BODY */}
        <Subtitle>{activeQuestion.text}</Subtitle>
        <QuestionForm
          activeQuestion={activeQuestion}
          activeAnswer={activeAnswer}
          setActiveAnswer={setActiveAnswer}
        />

        <ButtonsWrapper>

          {/* PUBLISH ANSWERS TOGGLE */}
          {counter == questions.length - 1 && (
            <ToggleWrapper>
              <ToggleLabel {...{ publish, priv: true }}>Keep Answers Private</ToggleLabel>
              <ToggleContainer>
                <ToggleSlider
                  {...{ publish }}
                  onClick={() => setPublish(!publish)}
                />
              </ToggleContainer>
              <ToggleLabel {...{ publish, priv: false }}>Make Answers Public</ToggleLabel>
            </ToggleWrapper>
          )}

          {/* NEXT QUESTION / SUBMIT ANSWERS */}
          <div style={{ margin: "15px 0px 5px 0px" }}>
            <Button
              type="secondary"
              onClick={() => handleNextQuestion()}
              disabled={!activeAnswer.answer}
            >
              {counter < questions.length - 1
                ? "Next Question"
                : "Submit Answers"}
            </Button>
          </div>

          {/* PREVIOUS QUESTION */}
          {counter > 0 && (
            <PreviousButton onClick={() => handleNextQuestion(true)}>
              Previous Question
            </PreviousButton>
          )}
        </ButtonsWrapper>
      </QuestionsWrapper>
    </QuestionsContainer>
  );
}

// COMPONENTS /////////////////////////////////////////////////////////////

const QuestionForm = (props) => {
  const { activeQuestion, activeAnswer, setActiveAnswer } = props;
  const { id, type, metadata } = activeQuestion;

  if (metadata && metadata.choices) {
    return metadata.choices.map((choice) => {
      return (
        <RadioButtonWrapper>
          <RadioButton
            type="radio"
            name="radio"
            checked={activeAnswer.answer === choice}
            value={activeAnswer.answer}
            onChange={() =>
              setActiveAnswer({
                questionId: id,
                answer: choice,
              })
            }
          />
          <RadioButtonLabel />
          <p style={{ marginLeft: "0.5rem" }}> {choice} </p>
        </RadioButtonWrapper>
      );
    });
  } else {
    return (
      <OpenAnswerWrapper>
        <textarea
          rows={4}
          value={activeAnswer.answer}
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
  @media screen and (max-width: 600px) {
    width: 80%;
  }
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

const RadioButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const RadioButtonLabel = styled.label`
  position: absolute;
  left: 4px;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  background: white;
  border: 1px solid #ccc;
`;

const RadioButton = styled.input`
  opacity: 0;
  z-index: 1;
  width: 1.8rem;
  height: 1.8rem;
  cursor: pointer;
  margin-right: 10px;
  &:hover ~ ${RadioButtonLabel} {
    background: ${Colors.Primary};
    border: 0.3rem solid #ccc;
  }
  &:checked + ${RadioButtonLabel} {
    background: ${Colors.Primary};
    border: 0.3rem solid #ccc;
  }
`;

const ToggleWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  margin: 0.5rem;
`;

const ToggleLabel = styled.p`
  margin: 0.3rem; 
  transform: scale(0.9);
  font-weight: 800;
  color: ${({ publish, priv }) => (publish && !priv ? Colors.Primary : (!publish && priv) ?  Colors.Primary : '')};
`

const ToggleContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  background-color: ${({ publish }) => (publish ? Colors.Primary : "white")};
  border-radius: 15px;
  border: 1px solid #ccc;
  transition: 0.4s;
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ publish }) => (publish ? Colors.Primary : "white")};
  border-radius: 15px;
  transition: 0.4s;
  &:before {
    content: "";
    position: absolute;
    top: 1px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    width: 19px;
    height: 19px;
    border-radius: 100%;
    background-color: ${({ publish }) => (publish ? "white" : Colors.Primary)};
    transition: 0.4s;
    transform: ${({ publish }) => (publish ? "translateX(23.8px)" : '')};
  }
`;
