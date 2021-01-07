import React, {useMemo, useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import Confetti from 'react-confetti';
import { Card, Colors, Button } from './styled';

const PointValues = {
    easy: 15,
    medium: 8,
    hard: 2,
    unknown: 0
};

const VocabQuiz = ({vocab: vocabItems, onCloseQuiz}) => {
    const cards = useMemo(() => {
        return vocabItems.map(vocab => {
            return [
                {
                    front: vocab.english,
                    back: vocab.spanish
                },
                {
                    front: vocab.spanish,
                    back: vocab.english
                }
            ]
        }).flat();
    }, [vocabItems]);
    
    useEffect(() => {
        const clickListening = window.addEventListener('click', () => {
            setShowAnswer(true);
        });

        return () => window.removeEventListener('click', clickListening);
    }, []);

    const [index, setIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const quizCardRef = useRef();
    const currentVocab = useMemo(() => cards[index], [index, cards]);
    const isFinished = useMemo(() => index >= cards.length, [index, cards]);
    const maxScore = cards.length * PointValues['easy'];
    const scoreRatio = finalScore / maxScore;

    const finishedText = useMemo(() => {

        if (scoreRatio < .3) {
            return 'Hmmm, a little more studying will help'
        }

        if (scoreRatio < .6) {
            return 'Close, but no cigar'
        }

        if (scoreRatio < .9) {
            return 'Hey, not bad! You\'re close to a solid score'
        }

        if (scoreRatio < 1) {
            return '¡Bien hecho!'
        }

        if (scoreRatio === 1) {
            return 'A perfect score!'
        }
    }, [index, cards]);

    const nextQuestion = (event, score) => {
        event.stopPropagation();

        setFinalScore(finalScore => finalScore + PointValues[score]);
        setShowAnswer(false);
        setIndex(index + 1);
    }

    return (
        <div>
 
            <ButtonRow>
                {!isFinished && <span>{index + 1}/{cards.length}</span>}
                <Button secondary onClick={onCloseQuiz}>End quiz</Button>
            </ButtonRow>

            <QuizCard ref={quizCardRef}>
                {isFinished && (
                    <>
                    {scoreRatio > .8 && (
                        <Confetti
                            width={quizCardRef.current.offsetWidth}
                            height={quizCardRef.current.offsetHeight}
                            numberOfPieces={75}
                        />
                    )}
                    <CompletedMessage>{finishedText}</CompletedMessage>
                    <Score>{finalScore} / {cards.length * PointValues['easy']}</Score>
                    </>
                )}

                {!isFinished && (
                    <>
                    <Question>
                        {currentVocab.front}
                    </Question>

                    <Answer show={showAnswer}>
                        {currentVocab.back}
                    </Answer>

                    <AnswerOptions>
                        <AnswerOption type="danger" onClick={(event) => nextQuestion(event, 'unknown')}>Can't remember</AnswerOption>
                        <AnswerOption type="hard" onClick={(event) => nextQuestion(event, 'hard')}>Hard</AnswerOption>
                        <AnswerOption type="medium" onClick={(event) => nextQuestion(event, 'medium')}>Medium</AnswerOption>
                        <AnswerOption type="easy" onClick={(event) => nextQuestion(event, 'easy')}>Easy</AnswerOption>
                    </AnswerOptions>

                    {!isFinished && <ExplanationMessage>Click anywhere other than the buttons to show the translation.</ExplanationMessage>}
                    </>
                )}
            </QuizCard>
        </div>
    )
}

export default VocabQuiz;

const ButtonRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-bottom: 15px;
`;

const QuizCard = styled(Card)`
    position: relative;
`;
const Question = styled.h4`
    text-align: center;
    font-size: 24px;
    margin-bottom: 0px;
    margin-top: 0;
`;

const CompletedMessage = styled(Question)``;
const Score = styled.div`
    display: flex;
    justify-content: center;
    font-size: 64px;
    font-weight: bold;
    color: ${Colors.Primary};
`;

const Answer = styled.p`
    margin-top: 0px;
    text-align: center;
    opacity: ${props => props.show ? 1 : 0};
`;
const AnswerOptions = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 30px;
`;
const AnswerOption = styled(Button)`
    margin-right: 10px;
`;
const ExplanationMessage = styled.p`
    margin-top: 10px;
    margin-bottom: 0;
    font-size: 14px;
    text-align: center;
    color: #666;
`;