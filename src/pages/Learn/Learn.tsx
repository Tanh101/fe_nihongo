import React, { useEffect, useState } from "react";
import "./Learn.scss";
import Navbar from "../../components/Navbar/Navbar";
import { japaneseLessons1 } from "../../components/DummyData";
import { japaneseLessons2 } from "../../components/DummyData";
import Chapter from "../../components/Chapter/Chapter";

function Learn() {
  return (
    <div className="page_container">
      <Navbar active_category="learn"></Navbar>
      <div className="learn_page_content overflow-y-scroll">
        <div className="learn_page_title_container">
          <p className="learn_page_title text-3xl font-semibold text-black text-center mb-1">
            Lessons
          </p>
        </div>
        <div className="lessons_list flex flex-col ">
          <Chapter lessons={japaneseLessons1} chapterNumber={1}></Chapter>
          <Chapter lessons={japaneseLessons2} chapterNumber={2}></Chapter>
        </div>
      </div>
    </div>
  );
}

export default Learn;
