import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Link, graphql } from "gatsby";
import { PlayIcon, PauseIcon, ArrowPathIcon } from "@heroicons/react/24/solid";

import logo from "../../images/logo-quizzes-font-honk.png";
import Layout from "../../components/layout";

const QUIZ_NOT_STARTED = "QUIZ_NOT_STARTED";
const QUIZ_RUNNING = "QUIZ_STARTED";
const QUIZ_PAUSED = "QUIZ_PAUSED";
const QUIZ_TIMESUP = "QUIZ_TIMESUP";
const QUIZ_FINISHED = "QUIZ_FINISHED";

/**
 *
 * @param {Array} subcategories - data from cms
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

/**
 * Format answer for consistency within the app.
 *  */
const formatAnswer = (answer) => {
  return answer.toLowerCase();
};

/**
 * Get initial state for tracking which answers have been answered.
 *
 * ex. return:
 *
 *  {
 *      answer_1: false,
 *      answer_2: false,
 *      answer_3: false,
 *  }
 *
 *  @param {list[object]} subcategories - data from cms
 *  @returns {object}
 */
const getInitialAnswersState = (subcategories) =>
  subcategories.reduce((p, c) => {
    let { answers } = c;
    answers = answers.map((a) => formatAnswer(a.value));
    answers.forEach((a) => (p[a] = false));
    return p;
  }, {});

/**
 * Get initial state for answers in the DOM.
 *
 * ex. return:
 *
 *  {
 *      answer_1: reactRef,
 *      answer_2: reactRef,
 *      answer_3: reactRef,
 *  }
 *
 *  @param {list[object]} subcategories - data from cms
 *  @returns {object}
 */
const getInitialAnswersRefrences = (subcategories) => {
  return subcategories.reduce((p, c) => {
    let { answers } = c;
    answers = answers.map((a) => formatAnswer(a.value));
    answers.forEach((a) => {
      const [inView, setInView] = useState(false);
      p[a] = { ref: useRef(null), inView: inView, setInView: setInView };
    });
    return p;
  }, {});
};

const checkAllAnswersCorrect = (answersState) => {
  let allCorrect = true;
  for (let ans in answersState) {
    allCorrect = allCorrect && answersState[ans];
  }
  return allCorrect;
};

const getCorrectAnswersCount = (answersState) => {
  let count = 0;
  for (let ans in answersState) {
    if (answersState[ans]) {
      count += 1;
    }
  }
  return count;
};

/**
 * Adjust initial scroll position for subcategories container.
 *
 * Only visual pleasancy purposes. Not critical.
 *
 * @param {list[object]} subcategories - data from cms
 */
const adjustSubcategoriesScrollPosition = (
  subcategories,
  answersReferences
) => {
  let middleIndex = Math.ceil(subcategories.length / 2) - 1; // 3 for 5, 2 for 4 etc; subtract 1 to accomodate for 0 element
  let answerFromSecondSubcategory = subcategories[middleIndex].answers[0].value;
  answersReferences[
    formatAnswer(answerFromSecondSubcategory)
  ].ref.current?.scrollIntoView({ inline: "center" });
};

