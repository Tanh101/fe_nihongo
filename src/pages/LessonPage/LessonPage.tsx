import { useState } from "react";
import "./LessonPage.scss";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { questions } from "../../components/DummyData";
import Question from "../../components/Question/Question";
import Heart from "../../components/Heart/Heart";
import { Modal, Progress } from "antd";
import Explenation from "../../components/Explenation/Explenation";
import ShibaCry from "../../assets/shiba_cry.png";
import { japaneseLessons1, japaneseLessons2 } from "../../components/DummyData";

const LessonPage = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showExplenation, setShowExplenation] = useState(false);
  const [answersClickable, setAnswersClickable] = useState(true);
  const [failed, setFailed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(true);
  const handleOk = () => {
    setIsModalOpen(false);
    navigate("/Learn");
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };
  const handleAnswer = () => {
    if (isCorrect === false) {
      setLives((prevCount) => Math.max(prevCount - 1, 0));
      setShowExplenation(true);
    } else {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setAnswersClickable(true);
      } else {
        const lessonIndex1 = japaneseLessons1.findIndex(
          (lesson) => lesson.id === Number(lessonId)
        );
        const lessonIndex2 = japaneseLessons1.findIndex(
          (lesson) => lesson.id === Number(lessonId)
        );
        if (lessonIndex1 !== -1) {
          japaneseLessons1[lessonIndex1].status = "finished";
          if (lessonIndex1 < japaneseLessons1.length - 1) {
            if (japaneseLessons1[lessonIndex1 + 1].status !== "finished")
              japaneseLessons1[lessonIndex1 + 1].status = "unlocked";
          } else japaneseLessons2[0].status = "unlocked";
          navigate("/Learn");
        } else if (lessonIndex2 !== -1) {
          japaneseLessons2[lessonIndex2].status = "finished";
          if (lessonIndex2 < japaneseLessons2.length - 1)
            japaneseLessons2[lessonIndex2 + 1].status = "unlocked";
          navigate("/Learn");
        }
      }
    }
  };
  const handleLessonCancel = () => {
    setIsModalOpen(true);
  };

  const handleCloseExplenation = () => {
    setShowExplenation(false);
    if (lives === 0) {
      setFailed(true);
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setAnswersClickable(true);
    }
  };

  const handleTryAgain = () => {
    setFailed(false);
    navigate("/Learn");
  };

  return (
    <div className="lesson_page_container w-full h-full flex flex-col items-center">
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
          percent={Math.round(
            ((currentQuestionIndex + 1) / questions.length) * 100
          )}
          showInfo={false}
          strokeColor={"#10B981"}
          strokeWidth={12}
        />
      </div>
      <div className="lesson_page_content min-w-min h-[80%] min-h-[450px] mt-20">
        <Question
          question={questions[currentQuestionIndex]}
          onAnswerClick={handleAnswer}
          answersClickable={answersClickable}
          setAnswersClickable={setAnswersClickable}
        />
      </div>
      <Modal
        okButtonProps={{
          style: { background: "linear-gradient(to right, #3B82F6, #8B5CF6)" },
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
          correctAnswer={"Correct Answer: ABC"}
          explenationText={"Because its easy"}
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
    </div>
  );
};

export default LessonPage;
