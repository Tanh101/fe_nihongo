import React from "react";

interface FlashCardShowCaseProps {
  flashCardName: string;
  flashCardId: number;
  flashCardLength: number;
}

const FlashCardShowCase: React.FC<FlashCardShowCaseProps> = (props) => {
  return (
    <div className="flash_card_show_case w-[80%] h-[80px]">
      <div className="flash_card_show_case_title_container w-full h-full flex flex-col justify-start items-center">
        <p className="flash_card_show_case_length font-semibold text-black text-center mb-1 w-full h-[40px]">
          {props.flashCardLength}
        </p>
        <p className="flash_card_show_case_title text-xl font-semibold text-black text-center mb-1 w-full h-[40px]">
          {props.flashCardName}
        </p>
      </div>
    </div>
  );
};

export default FlashCardShowCase;
