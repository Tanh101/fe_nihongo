import { useState } from "react";
import "./Chapter.scss";
import LessonShowCase from "../LessonShowCase/LessonShowCase";
import { JapaneseLesson } from "../Definition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { Progress } from "antd";
interface ChapterProps {
  lessons: JapaneseLesson[];
  chapterNumber: number;
  loading: boolean;
  setLoading: (value: boolean) => void;
  isChapterFinished: boolean;
}

const Chapter = ({
  lessons,
  chapterNumber,
  loading,
  setLoading,
  isChapterFinished,
}: ChapterProps) => {
  const [openLesson, setOpenLesson] = useState(false);
  const [currentClickedLesson, setCurrentClickedLesson] = useState(-1);

  const chapterClassName = isChapterFinished
    ? "border-solid border-2 border-emerald-500 bg-green-50"
    : "border-solid border-2 border-gray-300";

  const totalFinishedLessons =
    lessons && lessons.length > 0
      ? lessons.filter((lesson) => lesson && lesson.status === "finished")
          .length
      : 0;
  const progressPercent =
    lessons && lessons.length > 0
      ? Math.round((totalFinishedLessons / lessons.length) * 100)
      : 0;

  return (
    <div
      className={`chapter ${chapterClassName} min-w-min w-full h-auto min-h-[200px] rounded-2xl flex flex-col justify-between items-center mt-2 mb-10 relative z-0`}
    >
      <div className="chapter_title mb-3 mt-5 w-full px-24 z-5 flex flex-row justfy-center items-center">
        <h4 className="font-bold text-[26px] ">Chapter {chapterNumber}</h4>
        <FontAwesomeIcon
          icon={faCircleCheck}
          className={
            isChapterFinished ? "text-emerald-500 text-[20px] ml-2" : "hidden"
          }
          beat
        />
      </div>
      <div style={{ position: "relative", width: "80%" }}>
        <Progress
          percent={progressPercent}
          showInfo={false}
          strokeColor={"#10B981"}
          strokeWidth={10}
          className="w-[100%] h-[20px] mb-5 ml-2"
        />
        <p
          style={{
            left: `${progressPercent}%`,
            top: "5px",
          }}
          className="absolute text-[9px] font-semibold h-[20px] w-[40px] bg-emerald-500 text-white rounded-full flex flex-row items-center justify-center"
        >
          {progressPercent}%
        </p>
      </div>
      {lessons.length > 0 &&
        lessons.map(
          (lesson, index) =>
            lesson && (
              <LessonShowCase
                key={index}
                lessonId={lesson.lessonId}
                lessonName={lesson.lessonTitle}
                lesssonDescription={lesson.lessonDescription}
                lessonStatus={lesson.status}
                isLastInChapter={index === lessons.length - 1}
                openLesson={openLesson}
                setOpenLesson={setOpenLesson}
                currentClickedLesson={currentClickedLesson}
                setCurrentClickedLesson={setCurrentClickedLesson}
                loading={loading}
                setLoading={setLoading}
                isChapterFinished={isChapterFinished}
              />
            )
        )}
    </div>
  );
};

export default Chapter;
