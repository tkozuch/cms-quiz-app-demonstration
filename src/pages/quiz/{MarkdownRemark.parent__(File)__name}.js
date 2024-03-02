import * as React from "react";
import { useState, useEffect } from "react";
import { graphql } from "gatsby";

import { PlayIcon, PauseIcon, ArrowPathIcon } from "@heroicons/react/24/solid";

import Layout from "../../components/layout";

/**
 *
 * @param {Array} subcategories
 * @returns {number}
 */
const getNumberOfQuestions = (subcategories) => {
  return subcategories.reduce((p, c) => p + c.answers.length, 0);
};

/**
 * @param {number} seconds
 */
const formatTime = (seconds) => {
  let minute = Math.floor(seconds / 60);
  minute = "0" + minute;
  minute = minute.slice(-2);
  let s = seconds - minute * 60;
  s = "0" + s;
  s = s.slice(-2);
  return `${minute}:${s}`;
};

const QUIZ_NOT_STARTED = "QUIZ_NOT_STARTED";
const QUIZ_RUNNING = "QUIZ_STARTED";
const QUIZ_PAUSED = "QUIZ_PAUSED";
const QUIZ_TIMESUP = "QUIZ_TIMESUP";
const QUIZ_FINISHED = "QUIZ_FINISHED";

/**
 *
 * @param {boolean} quizStarted
 * @param {number} correctAnswers
 * @param {number} allAnswers
 * @returns {string}
 */
const getTopPanelAnswersInfo = (quizState, correctAnswers, allAnswers) => {
  if (quizState === QUIZ_NOT_STARTED) return allAnswers;
  return `${correctAnswers}/${allAnswers}`;
};

const QuizPage = ({
  data, // this prop will be injected by the GraphQL query below.
}) => {
  const { markdownRemark } = data; // data.markdownRemark holds your post data
  const quiz_data = markdownRemark.frontmatter;
  const quizTime = 5;

  const [timeRemaining, setTimeRemaining] = useState(quizTime);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [quizState, setQuizState] = useState(QUIZ_NOT_STARTED);
  const [answerState, setAnswerState] = useState();

  const allAnswersCount = getNumberOfQuestions(quiz_data.subcategories);
  const correctAnswersCount = 0; // getCorrectAnswersCount(answerState);

  useEffect(() => {
    let interval;

    if (timeRemaining !== 0 && quizState === QUIZ_RUNNING) {
      interval = setInterval(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (quizState === QUIZ_RUNNING && timeRemaining === 0) {
      setQuizState(QUIZ_TIMESUP);
    }

    return () => interval && clearInterval(interval);
  }, [quizState, timeRemaining]);

  return (
    <Layout>
      <div className="h-full w-full flex flex-col font-bold capitalize">
        {/* top-panel */}
        <div className="flex flex-col h-1/4 min-h-[200px]">
          {quizState !== QUIZ_TIMESUP ? (
            <>
              <div className="flex justify-between text-xl">
                <span>
                  {getTopPanelAnswersInfo(
                    quizState.started,
                    correctAnswersCount,
                    allAnswersCount
                  )}
                </span>
                {quizState !== QUIZ_PAUSED && (
                  <button
                    className="bg-yellow-200 ml-auto  w-6 px-1 box-content"
                    onClick={() => setQuizState(QUIZ_PAUSED)}
                  >
                    <PauseIcon />
                  </button>
                )}
                <span className="ml-4">{formatTime(timeRemaining)}</span>
              </div>
              <div className="text-3xl grow justify-center items-center flex text-center overflow-ellipsis">
                {quiz_data.title}
              </div>
              {/* space to show action item */}
              <div className="flex justify-center w-full max-w-[600px] mt-auto h-1/3 text-xl max-h-[50px] min-h-[20px] self-center">
                {quizState === QUIZ_NOT_STARTED ? (
                  <button
                    className="bg-stone-300 w-full h-full flex justify-center items-center"
                    onClick={() => setQuizState(QUIZ_RUNNING)}
                  >
                    Start Quiz <PlayIcon className="h-full scale-50" />
                  </button>
                ) : quizState === QUIZ_PAUSED ? (
                  <button
                    className="bg-yellow-300 w-full h-full flex justify-center items-center"
                    onClick={() => setQuizState(QUIZ_RUNNING)}
                  >
                    Resume <PlayIcon className="h-full scale-50" />
                  </button>
                ) : (
                  <input
                    placeholder="Answer"
                    className="w-full h-full px-4 font-normal"
                  ></input>
                )}
              </div>
            </>
          ) : (
            <div className="relative flex self-center justify-center items-center w-fit h-full text-4xl">
              Time's Up!
              {/* button-wrapper */}
              <div className="flex flex-col">
                <button
                  className="absolute w-9 h-9 bg-stone-300 -right-12 bottom-8 p-1 after:content-['try_again'] after:text-xs after:absolute after:-bottom-4 after:-left-[0.875rem] after:text-center after:w-16 after:capitalize"
                  onClick={() => {
                    setQuizState(QUIZ_RUNNING);
                    setTimeRemaining(quizTime);
                  }}
                >
                  <ArrowPathIcon />
                </button>
              </div>
            </div>
          )}
        </div>
        {/* subcategories */}
        {
          <div className="flex self-auto lg:self-center overflow-x-auto w-screen relative left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] lg:left-0 lg:right-0 lg:ml-0 lg:mr-0 gap-4 snap-x snap-mandatory h-full mt-4">
            {(quizState === QUIZ_RUNNING || quizState === QUIZ_TIMESUP) &&
              quiz_data.subcategories
                .concat(quiz_data.subcategories)
                .map(({ title, answers }, i) => (
                  // {/* card */}
                  <div
                    className="w-[70vw] lg:w-[25vw] shrink-0 border border-stone-50 snap-center first:ml-[15vw] lg:first:ml-[5vw] last:mr-[15vw] lg:last:mr-[5vw] p-2 mb-4"
                    key={i}
                  >
                    <h3 className="text-xl text-center">{title}</h3>
                    <ul>
                      {answers.map((answer, i) => (
                        <li
                          key={i}
                          className="border borderstone-50 mt-2 text-transparent select-none"
                        >
                          {answer.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
          </div>
        }
      </div>
    </Layout>
  );
};

export const pageQuery = graphql`
  query ($id: String) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
        subcategories {
          title
          answers {
            value
          }
        }
      }
    }
  }
`;

export default QuizPage;
