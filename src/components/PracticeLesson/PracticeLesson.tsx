import React from "react";
import { useNavigate } from "react-router-dom";
import "./PracticeLesson.scss";

interface PracticeLessonProps {
  lessonName: string;
  lessonId: number;
  lesssonDescription?: string;
}
const PracticeLesson: React.FC<PracticeLessonProps> = ({
  lessonName,
  lessonId,
  lesssonDescription,
}) => {
  const navigate = useNavigate();
  const handleLessonClick = () => {
    navigate("/Lessons/" + lessonId);
  };
  return (
    <div
      className="min-w-min w-4/5 h-28 rounded-2xl flex flex-row justify-start items-center px-4 cursor-pointer mb-2 mt-1 border-2 border-solid border-gray-300 hover:bg-emerald-100"
      onClick={handleLessonClick}
    >
      <img
        className="w-[85px] h-[85px] rounded-full mr-[15px] border-[3px] border-solid border-gray-300 p-[4px] object-fit"
        src="https://www.state.gov/wp-content/uploads/2019/04/Japan-2107x1406.jpg"
      ></img>
      <div className="practice_lesson_description w-[80%] h-[80px] flex flex-col items-start justify-center">
        <p className="practice_lesson_name text-[18px] font-semibold text-[#2E3856] ">
          {lessonName}
        </p>
        <p
          className={
            "w-full h-auto max-h-[50px] text-gray-600 text-[14px] overflow-auto"
          }
          style={{
            overflowWrap: "anywhere",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {lesssonDescription}
        </p>
      </div>
    </div>
  );
};

export default PracticeLesson;
