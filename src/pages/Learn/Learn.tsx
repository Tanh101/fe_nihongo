import { useEffect, useState } from "react";
import "./Learn.scss";
import Navbar from "../../components/Navbar/Navbar";
import Chapter from "../../components/Chapter/Chapter";
import LoadingShiba from "../../components/Loading/LoadingShiba";
import customAxios from "../../api/AxiosInstance";
import { JapaneseLesson, Topic } from "../../components/Definition";
import { useNavigate } from "react-router-dom";
function Learn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isChapterFinished, setIsChapterFinished] = useState<boolean[]>([]);
  async function getTopics() {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    if (!access_token && !refresh_token) {
      navigate("/login");
    }
    await customAxios.get("/topics").then((res) => {
      setTopics(res.data.topics);
      const tmp = res.data.topics;
      tmp.map((topic: Topic) => {
        let isFinished = true;
        topic.lessons &&
          topic.lessons.map((lesson: JapaneseLesson) => {
            if (lesson && lesson.status !== "finished") {
              isFinished = false;
            }
          });
        setIsChapterFinished((prev) => [...prev, isFinished]);
      });
    });
    setLoading(false);
  }

  useEffect(() => {
    getTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
          {topics.map((topic, index) => {
            if (topic.lessons.length >= 1 && topic.lessons[0] === null)
              return (
                <Chapter
                  key={index}
                  lessons={topic?.lessons}
                  chapterNumber={index + 1}
                  loading={loading}
                  setLoading={setLoading}
                  isChapterFinished={isChapterFinished[index]}
                />
              );
            else return null;
          })}
        </div>
      </div>
      {loading && <LoadingShiba />}
    </div>
  );
}

export default Learn;
