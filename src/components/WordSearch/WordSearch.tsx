import { useEffect, useState } from "react";
import "./WordSearch.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import DrawCanva from "../DrawCanva/DrawCanva";
import customAxios from "../../api/AxiosInstance";
import { Link } from "react-router-dom";
import { Word } from "../Definition";

// interface SuggestionMeaning {
//     id: number;
//     word_id: number;
//     meaning: string;
//     example: string;
//     example_meaning: string;
//     image: string | null;
//     created_at: string;
//     updated_at: string;
// }

// interface Suggestion {
//     id: number;
//     word: string;
//     pronunciation: string;
//     sino_vietnamese: string;
//     means: SuggestionMeaning[];
// }

interface WordSearchProps {
  input?: string;
}

const WordSearch: React.FC<WordSearchProps> = ({ input = "" }) => {
  const [openModal, setOpenModal] = useState(false);
  const [inputValue, setInputValue] = useState(input);
  const [suggestions, setSuggestions] = useState<Word[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const appendToInput = (data: string) => {
    setInputValue((prev) => prev + data);
  };

  const onBlurHandler = () => {
    setTimeout(() => {
      setIsInputFocused(false);
    }, 300);
  };

  const fetchSuggestions = async (word: string) => {
    await customAxios
      .get(`/dictionaries?word=${word}`)
      .then((res) => {
        const suggestions = res.data.words.map((item: unknown) => item);
        setSuggestions(suggestions);
      })
      .catch((err) => {
        console.log(err);
        setSuggestions([]);
      });
  };

  useEffect(() => {
    if (isInputFocused && inputValue.length > 0) {
      console.log("inputValue", inputValue);

      if (timer) {
        clearTimeout(timer);
      }

      const newTimer = setTimeout(() => {
        fetchSuggestions(inputValue);
      }, 500);

      setTimer(newTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInputFocused, inputValue]);

  useEffect(() => {
    if (inputValue.length === 0) {
      setSuggestions([]);
      if (timer) {
        clearTimeout(timer);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  return (
    <div className="word_search w-2/4">
      <form className="flex items-center">
        <label htmlFor="voice-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="w-4 h-4 text-gray-500"
            />
          </div>
          <input
            type="text"
            id="voice-search"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full ps-10 p-2.5"
            placeholder="Search Word"
            value={inputValue}
            onFocus={() => setIsInputFocused(true)}
            onBlur={onBlurHandler}
            onChange={(e) => setInputValue(e.target.value)}
          />
          {suggestions.length > 0 && isInputFocused && (
            <div className="suggestions-container z-40 absolute w-full flex flex-col border border-gray-300 bg-white rounded-lg p-3 top-12 cursor-pointer">
              {suggestions.map((suggestion, index) => (
                <Link
                  to={`/dictionary/${suggestion?.word}`}
                  key={index}
                  className="z-50 suggestion-item rounded items-center justify-between p-2.5 hover:bg-gray-50 block"
                >
                  <span className="text-gray-900 text-sm">
                    <span className="font-bold pr-2">{suggestion?.word}</span>
                    {suggestion?.pronunciation}
                  </span>
                  <p className="text-gray-900 text-sm">
                    {suggestion?.means[0]?.meaning}
                  </p>
                </Link>
              ))}
            </div>
          )}

          <div className="absolute inset-y-0 end-0 flex items-center">
            <button
              type="button"
              className="inset-y-0 end-0 flex items-center pe-3"
              onClick={() => setOpenModal(!openModal)}
            >
              <FontAwesomeIcon
                icon={faPenToSquare}
                className="w-4 h-4 text-gray-500"
              />
            </button>
            {openModal && (
              <div className="absolute flex flex-col border border-gray-300 bg-white rounded-lg p-3 top-12 right-0 z-10">
                {/* Modal content here */}

                <DrawCanva
                  setOpenModal={setOpenModal}
                  appendToInput={appendToInput}
                />
              </div>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-violet-500 rounded-lg border border-violet-500 hover:bg-violet-600 focus:ring-4 focus:outline-none focus:ring-violet-300"
        >
          <svg
            className="w-4 h-4 me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          Search
        </button>
      </form>
    </div>
  );
};

export default WordSearch;
