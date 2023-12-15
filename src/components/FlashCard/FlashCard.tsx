import React, { useState, useEffect } from "react";
import "./FlashCard.scss";
import { FlashCardDeck } from "../Definition";

interface FlashCardProps {
  deck: FlashCardDeck;
  currentCard: number;
}

const FlashCard: React.FC<FlashCardProps> = ({ deck, currentCard }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isNewNext, setIsNewNext] = useState(false);
  const [isNewPrevious, setIsNewPrevious] = useState(false);
  const [previousCard, setPreviousCard] = useState(0);
  const [currentCardText, setCurrentCardText] = useState(
    deck.flashCardInstances[currentCard].word
  );

  const handleCardFlip = () => {
    setIsVisible(false);
    setIsFlipped((prev) => {
      if (isFlipped) {
        setCurrentCardText(deck.flashCardInstances[currentCard].word);
      } else {
        setCurrentCardText(deck.flashCardInstances[currentCard].definition);
      }
      return !prev;
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 150);
    return () => clearTimeout(timer);
  }, [isFlipped]);

  useEffect(() => {
    setIsVisible(false);
    if (currentCard !== previousCard) {
      if (currentCard > previousCard) {
        if (isNewNext) {
          setIsNewNext(false);
        }
        setTimeout(() => {
          setIsFlipped(false);
          setIsNewNext(true);
          setCurrentCardText(deck.flashCardInstances[currentCard].word);
        }, 20);
      } else {
        if (isNewPrevious) {
          setIsNewPrevious(false);
        }
        setTimeout(() => {
          setIsFlipped(false);
          setIsNewPrevious(true);
          setCurrentCardText(deck.flashCardInstances[currentCard].word);
        }, 20);
      }
      setPreviousCard(currentCard);
    }
    const timer1 = setTimeout(() => {
      setIsVisible(true);
    }, 20);
    const timer2 = setTimeout(() => {
      setIsNewNext(false);
      setIsNewPrevious(false);
    }, 200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [previousCard, currentCard]);

  return (
    <div
      className={`${isFlipped ? "flipped" : "unflipped"} ${
        isNewNext ? "new_next" : isNewPrevious ? "new_previous" : ""
      } flash_card_instance_container w-[80%] h-[500px] flex flex-col items-center justify-center bg-white rounded-[8px] mt-5`}
      onClick={handleCardFlip}
    >
      <p
        className={`${
          isFlipped ? "flip_text" : "unflip_text"
        } definition_container font-medium text-[50px] text-[#2E3856]`}
        hidden={!isVisible}
      >
        {currentCardText}
      </p>
    </div>
  );
};

export default FlashCard;
