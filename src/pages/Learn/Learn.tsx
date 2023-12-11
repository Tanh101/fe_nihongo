import { useState } from "react";
import "./Learn.scss";
import Navbar from "../../components/Navbar/Navbar";
import Chapter from "../../components/Chapter/Chapter";
import LoadingShiba from "../../components/Loading/LoadingShiba";
import customAxios from "../../api/AxiosInstance";
import { Topic } from "../../components/Definition";
function Learn() {
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState<Topic[]>([]);
  async function getTopics() {
    await customAxios.get("/topics").then((res) => {
      setTopics(res.data.topics);
    });
    setLoading(false);
  }
  getTopics();
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
          {topics.map((topic, index) => (
            <Chapter
              key={index}
              lessons={topic?.lessons}
              chapterNumber={index + 1}
              loading={loading}
              setLoading={setLoading}
            />
          ))}
        </div>
      </div>
      {loading && <LoadingShiba />}
    </div>
  );
}

export default Learn;
