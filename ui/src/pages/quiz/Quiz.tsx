import { useFetch } from "api/http/AxiosHooks";
import { createGetUrl } from "api/http/Url";
import React, { FC, useEffect, useReducer, useState } from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import "./style.css";

interface IQuestion {
  question: string;
  answers: string[];
  correct: number[];
}

interface IShuffeledQuestion {
  question: string;
  answers: IAnswer[];
  userAnswers: number[];
  correct: number[];
}

interface IAnswer {
  index: number; //index of origin answer
  answer: string;
  correct?: boolean;
  hideAnswer?: boolean;
}

const Quiz: FC = () => {
  const url = createGetUrl("/questions");
  //url.getUrlQuery().setParam('category_like', 'geography');
  url.getUrlQuery().setParam("language", "en");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<IShuffeledQuestion[]>([]);
  const [seconds, setSeconds] = useState(100);
  const [paused, setPaused] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const { data } = useFetch<IQuestion[]>(url);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (isTimerActive) {
      if (seconds > 0 && !paused) {
        setTimeout(() => {
          setSeconds((seconds) => seconds - 1);
        }, 100);
      }
    }
  }, [seconds, paused, isTimerActive]);

  useEffect(() => {
    const isLastPage = () => (questions.length === 0 ? true : questionIndex === questions.length - 1);
    if (seconds === 0) {
      setQuestionIndex((index) => (isLastPage() ? index : ++index));
      if (!isLastPage()) {
        setSeconds(100);
      }
    }
  }, [seconds, questions.length, questionIndex]);

  //https://javascript.info/array-methods#shuffle-an-array
  //Fisher-Yates shuffle
  const shuffle = (array: Array<IAnswer>) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  useEffect(() => {
    const questions: IShuffeledQuestion[] = [];
    data?.forEach((question) => {
      const hideAnswerIndex = Math.floor(Math.random() * question.answers.length);
      const myQuestion: IShuffeledQuestion = {
        question: question.question,
        answers: [],
        userAnswers: [],
        correct: question.correct,
      };
      question.answers.forEach((answer, index) => {
        myQuestion.answers.push({
          answer: answer,
          correct: question.correct.includes(index),
          hideAnswer: index === hideAnswerIndex,
          index: index,
        });
      });
      //randomize answers
      //myQuestion.answers.sort(() => Math.random() - 0.5); //not the best shuffle, but it's a good enough for the quiz
      shuffle(myQuestion.answers);
      questions.push(myQuestion);
    });
    setQuestions(questions);
  }, [data]);

  const handleOnAnswerClick = (answer: IAnswer, question: IShuffeledQuestion) => {
    if (question.userAnswers.length === 0) {
      question.userAnswers.push(answer.index);
    }
    forceUpdate();
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

  // const handleKeyDown = (e: any) => {
  //   console.log(e.key);
  //   if (!isNaN(parseInt(e.key))) {
  //     console.log("Number"!);
  //     const question = questions[questionIndex];
  //     const hotkey = parseInt(e.key);
  //     if (hotkey > 0 && hotkey <= question.answers.length) {
  //       console.log(question.answers[hotkey - 1].answer, question.answers[hotkey - 1].index);
  //     }
  //   }
  // };

  // const TimerButtons = () => {
  //   return questions.length - 1 === questionIndex && seconds === 0 ? (
  //     <button
  //       onClick={() => {
  //         if (seconds === 0) {
  //           setSeconds(100);
  //           setQuestionIndex(0);
  //         }
  //       }}
  //     >
  //       Reset
  //     </button>
  //   ) : (
  //     <button onClick={() => setPaused((paused) => !paused)}>{paused ? "Continue" : "Pause"}</button>
  //   );
  // };

  const getCorrectStatistics = (): string => {
    let correctAnswers = 0;
    let totalAnswers = 0;
    questions.forEach((question) => {
      if (question.userAnswers.length > 0) {
        totalAnswers++;
        if (question.userAnswers[0] === question.correct[0]) {
          correctAnswers++;
        }
      }
    });
    return `${correctAnswers}/${totalAnswers}`;
  };

  return (
    <div className='quiz-container quiz-div'>
      <div className='statistics'>
        <div className='flex-center'>
          <div>
            Question: {questionIndex + 1}/{questions.length}
          </div>
          <div>Correct: {getCorrectStatistics()}</div>
        </div>
        {isTimerActive && <div className='statistics'>{Math.ceil(seconds / 10)}</div>}
      </div>
      <div className='question-container'>
        <div>
          <Question />
          {isTimerActive &&
            (questions.length - 1 === questionIndex && seconds === 0 ? (
              <div style={{ margin: "20px" }}>
                <button
                  className='button'
                  onClick={() => {
                    if (seconds === 0) {
                      setSeconds(100);
                      setQuestionIndex(0);
                    }
                  }}
                >
                  Reset
                </button>
              </div>
            ) : (
              <div style={{ margin: "20px" }}>
                <button className='button' onClick={() => setPaused((paused) => !paused)}>
                  {paused ? "Continue" : "Pause"}
                </button>
              </div>
            ))}
          {!isTimerActive && (
            <div style={{ margin: "20px" }}>
              <button className='button' onClick={() => setQuestionIndex((index) => (index === 0 ? index : --index))}>
                Previous
              </button>
              &nbsp;&nbsp;&nbsp;
              <button
                className='button'
                onClick={() => setQuestionIndex((index) => (index === questions.length - 1 ? index : ++index))}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      <div className='stoperica'>
        <label>
          <input
            type='checkbox'
            disabled={true}
            defaultChecked={isTimerActive}
            onChange={(e) => setIsTimerActive(e.target.checked)}
          />
          Timer
        </label>
      </div>
    </div>
  );
};

export default Quiz;
