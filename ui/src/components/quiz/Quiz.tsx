import React, { FC, useEffect, useState } from "react";
import data from "dummy/questions.json";
// import background from '../../../public/board-114656_960_720.jpg'
import "./style.css";

interface Question {
  question: string;
  answers: Answer[];
}

interface Answer {
  index: number; //index of origin answer
  answer: string;
  correct?: boolean;
  hideAnswer?: boolean;
}

const Quiz: FC = () => {
  const [index, setIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [seconds, setSeconds] = useState(100);
  const [paused, setPaused] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(true);

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
    const isLastPage = () =>
      questions.length === 0 ? true : index === questions.length - 1;
    if (seconds === 0) {
      setIndex((index) => (isLastPage() ? index : ++index));
      if (!isLastPage()) {
        setSeconds(100);
      }
    }
  }, [seconds, questions.length, index]);

  //https://javascript.info/array-methods#shuffle-an-array
  //Fisher-Yates shuffle
  const shuffle = (array: Array<any>) => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  useEffect(() => {
    const questions: Question[] = [];
    data.questions.forEach((question) => {
      const hideAnswerIndex = Math.floor(
        Math.random() * question.answers.length
      );
      const myQuestion: Question = {
        question: question.question,
        answers: [],
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
    console.log(questions);
  }, []);

  const handleOnClick = (answer: Answer) => {
    if (answer.correct) {
      console.log("točan odgovor");
    } else {
      console.log("netočan odgovor");
    }
  };

  const Choice = (props: any) => <div> {props.children} </div>;

  const Question = () => {
    const elements = [];

    if (questions.length > 0) {
      if (index < 0 || index > questions.length) {
        //TODO internationalization
        return <label>Ooops, something's wrong, page is out of range</label>;
      }

      //question
      elements.push(
        <div key="question" className="question">
          {questions[index].question}
        </div>
      );
      //answers
      const answers = questions[index].answers;
      //hook use for hotkeys
      //https://stackoverflow.com/questions/62933902/varying-number-of-hooks-for-keyboard-shortcuts
      answers.forEach((answer, index) => {
        elements.push(
          <Choice key={"panel" + index}>
            <div key={index}>
              <br />
              <div className="answer gray-transparent">
                <label
                  className="label"
                  onClick={() => {
                    handleOnClick(answer);
                  }}
                >
                  {index +
                    1 +
                    ". " +
                    (answer?.hideAnswer ? "?????" : answer.answer)}
                </label>
              </div>
            </div>
          </Choice>
        );
      });
    } else {
      //TODO internationalization
      return <label>Ooops, something's wrong, no questions</label>;
    }
    return <>{elements}</>;
  };

  const handleKeyDown = (e: any) => {
    console.log(e.key);
    if (!isNaN(parseInt(e.key))) {
      console.log("Number"!);
      const question = questions[index];
      const hotkey = parseInt(e.key);
      if (hotkey > 0 && hotkey <= question.answers.length) {
        console.log(
          question.answers[hotkey - 1].answer,
          question.answers[hotkey - 1].index
        );
      }
    }
  };

  const TimerButtons = () => {
    return questions.length - 1 === index && seconds === 0 ? (
      <button
        onClick={() => {
          if (seconds === 0) {
            setSeconds(100);
            setIndex(0);
          }
        }}
      >
        Reset
      </button>
    ) : (
      <button onClick={() => setPaused((paused) => !paused)}>
        {paused ? "Continue" : "Pause"}
      </button>
    );
  };

  return (
    <>
      <div className="statistics">
        Pitanje: {index + 1}/{questions.length}
        {isTimerActive && (
          <div className="statistics">{Math.ceil(seconds / 10)}</div>
        )}
      </div>
      <div className="background">
        <div
          className="backgroundImage"
          tabIndex={-1}
          onKeyDown={(e) => handleKeyDown(e)}
        >
          {/* <div style={{
                        alignContent: '100px 100px' 
                    }}> */}
          <div>
            <Question />
            {isTimerActive &&
              (questions.length - 1 === index && seconds === 0 ? (
                <div style={{ margin: "20px" }}>
                  <button
                    className="button"
                    onClick={() => {
                      if (seconds === 0) {
                        setSeconds(100);
                        setIndex(0);
                      }
                    }}
                  >
                    Reset
                  </button>
                </div>
              ) : (
                <div style={{ margin: "20px" }}>
                  <button
                    className="button"
                    onClick={() => setPaused((paused) => !paused)}
                  >
                    {paused ? "Continue" : "Pause"}
                  </button>
                </div>
              ))}
            {!isTimerActive && (
              <div style={{ margin: "20px" }}>
                <button
                  className="button"
                  onClick={() =>
                    setIndex((index) => (index === 0 ? index : --index))
                  }
                >
                  Previous
                </button>
                &nbsp;&nbsp;&nbsp;
                <button
                  className="button"
                  onClick={() =>
                    setIndex((index) =>
                      index === questions.length - 1 ? index : ++index
                    )
                  }
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="stoperica">
        <label>
          <input
            type="checkbox"
            defaultChecked={isTimerActive}
            onChange={(e) => setIsTimerActive(e.target.checked)}
          />
          Štoperica
        </label>
      </div>
    </>
  );
};

export default Quiz;
