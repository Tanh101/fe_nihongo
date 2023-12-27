import React from "react";
import "./Question.scss";
import { QuestionType } from "../Definition";

interface QuestionProps {
  question: QuestionType;
  onAnswerClick: (answerId: string, questionId: string) => void;
  answersClickable: boolean;
  setAnswersClickable: (value: boolean) => void;
}

const Question: React.FC<QuestionProps> = ({
  question,
  onAnswerClick,
  answersClickable,
  setAnswersClickable,
}) => {
  function handleAnswerClick(answerId: string) {
    if (answersClickable) {
      onAnswerClick(answerId, question.id);
    }
    setAnswersClickable(false);
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
      <div className="grid grid-cols-2 gap-4 w-full h-auto">
        {question.answers.map((answer) => (
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
        ))}
      </div>
    </div>
  );
};

export default Question;
