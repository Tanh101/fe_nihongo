import React from "react";
import { FlashCardDeck } from "../Definition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import "./FlashCardShowCase.scss";
import { useNavigate } from "react-router-dom";

interface FlashCardShowCaseProps {
  flashCardDeck: FlashCardDeck;
}

const FlashCardShowCase: React.FC<FlashCardShowCaseProps> = ({
  flashCardDeck,
}) => {
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate(`/flashcard/${flashCardDeck.id}`);
  };
  return (
    <div
      className="flash_card_show_case w-[70%] h-[80px] bg-white rounded-[0.25rem] cursor-pointer mb-4 flex flex-row hover:borer-b-violet-500"
      onClick={handleOnClick}
    >
      <div className="w-[50px] h-[80px] flex flex-row justify-center items-center ml-2">
        <FontAwesomeIcon
          icon={faFolder}
          size="2xl"
          style={{ color: "#2E3856" }}
        />
      </div>
      <div className="flash_card_show_case_title_container w-full h-full flex flex-col justify-start items-center ml-[15px]">
        <p className="flash_card_show_case_length font-medium text-[15px]  mt-[14px] w-full h-[40px] text-[#2E3856]">
          {flashCardDeck.flashCardInstances.length}&nbsp;
          {flashCardDeck.flashCardInstances.length > 1 ? "words" : "word"}
        </p>
        <p className="flash_card_show_case_title text-[18px] font-semibold  mb-[18px] w-full h-[40px] text-[#2E3856]">
          {flashCardDeck.name}
        </p>
      </div>
    </div>
  );
};

export default FlashCardShowCase;
