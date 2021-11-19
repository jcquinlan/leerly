import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Colors, Subtitle, Button } from "../components/styled";

const log = true;

export default function ArticleQuestions(props) {
  const { articleID, questions } = props;

  const [counter, setCounter] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(questions[counter]);

  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    setActiveQuestion(questions[counter]);
  }, [counter]);

  useEffect(() => {
    console.log("answers", answers);
  }, [answers]);

  const handleSubmit = () => {
    // check answered

    if (counter + 1 !== questions.length) {
      setCounter(counter + 1);
      // add to answer state
    } else {
      console.log("END");
      // submit answers to db
      // public private toggle
    }
  };

  const handlePreviousQuestion = () => {
    setCounter(counter - 1);
  };

  const handleAnswers = (questionId, type, answer) => {
    log && console.log("questionId", questionId);
    log && console.log("type", type);
    log && console.log("answer", answer);

    let newAnswers = answers ?? [];

    console.log('new', newAnswers)

    if (newAnswers.length > 0) {
        newAnswers.map((ans, i) => {
            if (ans.questionId === questionId) {
                newAnswers[i].answer = answer;
            } else newAnswers.push({ questionId: questionId, answer: answer});
        })
    } else newAnswers.push({ questionId: questionId, answer: answer});

    // BROKEN // NOT PUSHING CORRECTLY
    setAnswers(newAnswers);
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
          handleAnswers={handleAnswers}
        />

        <ButtonsWrapper>
          <div style={{ margin: "15px 0px 5px 0px" }}>
            <Button type="secondary" onClick={handleSubmit}>
              {counter < questions.length - 1
                ? "Next Question"
                : "Submit Answers"}
            </Button>
          </div>
          {counter > 0 && (
            <PreviousButton onClick={handlePreviousQuestion}>
              Previous Question
            </PreviousButton>
          )}
        </ButtonsWrapper>
      </QuestionsWrapper>
    </QuestionsContainer>
  );
}

const QuestionForm = (props) => {
  const { activeQuestion, handleAnswers } = props;
  const { id, type, metadata } = activeQuestion;

  if (metadata && metadata.choices) {
    return metadata.choices.map((choice) => {
      return (
        <Choice>
          <RadioButton
            type="radio"
            name="radio"
            value={choice}
            // checked={select === choice}
            onChange={() => handleAnswers(id, type, choice)}
          />
          <p> {choice} </p>
        </Choice>
      );
    });
  } else {
    let openAnswer;

    return (
      <OpenAnswerWrapper>
        <textarea
          onChange={(event) => handleAnswers(id, type, event.target.value)}
          value={openAnswer}
          rows={4}
          placeholder="Write however much or little you'd like."
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
    background: #ccc;
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
