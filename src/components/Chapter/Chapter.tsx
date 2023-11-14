import React from "react";
import "./Chapter.scss";
import LessonShowCase from "../LessonShowCase/LessonShowCase";
import { JapaneseLesson } from "../DummyData";

interface ChapterProps {
  lessons: JapaneseLesson[];
  chapterNumber: number;
}

const Chapter = ({ lessons, chapterNumber }: ChapterProps) => {
  return (
    <div className="chapter min-w-min w-full h-auto border-solid border-2 border-gray-300 rounded-2xl flex flex-col justify-between items-center mt-2 mb-10">
      <div className="chapter_title mb-3 mt-5 w-full px-24">
        <h4 className="font-bold text-[26px]">Chapter {chapterNumber}</h4>
      </div>
      {lessons.map((lesson, index) => (
        <LessonShowCase
          key={index}
          lessonId={lesson.id}
          lessonName={lesson.name}
          lesssonDescription={lesson.description}
        />
      ))}
    </div>
  );
};

export default Chapter;
