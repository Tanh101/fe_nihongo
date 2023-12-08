import React from "react";
import "./VocabularyComponent.scss";
import { Word } from "../Definition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

interface VocabularyProps {
  word: Word;
  handleNext: () => void;
}

const VocabularyComponent: React.FC<VocabularyProps> = ({
  word,
  handleNext,
}) => {
  return (
    <div className="rounded p-5 bg-white mt-5 border border-gray-300 w-4/5 min-h-[300px] h-[400px]">
      <h2 className="text-red-500 text-2xl font-bold mb-2">{word?.word}</h2>
      <div className="flex flex-row">
        <span className="text-gray-500 text-lg">{word?.pronunciation}</span>
        <span className="text-gray-500 text-lg">
          「{word?.sino_vietnamese.toUpperCase()}」
        </span>
      </div>
      <div className="mt-5">
        {word?.means.map((item, index) => (
          <div className="mt-5" key={index}>
            <h3 key={index} className="text-violet-500 text-lg font-semibold">
              ◆ {item.meaning}
            </h3>
            <p className="text-red-500 text-lg mx-5 mt-2">{item.example}</p>
            <p className="text-gray-500 text-lg mx-5">{item.example_meaning}</p>
          </div>
        ))}
      </div>
      <button
        className="next_button w-[130px] h-[50px] rounded-full bg-blue-500 text-white fixed right-24 bottom-36 hover:bg-blue-400"
        onClick={handleNext}
      >
        Continue &nbsp;
        <FontAwesomeIcon icon={faArrowRight} style={{ color: "#ffffff" }} />
      </button>
    </div>
  );
};

export default VocabularyComponent;
