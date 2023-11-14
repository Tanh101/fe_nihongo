import React from "react";
import { useNavigate } from "react-router-dom";
import "./LessonShowCase.scss";

interface Props {
  lessonName: string;
  lessonId: number;
  lesssonDescription?: string;
}

const LessonShowCase: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const handleLessonClick = () => {
    navigate("/Lessons/" + props.lessonId);
  };
  return (
    <div
      className="lesson_showcase min-w-min w-4/5 h-28 rounded-2xl flex flex-row justify-between items-center px-4 cursor-pointer hover:bg-[#F3F8FE] mb-2 mt-1"
      onClick={handleLessonClick}
    >
      <div className="lesson_showcase_content min-w-min w-full flex flex-row">
        <img
          src="https://www.state.gov/wp-content/uploads/2019/04/Japan-2107x1406.jpg"
          alt="book"
          className="lesson_image object-cover p-[5px]"
        />
        <div className="lesson_progress_vertical_bar absolute left-12 bottom-"></div>
        <div className="lesson_showcase_content_description flex flex-col w-10/12 h-24 min-w-min pt-[5px]">
          <span>
            <strong>{props.lessonName}</strong>
          </span>
          <p className="text-gray-600">{props.lesssonDescription}</p>
        </div>
      </div>
    </div>
  );
};

export default LessonShowCase;
