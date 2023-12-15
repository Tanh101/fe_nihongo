import React from "react";
import "./Question.scss";
import { QuestionType } from "../Definition";

interface QuestionProps {
  question: QuestionType;
  onAnswerClick: (answerId: number, questionId: number) => void;
  answersClickable: boolean;
  setAnswersClickable: (value: boolean) => void;
}

const Question: React.FC<QuestionProps> = ({
  question,
  onAnswerClick,
  answersClickable,
  setAnswersClickable,
}) => {
  function handleAnswerClick(answerId: number) {
    if (answersClickable) {
      onAnswerClick(answerId, question.id);
    }
    setAnswersClickable(false);
  }
  const answerClass = answersClickable
    ? "border-solid border-2 border-gray-300 p-4 rounded-2xl cursor-pointer hover:bg-[#F3F8FE] text-[16px] flex flex-row items-center justify-center"
    : "border-solid border-2 border-gray-300 p-4 rounded-2xl cursor-not-allowed text-[16px] flex flex-row items-center justify-center";
  return (
    <div className="question_container w-full h-full min-h-[450px]">
      <div className="question_content w-full min-w-min h-[150px] border-solid border-2 border-gray-300 mb-10 rounded-2xl flex flex-row items-center justify-center text-[18px]">
        <p className="overflow-y-auto w-11/12 min-w-min h-[80%] flex flex-row items-center justify-center">
          {question.content}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full h-auto">
        {question.answers.map((answer) => (
          <div
            key={answer.id}
            className={answerClass}
            onClick={() => handleAnswerClick(answer.id)}
          >
            <p>{answer.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;
