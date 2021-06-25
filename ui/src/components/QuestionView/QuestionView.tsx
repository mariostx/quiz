import React, { FC } from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { IAnswer, IShuffeledQuestion } from "pages/quiz/Quiz";

interface IProps {
  currentQuestionIndex: number;
  questions: IShuffeledQuestion[];
  forceUpdate: () => void;
}

const QuestionView: FC<IProps> = (props: IProps) => {
  const handleOnAnswerClick = (answer: IAnswer, question: IShuffeledQuestion) => {
    if (question.userAnswers.length === 0) {
      question.userAnswers.push(answer.index);
    }
    props.forceUpdate();
  };

  const Choice = (props: any) => <div> {props.children} </div>;

  function showAnswerIcon(question: IShuffeledQuestion, answer: IAnswer): JSX.Element {
    if (question.userAnswers.length !== 0) {
      if (answer.correct) {
        return (
          <div className='answer-icon green-icon'>
            <CheckCircleIcon />
          </div>
        );
      }
      if (question.userAnswers[0] === answer.index && !answer.correct) {
        return (
          <div className='answer-icon red-icon'>
            <CancelIcon />
          </div>
        );
      }
    }
    return (
      <div className='answer-icon' style={{ visibility: "hidden" }}>
        <CancelIcon />
      </div>
    );
  }

  const Question = () => {
    const elements = [];
    let currentQuestion: IShuffeledQuestion;
    const questions = props.questions;
    const questionIndex = props.currentQuestionIndex;

    if (questions.length > 0) {
      if (questionIndex < 0 || questionIndex > questions.length) {
        //TODO internationalization
        return <label>Ooops, something is wrong</label>;
      }
      currentQuestion = questions[questionIndex];
      //question
      elements.push(
        <div key='question' className='question'>
          {currentQuestion.question}
        </div>
      );
      //answers
      const answers = questions[questionIndex].answers;
      //hook use for hotkeys
      //https://stackoverflow.com/questions/62933902/varying-number-of-hooks-for-keyboard-shortcuts
      answers.forEach((answer, index) => {
        elements.push(
          <Choice key={"panel" + index}>
            <div className='choice' key={index}>
              <br />
              <div
                className='answer gray-transparent'
                onClick={() => {
                  handleOnAnswerClick(answer, currentQuestion);
                }}
              >
                <label className='label'>
                  {index +
                    1 +
                    ". " +
                    (currentQuestion.userAnswers.length === 0 && answer?.hideAnswer ? "?????" : answer.answer)}
                </label>
              </div>
              {showAnswerIcon(currentQuestion, answer)}
            </div>
          </Choice>
        );
      });
    } else {
      //TODO internationalization
      return <label>Ooops, something is wrong, no questions</label>;
    }
    return <>{elements}</>;
  };
  return <Question />;
};

export default QuestionView;