const QuizPage = ({
  data, // this prop will be injected by the GraphQL query below.
}) => {
  const getAnswerStyling = (answer, answersState, quizState, isInView) => {
    let isCorrect = answersState[formatAnswer(answer)] === true;

    let correctStyling =
      " text-white bg-white/50 " + (isInView ? " animate-correct_answer " : "");
    let unanswared =
      quizState === QUIZ_FINISHED || quizState === QUIZ_TIMESUP
        ? " text-red-500 border-red-500 bg-white/50"
        : " text-transparent bg-white/50";

    return isCorrect ? correctStyling : unanswared;
  };

  const { markdownRemark } = data; // data.markdownRemark holds your post data
  const quiz_data = markdownRemark.frontmatter;
  const quizTime = Number(quiz_data?.time) || 180;
  const answersReferences = getInitialAnswersRefrences(quiz_data.subcategories);

  const [timeRemaining, setTimeRemaining] = useState(quizTime);
  const [quizState, setQuizState] = useState(QUIZ_NOT_STARTED);
  const [answersState, setAnswersState] = useState(
    getInitialAnswersState(quiz_data.subcategories)
  );
  const dialogRef = useRef(null);
  const answerRef = useRef(null);
  const [scoreAnimation, setScoreAnimation] = useState(false);

  const allAnswersCount = getNumberOfQuestions(quiz_data.subcategories);
  const correctAnswersCount = getCorrectAnswersCount(answersState);

  const handleAnswerKeyDown = (e) => {
    if (
      ("key" in e && e.key === "Enter") ||
      ("keyCode" in e && e.keyCode == 13)
    ) {
      let answer = e.target.value;
      // this means it is correct
      if (formatAnswer(answer) in answersState) {
        // this means it was already correct
        if (answersState[formatAnswer(answer)]) {
          // can provide some alternative animation here.
        } else {
          const stateCopy = { ...answersState };
          stateCopy[formatAnswer(answer)] = true;
          setAnswersState(stateCopy);
          console.log("setting score animation ");
          setScoreAnimation(true);
          setTimeout(() => {
            console.log("unsetting ");
            setScoreAnimation(false);
          }, 1000);
        }
        answersReferences[formatAnswer(answer)].ref.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "center",
        });
      }
      e.preventDefault();
    }
  };
  const resetQuiz = () => {
    setQuizState(QUIZ_RUNNING);
    setTimeRemaining(quizTime);
    setAnswersState(getInitialAnswersState(quiz_data.subcategories));
    if (answerRef.current) {
      answerRef.current.value = "";
    }
  };

  useEffect(() => {
    if (checkAllAnswersCorrect(answersState)) {
      dialogRef?.current.showModal();
      setQuizState(QUIZ_FINISHED);
    }
  }, [answersState]);

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

  useEffect(() => {
    if (quizState === QUIZ_RUNNING && quiz_data.subcategories.length >= 3) {
      try {
        adjustSubcategoriesScrollPosition(
          quiz_data.subcategories,
          answersReferences
        );
      } catch {
        // don't block program if failed.
      }
    }
  }, [quizState]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            !entry.isIntersecting &&
            // this means animation was shown already and we don't want to do anything. prevent animations multiple triggers on scroll-in/out
            entry.target.classList.contains("animate-correct_answer")
          )
            return;
          answersReferences[formatAnswer(entry.target.innerHTML)].setInView(
            entry.isIntersecting
          );
        });
      },
      {
        threshold: 0.5,
      }
    );
    Object.values(answersReferences).forEach(({ ref }) =>
      observer.observe(ref.current)
    );
    return () => observer.disconnect();
  }, []);

  return (
    <Layout>
      <div className="h-full w-full flex flex-col font-bold capitalize ">
        {/* top-panel */}
        <div
          className={
            "flex flex-col min-h-[200px] items-center justify-between gap-4 sm:gap-8 grow mb-8 md:gap-12" +
            // for Time's up positioning
            " relative "
          }
        >
          <>
            {/* top-panel -- top-row */}
            <div className="flex text-2xl md:text-3xl w-full max-w-[800px]">
              <Link to="/" className="mr-4">
                <img src={logo} alt="logo" className="h-8 md:h-10" />
              </Link>
              {
                <button
                  className={
                    "bg-yellow-200 ml-auto w-6 md:w-7 px-1 box-content " +
                    (quizState !== QUIZ_PAUSED &&
                    quizState !== QUIZ_NOT_STARTED &&
                    quizState !== QUIZ_TIMESUP
                      ? " "
                      : " opacity-0 ")
                  }
                  onClick={() => setQuizState(QUIZ_PAUSED)}
                  disabled={[
                    QUIZ_TIMESUP,
                    QUIZ_PAUSED,
                    QUIZ_NOT_STARTED,
                  ].includes(quizState)}
                >
                  <PauseIcon />
                </button>
              }

              <span
                className={
                  "ml-4" + (quizState === QUIZ_TIMESUP ? " text-red-400" : "")
                }
              >
                {formatTime(timeRemaining)}
              </span>

              <span className="ml-4 md:ml-8">
                {quizState === QUIZ_NOT_STARTED ? (
                  <span>{allAnswersCount}</span>
                ) : (
                  <>
                    <span
                      className={
                        "inline-block " +
                        (scoreAnimation ? " animate-ping_score " : "")
                      }
                    >
                      {correctAnswersCount}
                    </span>
                    /<span>{allAnswersCount}</span>
                  </>
                )}
              </span>
            </div>
            {/* middle screen  */}

            <div
              className={
                // make it absolute, so that it doesn't take any space, and thus no layout shift when changing from "title" to "Time's up" fields
                "absolute z-10 flex self-center justify-center items-center w-fit text-3xl md:text-5xl  top-1/2 -translate-y-1/2 -mt-2" +
                (quizState === QUIZ_TIMESUP ? "" : " opacity-0 ")
              }
            >
              Time's Up!
              {/* button-wrapper */}
              <div className="flex flex-col">
                <button
                  className="absolute w-9 h-9 bg-stone-300 -right-12 p-1 after:content-['try_again'] after:text-xs md:after:text-sm after:absolute after:-bottom-4 after:-left-[0.875rem] after:text-center after:w-16 after:capitalize"
                  onClick={resetQuiz}
                >
                  <ArrowPathIcon />
                </button>
              </div>
            </div>

            <div
              className={
                "text-3xl md:text-5xl justify-center items-center overflow-hidden flex text-center overflow-ellipsis max-w-[800px] break-normal [word-break:break-word] grow" +
                (quizState === QUIZ_TIMESUP ? " opacity-0 " : "")
              }
            >
              {quiz_data.title}
            </div>

            {/* space to show action item */}
            <div className="flex justify-center shrink-0 w-full max-w-[800px] h-1/3 text-xl md:text-2xl max-h-[50px] min-h-[20px] self-center">
              {quizState === QUIZ_NOT_STARTED ? (
                <button
                  className="bg-stone-300 w-full h-full flex justify-center items-center"
                  onClick={() => setQuizState(QUIZ_RUNNING)}
                >
                  Start Quiz <PlayIcon className="h-full scale-50" />
                </button>
              ) : quizState === QUIZ_PAUSED ? (
                <>
                  <button
                    className="bg-yellow-300 w-full h-14 flex justify-center items-center"
                    onClick={() => setQuizState(QUIZ_RUNNING)}
                  >
                    Resume <PlayIcon className="h-full scale-50" />
                  </button>
                </>
              ) : (
                <>
                  <input
                    ref={answerRef}
                    placeholder="Answer"
                    className="w-full h-14 px-4 font-normal disabled:bg-white"
                    onKeyDown={(e) => handleAnswerKeyDown(e)}
                    disabled={quizState === QUIZ_TIMESUP}
                  ></input>
                </>
              )}
            </div>
          </>
        </div>
        {/* subcategories */}
        {
          <div
            className={
              // expand over parent for small screens
              " left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] w-screen relative" +
              // reset expanding for bigger
              " md:static md:ml-0 md:mr-0 md:w-auto md:self-center " +
              // basic setting
              " flex basis-1/2 grow-[5] overflow-x-auto gap-8 snap-x snap-mandatory md:max-w-[91.66667vw] xl:max-w-7xl transition-opacity" +
              // customizable setting
              (quiz_data.subcategories.length < 3
                ? " md:justify-center "
                : "") +
              // hide if quiz not started - otherwise the container provide appropriate space
              (quizState === QUIZ_RUNNING ||
              quizState === QUIZ_TIMESUP ||
              quizState === QUIZ_FINISHED
                ? ""
                : " opacity-0 ")
            }
          >
            {quiz_data.subcategories.map(({ title, answers }, i) => (
              // {/* card */}
              <div
                className={
                  " flex flex-col w-[70vw] md:w-[25vw] shrink-0 grow max-w-[540px] border-2 bg-purple-200/40 snap-center first:ml-[15vw] last:mr-[15vw] p-2 mb-4 " +
                  " md:first:ml-0 md:last:mr-0 break-words " +
                  (quiz_data.subcategories.length === 1 ? " md:min-w-96 " : "")
                }
                key={i}
              >
                <h3 className="text-xl text-center px-4 py-2">{title}</h3>
                <ul className="overflow-y-auto [--unanswered-answer:rgb(255,255,255)] [--correct-answer:rgb(34,197,94)] ">
                  {answers.map((answer, i) => (
                    <li
                      key={i}
                      className={
                        "px-4 py-1 mt-2 select-none border-2 " +
                        getAnswerStyling(
                          answer.value,
                          answersState,
                          quizState,
                          answersReferences[formatAnswer(answer.value)].inView
                        )
                      }
                      ref={answersReferences[formatAnswer(answer.value)].ref}
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
      <dialog
        className="open:flex flex-col items-center w-[90vw] max-w-md p-8 md:p-16 h-fit backdrop:bg-black/40 backdrop:animate-show_long opacity-0 animate-show_long [animation-duration:1000ms]"
        ref={dialogRef}
      >
        <p className="text-xl md:text-3xl text-green-500 font-bold">
          Congratulations!
        </p>
        <p className="mt-5 md:mt-8 text-center md:text-xl">
          You've guessed all the questions correctly!
        </p>
        <button
          className="mt-8 md:mt-12 bg-teal-200/50 border-2 border-black/80 p-2 md:text-xl"
          onClick={() => {
            dialogRef.current.close();
            resetQuiz();
          }}
        >
          Play again
        </button>
      </dialog>
    </Layout>
  );
};

export const pageQuery = graphql`
  query ($id: String) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
        time
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
