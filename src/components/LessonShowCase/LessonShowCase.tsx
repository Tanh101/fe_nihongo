import React from "react";
import { useNavigate } from "react-router-dom";
import "./LessonShowCase.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faLock,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { Popconfirm } from "antd";
import customAxios from "../../api/AxiosInstance";
import { Toastify } from "../../toastify/Toastify";

interface LessonShowCaseProps {
  lessonName: string;
  lessonId: string;
  lesssonDescription?: string;
  lessonStatus: string;
  isLastInChapter: boolean;
  openLesson: boolean;
  setOpenLesson: (value: boolean) => void;
  currentClickedLesson: string;
  setCurrentClickedLesson: (value: string) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  isChapterFinished: boolean;
}

const LessonShowCase: React.FC<LessonShowCaseProps> = (props) => {
  const navigate = useNavigate();
  const handleLessonClick = () => {
    if (props.lessonStatus === "finished" || props.lessonStatus === "unlocked")
      if (props.openLesson === false) {
        props.setCurrentClickedLesson(props.lessonId);
        props.setOpenLesson(true);
      } else if (props.currentClickedLesson !== props.lessonId) {
        props.setOpenLesson(true);
        props.setCurrentClickedLesson(props.lessonId);
      } else {
        props.setOpenLesson(false);
      }
  };
  const handlePopupCancel = () => {
    props.setOpenLesson(false);
    props.setCurrentClickedLesson("");
  };
  const handleStartLesson = async () => {
    props.setOpenLesson(false);
    await customAxios.post("/learn/" + props.lessonId).then((res) => {
      if (res.status === 200) {
        navigate("/Lessons/" + props.lessonId);
      } else {
        Toastify.warning("You haven't unlocked this lesson yet!");
      }
    });
  };

  const progressBarClass = props.isLastInChapter
    ? "hidden"
    : props.lessonStatus === "finished"
    ? "lesson_progress_vertical_bar absolute mt-[87px] left-[58px] w-[4px] h-[35px] bg-emerald-500 z-10"
    : "lesson_progress_vertical_bar absolute mt-[87px] left-[58px] w-[4px] h-[35px] bg-gray-300 z-10";

  const imgClass =
    props.lessonStatus === "finished"
      ? "lesson_image object-cover p-[5px] border-solid border-[4px] border-emerald-500 z-20"
      : "lesson_image object-cover p-[5px] border-solid border-[4px] border-gray-300 z-20";
  const checkIconClass =
    props.lessonStatus === "finished"
      ? "lesson_check_icon w-[24px] h-[24px] text-emerald-500 absolute top-[81px] left-[46px] z-30 bg-white rounded-full border-solid border-2 border-white"
      : "hidden";
  const lockIconClass =
    props.lessonStatus === "unlocked"
      ? "hidden"
      : props.lessonStatus === "finished"
      ? "hidden"
      : "lesson_lock_icon absolute top-[34px] left-[45px] z-30 rounded-full ";
  const LessonShowCaseClass =
    props.lessonStatus === "unlocked" || props.lessonStatus === "finished"
      ? "lesson_showcase relative min-w-min w-4/5 h-28 rounded-2xl flex flex-row justify-between items-center px-4 cursor-pointer mb-2 mt-1"
      : "lesson_showcase relative min-w-min w-4/5 h-28 rounded-2xl flex flex-row justify-between items-center px-4 cursor-not-allowed mb-2 mt-1 opacity-[0.5]";
  const hoverClass = props.isChapterFinished
    ? "hover:bg-[#d1fae5]"
    : props.lessonStatus === "unlocked" || props.lessonStatus === "finished"
    ? "hover:bg-green-100"
    : "";

  return (
    <Popconfirm
      title={
        <p className="text-[16px] bg-gradient-to-r from-blue-500 to-purple-500 inline-block bg-clip-text text-transparent font-bold">
          {props.lessonName}
        </p>
      }
      description={
        <div className="w-full max-w-[350px]  min-h-[70px] h-auto max-h-[250px] text-[15px] flex flex-row justify-center items-start mb-4">
          {props.lesssonDescription}
        </div>
      }
      okText="Start"
      cancelText="Later"
      open={props.openLesson && props.currentClickedLesson === props.lessonId}
      onConfirm={handleStartLesson}
      onCancel={handlePopupCancel}
      placement="bottom"
      okButtonProps={{
        style: {
          background: "linear-gradient(to right, #3B82F6, #8B5CF6)",
          borderRadius: "10px",
          width: "150px",
          height: "33px",
          transition: "background 0.3s ease",
          fontSize: "14px",
          fontWeight: "bold",
        },
        onMouseOver: (event) => {
          event.currentTarget.style.borderColor = "#60A5FA";
          event.currentTarget.style.opacity = "0.8";
        },
        onMouseLeave: (event) => {
          event.currentTarget.style.borderColor = "#3B82F6";
          event.currentTarget.style.opacity = "1";
        },
      }}
      cancelButtonProps={{
        style: {
          borderRadius: "10px",
          width: "80px",
          height: "33px",
          fontWeight: "bold",
        },
      }}
      icon={
        <FontAwesomeIcon
          icon={faPencil}
          style={{ color: "#4d5b75" }}
          className="mt-[6px] mr-2 text-[15px]"
        />
      }
      color="#ffffff"
    >
      <div
        className={LessonShowCaseClass + " " + hoverClass}
        onClick={handleLessonClick}
      >
        <div className="lesson_showcase_content min-w-min w-full flex flex-row">
          <img
            src="https://www.state.gov/wp-content/uploads/2019/04/Japan-2107x1406.jpg"
            alt="book"
            className={imgClass}
          />
          <div className={progressBarClass}></div>
          <FontAwesomeIcon
            icon={faCircleCheck}
            className={checkIconClass}
            size="xl"
          />
          <FontAwesomeIcon
            icon={faLock}
            style={{ color: "#ffffff" }}
            className={lockIconClass}
            size="2xl"
          />
          <div className="lesson_showcase_content_description flex flex-col w-10/12 h-24 min-w-min pt-[16px]">
            <span className="text-[16px] font-semibold">
              {props.lessonName}
            </span>
            <p
              className={
                "w-full h-auto max-h-[50px] text-gray-600 text-[14px] overflow-auto"
              }
              style={{
                overflowWrap: "anywhere",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {props.lesssonDescription}
            </p>
          </div>
        </div>
      </div>
    </Popconfirm>
  );
};

export default LessonShowCase;
