import React from "react";
import "./Explenation.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
interface ExplenationProps {
  handleClose: () => void;
  explenationText: string;
  correctAnswer: string;
}
const Explenation: React.FC<ExplenationProps> = (props) => {
  const handleNext = () => {
    props.handleClose();
  };
  return (
    <div className="explenation_drawer w-full h-[300px] fixed bottom-0 z-10 flex flex-col items-center justify-start z-100">
      <div className="correct_answer w-full h-[40px] flex flex-row top-[10%] left-[10%] text-2xl font-semibold items-center justify-center mt-[10px]">
        <FontAwesomeIcon
          icon={faCircleCheck}
          style={{ color: "#39c05b", padding: "5px 0px" }}
          size="xl"
        />
        <h3 className="correct_answer_text px-2">{props.correctAnswer}</h3>
      </div>
      <div className="explenation_text w-[70%] h-[150px] flex flex-col flex flex-row items-center justify-start mt-[10px]">
        <p className="text-[18px]">{props.explenationText}</p>
        <button
          className="next_button w-[130px] h-[50px] rounded-full bg-blue-500 text-white fixed right-24 bottom-36 hover:bg-blue-400"
          onClick={handleNext}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Explenation;
