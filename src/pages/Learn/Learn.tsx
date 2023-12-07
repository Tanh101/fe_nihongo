import { useState } from "react";
import "./Learn.scss";
import Navbar from "../../components/Navbar/Navbar";
import { japaneseLessons1 } from "../../components/DummyData";
import { japaneseLessons2 } from "../../components/DummyData";
import Chapter from "../../components/Chapter/Chapter";
import LoadingShiba from "../../components/Loading/LoadingShiba";
function Learn() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="page_container relative">
      <Navbar active_category="learn"></Navbar>
      <div className="learn_page_content overflow-y-scroll">
        <div className="learn_page_title_container">
          <p className="learn_page_title text-3xl font-semibold text-black text-center mb-1">
            Lessons
          </p>
        </div>
        <div className="lessons_list flex flex-col ">
          <Chapter
            lessons={japaneseLessons1}
            chapterNumber={1}
            loading={loading}
            setLoading={setLoading}
          ></Chapter>
          <Chapter
            lessons={japaneseLessons2}
            chapterNumber={2}
            loading={loading}
            setLoading={setLoading}
          ></Chapter>
        </div>
      </div>
      {loading && <LoadingShiba />}
    </div>
  );
}

export default Learn;
