import { useEffect, useState } from "react";
import "./PracticePage.scss";
import Navbar from "../../components/Navbar/Navbar";
import customAxios from "../../api/AxiosInstance";
import { JapaneseLesson, Topic } from "../../components/Definition";
import LoadingShiba from "../../components/Loading/LoadingShiba";
import PracticeLesson from "../../components/PracticeLesson/PracticeLesson";

function PracticePage() {
  const [loading, setLoading] = useState(true);
  const [practiceLessons, setPracticeLessons] = useState<JapaneseLesson[]>([]);

  const getPracticeLessons = async () => {
    await customAxios.get("/topics").then((res) => {
      const tmp = res.data.topics;
      tmp.map((topic: Topic) => {
        topic.lessons &&
          topic.lessons.map((lesson: JapaneseLesson) => {
            if (lesson && lesson.status === "finished") {
              setPracticeLessons((prev) => [...prev, lesson]);
            }
          });
      });
    });
    setLoading(false);
  };

  useEffect(() => {
    getPracticeLessons();
  }, []);

  return (
    <div className="page_container">
      <Navbar active_category="practice"></Navbar>
      <div className="practice_page_content overflow-y-scroll">
        <div className="practice_page_title_container items-center">
          <p className="practice_page_title text-3xl font-semibold text-black text-center">
            Practice Lessons
          </p>
        </div>
        <div className="practice_list mt-[50px]">
          {practiceLessons &&
            practiceLessons.length > 0 &&
            practiceLessons.map((lesson) => (
              <PracticeLesson
                key={lesson.lessonId}
                lessonId={lesson.lessonId}
                lessonName={lesson.lessonTitle}
                lesssonDescription={lesson.lessonDescription}
              />
            ))}
        </div>
      </div>
      {loading && <LoadingShiba />}
    </div>
  );
}

export default PracticePage;
