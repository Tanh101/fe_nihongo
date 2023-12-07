import { useState } from "react";
import "./Chapter.scss";
import LessonShowCase from "../LessonShowCase/LessonShowCase";
import { JapaneseLesson } from "../Definition";

interface ChapterProps {
  lessons: JapaneseLesson[];
  chapterNumber: number;
  loading: boolean;
  setLoading: (value: boolean) => void;
}

const Chapter = ({
  lessons,
  chapterNumber,
  loading,
  setLoading,
}: ChapterProps) => {
  const [openLesson, setOpenLesson] = useState(false);
  const [currentClickedLesson, setCurrentClickedLesson] = useState(-1);

  return (
    <div className="chapter min-w-min w-full h-auto border-solid border-2 border-gray-300 rounded-2xl flex flex-col justify-between items-center mt-2 mb-10 relative z-0">
      <div className="chapter_title mb-3 mt-5 w-full px-24 z-5">
        <h4 className="font-bold text-[26px] ">Chapter {chapterNumber}</h4>
      </div>
      {lessons.map((lesson, index) => (
        <LessonShowCase
          key={index}
          lessonId={lesson.id}
          lessonName={lesson.name}
          lesssonDescription={lesson.description}
          lessonStatus={lesson.status}
          isLastInChapter={index === lessons.length - 1}
          openLesson={openLesson}
          setOpenLesson={setOpenLesson}
          currentClickedLesson={currentClickedLesson}
          setCurrentClickedLesson={setCurrentClickedLesson}
          loading={loading}
          setLoading={setLoading}
        />
      ))}
    </div>
  );
};

export default Chapter;
