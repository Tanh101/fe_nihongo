import React, { useState } from "react";
import "./Question.scss";
import { QuestionType } from "../Definition";
import DrawCanva from "../DrawCanva/DrawCanva";

interface QuestionProps {
  question: QuestionType;
  onAnswerClick: (
    answerId: string,
    questionId: string,
    questionType: string
  ) => void;
  answersClickable: boolean;
  setAnswersClickable: (value: boolean) => void;
}

const Question: React.FC<QuestionProps> = ({
  question,
  onAnswerClick,
  answersClickable,
  setAnswersClickable,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const handleClearInput = () => {
    setInputValue("");
  };
  const appendToInput = (data: string) => {
    setInputValue((prev) => prev + data);
  };
  function handleAnswerClick(answerId: string) {
    if (
      (answersClickable && question.type === "choice") ||
      question.type === "writing"
    ) {
      onAnswerClick(answerId, question.id, question.type);
    }
    setAnswersClickable(false);
    setOpenModal(false);
  }
  const answerClass = answersClickable
    ? "border-solid border-2 border-gray-300 p-4 rounded-2xl cursor-pointer hover:bg-sky-100 text-[18px] flex flex-row font-medium items-center justify-center"
    : "border-solid border-2 border-gray-300 p-4 rounded-2xl cursor-not-allowed text-[18px] flex flex-row  font-medium items-center justify-center";

  return (
    <div className="question_container w-full h-full min-h-[450px]">
      <div className="question_content w-full min-w-min h-[150px] border-solid border-2 border-gray-300 mb-10 rounded-2xl flex flex-row items-center justify-center text-[18px]">
        <p
          className={
            "overflow-auto w-11/12 min-w-min h-[80%] text-[20px] font-medium " +
            (question.content.length > 32
              ? "flex flex-row items-center justify-start"
              : "flex flex-row items-center justify-center")
          }
          style={{
            overflowWrap: "anywhere",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {question.content}
        </p>
      </div>
      <div
        className={`${
          question.type === "choice" ? "grid grid-cols-2 gap-4" : ""
        } w-full h-auto`}
      >
        {question.type === "writing" ? (
          <div className="w-full h-[500px] flex flex-col items-center justify-start">
            <div className="w-full h-[60px] flex flex-row items-center justify-between">
              <input
                readOnly={true}
                className="question_input w-[70%] h-[50px] rounded-[10px] px-2 border-2 border-solid border-gray-300"
                onClick={() => setOpenModal(true)}
                value={inputValue}
                placeholder="Write your answer here"
              ></input>
              <div className="w-[25%] h-[50px] flex flex-row items-center justify-center">
                <button
                  className="w-[100px] h-[50px] rounded-[10px] bg-blue-500 text-white font-medium text-[15px] hover:bg-blue-400 active:ring-4 active:outline-none active:ring-blue-300"
                  onClick={() => handleAnswerClick(inputValue)}
                >
                  Submit
                </button>
                <button
                  className=" ml-3 w-[100px] h-[50px] rounded-[10px] bg-red-500 text-white font-medium text-[15px] hover:bg-red-400 active:ring-4 active:outline-none active:ring-red-300"
                  onClick={handleClearInput}
                >
                  Clear
                </button>
              </div>
            </div>
            {openModal && (
              <div className="bg-white drop-shadow-xl rounded-[10px] mt-4 pt-3 border-2 border-solid border-gray-300 flex flex-row items-center justify-center">
                <DrawCanva
                  setOpenModal={setOpenModal}
                  appendToInput={appendToInput}
                />
              </div>
            )}
          </div>
        ) : (
          question.answers.map((answer) => (
            <div
              key={answer.id}
              id={answer.id.toString()}
              className={answerClass}
              onClick={() => handleAnswerClick(answer.id)}
            >
              <p
                className={
                  "overflow-auto w-full h-[100%] " +
                  (answer.content.length > 20
                    ? "flex flex-row items-center justify-start"
                    : "flex flex-row items-center justify-center")
                }
                style={{
                  overflowWrap: "anywhere",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {answer.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Question;
