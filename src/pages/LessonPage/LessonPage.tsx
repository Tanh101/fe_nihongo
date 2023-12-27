import { useEffect, useState } from "react";
import "./LessonPage.scss";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMedal, faXmark } from "@fortawesome/free-solid-svg-icons";
import Question from "../../components/Question/Question";
import Heart from "../../components/Heart/Heart";
import { Modal, Progress } from "antd";
import Explenation from "../../components/Explenation/Explenation";
import ShibaCry from "../../assets/shiba_cry.png";
import ShibaCongratulate from "../../assets/shiba_congratulate.png";
import customAxios from "../../api/AxiosInstance";
import { Vocabulary } from "../../components/Definition";
import LoadingShiba from "../../components/Loading/LoadingShiba";
import VocabularyComponent from "../../components/VocabularyComponent/VocabularyComponent";
import Party from "../../assets/party.gif";

const LessonPage = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [lives, setLives] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showExplenation, setShowExplenation] = useState(false);
  const [answersClickable, setAnswersClickable] = useState(true);
  const [failed, setFailed] = useState(false);
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [currentVocabularyIndex, setCurrentVocabularyIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [proggress, setProggress] = useState(1);
  const [finished, setFinished] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [loading, setLoading] = useState(false);
  const handleOk = () => {
    setIsModalOpen(false);
    navigate("/Learn");
  };
  async function getVocabularies() {
    setLoading(true);
    await customAxios.get(`/lessons/${lessonId}`).then((res) => {
      setVocabularies(res.data.lesson.vocabularies);
      const totalCount = countTotalQuestions(res.data.lesson.vocabularies);
      setTotalQuestions(totalCount + 1);
      setLoading(false);
    });
  }
  useEffect(() => {
    getVocabularies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(vocabularies);
  }, [vocabularies]);

  const countTotalQuestions = (vocabularies: Vocabulary[]) => {
    return vocabularies.reduce((total, vocabulary) => {
      return total + vocabulary.questions.length;
    }, 0);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleNext = () => {
    if (showQuestion) {
      if (
        currentQuestionIndex >=
        vocabularies[currentVocabularyIndex].questions.length - 1
      ) {
        if (currentVocabularyIndex >= vocabularies.length - 1) {
          setFinished(true);
        } else {
          setShowQuestion(false);
          setCurrentVocabularyIndex((prevIndex) => prevIndex + 1);
          setCurrentQuestionIndex(0);
        }
      } else {
        // Otherwise, move to the next question
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setAnswersClickable(true);
      }
    } else {
      setShowQuestion(true);
      setAnswersClickable(true); // Switch to showing the first question
    }
  };
  const handleAnswer = async (answerId: string, questionId: string) => {
    const element = document.getElementById(answerId.toString()) as HTMLElement;
    const formData = new FormData();
    formData.append("answer", answerId.toString());
    formData.append("question_id", questionId.toString());
    await customAxios.patch(`/check/${lessonId}`, formData).then((res) => {
      if (res.data.message === "Correct answer") {
        element.classList.add(
          "bg-emerald-200",
          "border-solid",
          "border-2",
          "border-green-500"
        );
        setTimeout(() => {
          element.classList.remove(
            "bg-emerald-200",
            "bg-red-200",
            "border-solid",
            "border-2",
            "border-green-500"
          );
          handleNext();
        }, 500);
      } else {
        element.classList.add(
          "border-solid",
          "border-2",
          "border-red-600",
          "bg-red-200"
        );

        setCorrectAnswer(res.data.correct_answer.content);
        setLives((prevCount) => Math.max(prevCount - 1, 0));
        setShowExplenation(true);
      }
      setProggress((prevProggress) => prevProggress + 1);
    });
  };
  const handleLessonCancel = () => {
    setIsModalOpen(true);
  };

  const handleCloseExplenation = () => {
    setShowExplenation(false);
    if (lives === 0) {
      setFailed(true);
    } else {
      handleNext();
      setAnswersClickable(true);
    }
  };

  const handleTryAgain = () => {
    setFailed(false);
    navigate("/Learn");
  };

  const handleFinish = () => {
    setFinished(false);
    navigate("/Learn");
  };

  return (
    <div className="lesson_page_container w-full h-full flex flex-col items-center bg-[#F6F7FB]">
      <button
        className="cancel_button w-[50px] h-[50px] rounded-full border-solid border-2 border-gray-300 fixed hover:bg-gray-200 top-4 right-4 flex flex-row items-center justify-center"
        onClick={handleLessonCancel}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
      <Heart count={lives} />
      {showExplenation && (
        <p className="minus_life_text text-[#f01461] absolute top-[18px] left-[200px] text-2xl font-semibold">
          -1
        </p>
      )}
      <div className="lesson_page_question_counter w-[600px] h-16 flex flex-row justify-center items-center text-xl font-semibold">
        <Progress
          percent={Math.round((proggress / totalQuestions) * 100)}
          showInfo={false}
          strokeColor={"#10B981"}
          strokeWidth={12}
        />
      </div>
      <div className="lesson_page_content min-w-min h-[80%] min-h-[450px] mt-20 flex flex-col items-center justify-start p-10">
        {vocabularies?.length > 0 && !showQuestion && (
          <VocabularyComponent
            word={vocabularies[currentVocabularyIndex].word}
            handleNext={handleNext}
          />
        )}

        {vocabularies?.length > 0 && showQuestion && (
          <Question
            question={
              vocabularies[currentVocabularyIndex].questions[
                currentQuestionIndex
              ]
            }
            onAnswerClick={handleAnswer}
            answersClickable={answersClickable}
            setAnswersClickable={setAnswersClickable}
          />
        )}
      </div>
      <Modal
        okButtonProps={{
          style: {
            background: "linear-gradient(to right, #3B82F6, #8B5CF6)",
          },
          onMouseOver: (event) => {
            event.currentTarget.style.opacity = "0.8";
            event.currentTarget.style.borderColor = "#60A5FA";
          },
          onMouseLeave: (event) => {
            event.currentTarget.style.opacity = "1";
            event.currentTarget.style.borderColor = "#ffffff";
          },
        }}
        title="Are you sure you want to quit?"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleModalCancel}
        closable={false}
        okText="Quit"
      >
        <p>Your progress on this lesson will be deleted</p>
      </Modal>
      {showExplenation ? (
        <Explenation
          handleClose={handleCloseExplenation}
          correctAnswer={correctAnswer}
          explenationText={
            vocabularies[currentVocabularyIndex].word.means[0].meaning
          }
        />
      ) : null}
      <Modal
        okButtonProps={{
          style: {
            background: "linear-gradient(to right, #3B82F6, #8B5CF6)",
            width: "120px",
            height: "40px",
            fontSize: "16px",
            borderRadius: "10px",
          },
          onMouseOver: (event) => {
            event.currentTarget.style.opacity = "0.8";
            event.currentTarget.style.borderColor = "#60A5FA";
          },
          onMouseLeave: (event) => {
            event.currentTarget.style.opacity = "1";
            event.currentTarget.style.borderColor = "#ffffff";
          },
        }}
        title={
          <div className="w-full h-[50px] flex flex-row items-center justify-center text-2xl font-semibold mt-[20px]">
            You have failed to learn the lesson !
          </div>
        }
        open={failed}
        onOk={handleTryAgain}
        onCancel={handleModalCancel}
        closable={false}
        cancelButtonProps={{ style: { display: "none" } }}
        okText="Try Again"
      >
        <div className="w-full h-[300px] flex flex-col items-center justify-center mt-[50px]">
          <img
            src={ShibaCry}
            alt="shiba cry"
            className="w-[60%] h-[300px] object-cover pr-[15px]"
          />
          <p className="text-xl font-semibold w-full h-[20px] flex flex-row items-center justify-center mb-[100px] ">
            Please try again
          </p>
        </div>
      </Modal>
      <Modal
        okButtonProps={{
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
            width: "120px",
            height: "40px",
            fontSize: "16px",
            borderRadius: "10px",
          },
          onMouseOver: (event) => {
            event.currentTarget.style.opacity = "0.8";
            event.currentTarget.style.borderColor = "#60A5FA";
          },
          onMouseLeave: (event) => {
            event.currentTarget.style.opacity = "1";
            event.currentTarget.style.borderColor = "#ffffff";
          },
        }}
        title={
          <div className="w-full h-[80px] flex flex-row justify-center items-center">
            <img
              src={Party}
              className="w-[60px] h-[60px] transform scale-x-[-1]"
            />
            <div className="w-[80%] h-[50px] flex flex-row items-center justify-center text-2xl font-semibold mt-[20px]">
              You have finished the lesson!
            </div>
            <img src={Party} className="w-[60px] h-[60px]" />
          </div>
        }
        open={finished}
        onOk={handleFinish}
        closable={false}
        cancelButtonProps={{ style: { display: "none" } }}
        okText="Finish"
      >
        <div className="w-full h-[300px] flex flex-col items-center justify-center mt-[50px]">
          <img
            src={ShibaCongratulate}
            alt="shiba cry"
            className="w-[60%] h-[300px] object-cover pr-[15px]"
          />
          <p className="text-xl font-semibold w-full h-[20px] flex flex-row items-center justify-center mb-[100px] ">
            Congratulations
            <FontAwesomeIcon
              icon={faMedal}
              className="text-amber-400 ml-1 text-[24px]"
            />
          </p>
        </div>
      </Modal>
      {loading && <LoadingShiba />}
    </div>
  );
};

export default LessonPage;
