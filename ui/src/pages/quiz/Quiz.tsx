import { useFetch } from "api/http/AxiosHooks";
import { createGetUrl } from "api/http/Url";
import QuestionView from "components/QuestionView";
import React, { FC, useEffect, useReducer, useState } from "react";
import "./style.css";

export interface IQuestion {
  question: string;
  answers: string[];
  correct: number[];
}

export interface IShuffeledQuestion {
  question: string;
  answers: IAnswer[];
  userAnswers: number[];
  correct: number[];
}

export interface IAnswer {
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
  const [shuffeledQuestions, setQuestions] = useState<IShuffeledQuestion[]>([]);
  const [seconds, setSeconds] = useState(100);
  const [paused, setPaused] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const { data: serverQuestions, loading } = useFetch<IQuestion[]>(url);
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
    const isLastPage = () => (shuffeledQuestions.length === 0 ? true : questionIndex === shuffeledQuestions.length - 1);
    if (seconds === 0) {
      setQuestionIndex((index) => (isLastPage() ? index : ++index));
      if (!isLastPage()) {
        setSeconds(100);
      }
    }
  }, [seconds, shuffeledQuestions.length, questionIndex]);

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
    serverQuestions?.forEach((question) => {
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
  }, [serverQuestions]);

  const getCorrectStatistics = (): string => {
    let correctAnswers = 0;
    let totalAnswers = 0;
    shuffeledQuestions.forEach((question) => {
      if (question.userAnswers.length > 0) {
        totalAnswers++;
        if (question.userAnswers[0] === question.correct[0]) {
          correctAnswers++;
        }
      }
    });
    return `${correctAnswers}/${totalAnswers}`;
  };

  if (loading) {
    return <label className='quiz-container'>Retrieving questions...</label>;
  }

  if (!serverQuestions || serverQuestions.length === 0) {
    return <label className='quiz-container'>Ooops, no questions</label>;
  }

  return (
    <div className='quiz-container quiz-div'>
      <div className='statistics'>
        <div className='flex-center'>
          <div>
            Question: {questionIndex + 1}/{shuffeledQuestions.length}
          </div>
          <div>Correct: {getCorrectStatistics()}</div>
        </div>
        {isTimerActive && <div className='statistics'>{Math.ceil(seconds / 10)}</div>}
      </div>
      <div className='question-container'>
        <div>
          <QuestionView questions={shuffeledQuestions} currentQuestionIndex={questionIndex} forceUpdate={forceUpdate} />
          {isTimerActive &&
            (shuffeledQuestions.length - 1 === questionIndex && seconds === 0 ? (
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
                onClick={() => setQuestionIndex((index) => (index === shuffeledQuestions.length - 1 ? index : ++index))}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      {/* <div className='stoperica'>
        <label>
          <input
            type='checkbox'
            disabled={true}
            defaultChecked={isTimerActive}
            onChange={(e) => setIsTimerActive(e.target.checked)}
          />
          Timer
        </label>
      </div> */}
    </div>
  );
};

export default Quiz;
