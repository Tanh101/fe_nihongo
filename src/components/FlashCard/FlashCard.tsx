import React, { useState } from "react";
import "FlashCard.scss";
import { FlashCardDeck } from "../Definition";

interface FlashCardProps {
  deck: FlashCardDeck;
  currentCard: number;
  setCurrentCard: (value: number) => void;
}

const FlashCard: React.FC<FlashCardProps> = (props) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };
  const containerClass = isFlipped
    ? "flipped flash_card_instance_container w-full h-full flex flex-col items-center justify-center"
    : " flash_card_instance_container w-full h-full flex flex-col items-center justify-center";
  return (
    <div className={containerClass} onClick={handleCardFlip}>
      {isFlipped ? (
        <p className="font-semibold text-[18px]">
          {props.deck.flashCardInstances[props.currentCard].definition}
        </p>
      ) : (
        <div className="kanji_and_hiragana_container w-full h-[200px] flex flex-col items-center justify-center">
          <p className="font-semibold text-[18px]">
            {props.deck.flashCardInstances[props.currentCard].kanji}
          </p>
          <p className="font-semibold text-[18px]">
            {props.deck.flashCardInstances[props.currentCard].hiragana}
          </p>
        </div>
      )}
    </div>
  );
};

export default FlashCard;
