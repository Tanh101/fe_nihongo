import React from "react";
import "./Lessonpage.scss";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const LessonPage = () => {
  const { lessonId } = useParams();
  return (
    <div className="lesson_page_container w-full h-full">
      <button className="cancel_button w-[50px] h-[50px] rounded-full border-solid border-2 border-gray-300 fixed">
        <FontAwesomeIcon icon={faXmark} />
      </button>
      <div className="lesson_page_content min-w-min h-54 border-solid border-2 border-gray-300">
        <h1>Lesson {lessonId}</h1>
      </div>
    </div>
  );
};

export default LessonPage;
