import { useState, ChangeEvent, useEffect } from "react";
import "./EditDictionaryPage.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { Toastify } from "../../../toastify/Toastify";
import { v4 as uuidv4 } from "uuid";
import customAxios from "../../../api/AxiosInstance";
import { WordMeaning } from "../../Definition";
import LoadingShiba from "../../Loading/LoadingShiba";

interface RowComponentProps {
  data: WordMeaning;
  onChange: (field: keyof WordMeaning, value: string, id: string) => void;
  index: number;
  handleRemove: () => void;
  isDisabled: boolean;
  handleAddFieldsBetween: (index: number) => void;
  rowLength: number;
}

const RowComponent: React.FC<RowComponentProps> = ({
  data,
  onChange,
  index,
  handleRemove,
  isDisabled,
  handleAddFieldsBetween,
  rowLength,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const showButton = () => {
    if (index === rowLength - 1) return;
    setIsVisible(true);
  };
  const hideButton = () => {
    setIsVisible(false);
  };
  return (
    <div
      key={data.id}
      className="flashcard_input w-full h-[300px] flex flex-col items-center justify-start rounded-[12px] p-4 bg-white mb-5"
    >
      <div className="flashcard_number w-full h-[40px] flex flex-row items-center justify-start ">
        <p className="text-[16px] w-[98%] text-[#929BB4] mb-2 ml-4 font-semibold">
          {index + 1}
        </p>
        <button
          className={`${
            isDisabled ? " bg-gray-300" : " bg-red-500 hover:bg-red-400"
          } remove_row_button w-[32px] h-[32px] rounded-lg mt-[-10px]`}
          onClick={handleRemove}
          disabled={isDisabled}
        >
          <FontAwesomeIcon icon={faMinus} style={{ color: "#ffffff" }} />
        </button>
      </div>
      <div className="w-full h-[55px] flex flex-row items-center justify-start mt-[16px]">
        <p className="text-[16px] text-[#929BB4] font-semibold w-[15%]">
          Meaning
        </p>
        <input
          name="example_meaning"
          placeholder="Enter meaning"
          value={data.meaning}
          className="answer_input rounded-[15px] bg-[#2C70AE] text-white w-[85%] h-[50px] p-4 focus:ring-0 tracking-wide focus:border-violet-500 focus:border-[3px]"
          type="text"
          onChange={(e) => onChange("meaning", e.target.value, data.id)}
        />
      </div>
      <div className="w-full h-160px flex flex-col items-center justify-between mt-[40px]">
        <div className="w-full h-[55px] flex flex-row items-center justify-start mt-[-27px]">
          <p className="text-[16px] text-[#929BB4] font-semibold w-[15%]">
            Example
          </p>
          <input
            name="example"
            placeholder="Enter example"
            value={data.example}
            className="answer_input rounded-[15px] bg-[#2C70AE] w-[85%] h-[50px] p-4 focus:ring-0 tracking-wide focus:border-violet-500 focus:border-[3px]"
            type="text"
            onChange={(e) => onChange("example", e.target.value, data.id)}
          />
        </div>
        <div className="w-full h-[55px] flex flex-row items-center justify-start mt-[10px]">
          <p className="text-[16px] text-[#929BB4] font-semibold w-[15%]">
            Example Meaning
          </p>
          <input
            name="example_meaning"
            placeholder="Enter example meaning"
            value={data.example_meaning}
            className="answer_input rounded-[15px] bg-[#2C70AE] text-white w-[85%] h-[50px] p-4 focus:ring-0 tracking-wide focus:border-violet-500 focus:border-[3px]"
            type="text"
            onChange={(e) =>
              onChange("example_meaning", e.target.value, data.id)
            }
          />
        </div>
      </div>
      <div
        className={`hidden_add_button_container flex flex-row items-center justify-center`}
        onMouseEnter={showButton}
        onMouseLeave={hideButton}
      >
        <button
          className={`${
            isVisible ? "visible_button" : "hidden_button"
          } hidden_add_button w-[35px] h-[35px] rounded-full mt-[-10px] bg-violet-500 hover:bg-violet-400`}
          onClick={(event) => {
            event.preventDefault();
            handleAddFieldsBetween(index);
          }}
        >
          <FontAwesomeIcon
            icon={faPlus}
            style={{ color: "#ffffff" }}
            size="xs"
          />
        </button>
      </div>
    </div>
  );
};

function EditDictionaryPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<WordMeaning[]>([]);
  const { wordContent } = useParams();
  const [word, setWord] = useState<string>("");
  const [wordId, setWordId] = useState<string>("");
  const [pronunciation, setPronuncitaion] = useState<string>("");
  const [sinonim, setSinonim] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  async function getDictionaryWord() {
    setLoading(true);
    await customAxios.get(`/dictionaries?word=${wordContent}`).then((res) => {
      const { words } = res.data;
      setRows(words[0].means);
      setWord(words[0].word);
      setWordId(words[0].id);
      setPronuncitaion(words[0].pronunciation);
      setSinonim(words[0].sino_vietnamese);
      if (words[0].means.length > 1) {
        setIsDisabled(false);
      }
    });
    setLoading(false);
  }
  useEffect(() => {
    getDictionaryWord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (
    field: keyof WordMeaning,
    value: string,
    id: string
  ) => {
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setRows(updatedRows);
  };
  const handleAddFields = () => {
    const newRow: WordMeaning = {
      id: uuidv4(),
      word_id: wordId,
      meaning: "",
      example: "",
      example_meaning: "",
      image: null,
      created_at: "",
      updated_at: "",
    };
    setRows([...rows, newRow]);
    setIsDisabled(false);
  };

  const handleAddFieldsBetween = (index: number) => {
    const newRow: WordMeaning = {
      id: uuidv4(),
      word_id: wordId,
      meaning: "",
      example: "",
      example_meaning: "",
      image: null,
      created_at: "",
      updated_at: "",
    };
    setRows((prevRows) => [
      ...prevRows.slice(0, index + 1),
      newRow,
      ...prevRows.slice(index + 1),
    ]);
  };

  const handleRemoveFields = (rowId: string) => {
    const indexToRemove = rows.findIndex((row) => row.id === rowId);
    if (indexToRemove !== -1) {
      const updatedRows = [...rows];
      updatedRows.splice(indexToRemove, 1);
      setRows(updatedRows);
      if (updatedRows.length === 1) {
        setIsDisabled(true);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    if (word === "") {
      Toastify.error("Please enter a word !");
      return;
    }
    if (pronunciation === "") {
      Toastify.error("Please enter a pronunciation !");
      return;
    }
    if (sinonim === "") {
      Toastify.error("Please enter a sinonim !");
      return;
    }

    for (let i = 0; i < rows.length; i++) {
      if (
        rows[i].example === "" ||
        rows[i].example_meaning === "" ||
        rows[i].meaning === ""
      ) {
        Toastify.error(`Some fields at Meaning ${i + 1} are missing !`);
        return;
      }
    }
    e.preventDefault();
    await customAxios
      .put(`/dashboard/dictionaries/${wordId}`, {
        word: word,
        pronunciation: pronunciation,
        sino_vietnamese: sinonim,
        means: rows,
      })
      .then((res) => {
        if (res.status === 200) {
          Toastify.success("Upadete word successfully");
          navigate("/dashboard/dictionary");
        } else {
          Toastify.error("Create word failed");
          return;
        }
      });
  };

  const onWordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWord(e.target.value);
  };

  const onPronunciationInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPronuncitaion(e.target.value);
  };

  const onSinonimInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSinonim(e.target.value);
  };

  const handleBack = () => {
    navigate("/dashboard/dictionary");
  };

  return (
    <div className="create_dictionarypage_container overflow-y-scroll bg-[#F6F7FB]">
      <div className="create_dictionary_page_content w-full h-screen pt-12 flex flex-col items-center justify-start ">
        <div className="create_dictionary_page_title_container w-[70%] h-[100px] flex flex-row items-center justify-between min-w-max">
          <button
            className="w-[100px] h-[50px] absolute left-[20px] top-[10px] text-[14px] text-[#2E3856] bg-white border-2 border-solid border-violet-500 rounded-[10px] font-semibold hover:bg-violet-100"
            onClick={handleBack}
          >
            <FontAwesomeIcon icon={faArrowLeftLong} /> Back
          </button>
          <p className="create_dictionary_page_title text-2xl font-semibold text-black h-[40px] mt-2">
            Edit dictionary word
          </p>
          <button
            className="create_dictionary_button w-[90px] h-[40px] rounded-xl bg-violet-500 text-white bottom-24 hover:bg-violet-400"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
        <div className="create_dictionary_list w-[70%] h-auto min-w-max mt-10">
          <div className="dictionary_description_input_container">
            <input
              placeholder='Enter word, example "戦う"'
              className="title_input w-full h-[50px] rounded-[12px] p-4 bg-white focus:ring-violet-500"
              type="text"
              onChange={onWordInputChange}
              value={word}
              maxLength={32}
            ></input>
            <input
              placeholder="Enter pronuncitation, example: たたかう"
              className="title_input w-full h-[50px] rounded-[12px] p-4 mt-5 bg-white focus:ring-violet-500"
              type="text"
              onChange={onPronunciationInputChange}
              value={pronunciation}
              maxLength={32}
            ></input>
            <input
              placeholder="Enter sinonim, example: CHIẾN"
              className="title_input w-full h-[50px] rounded-[12px] p-4 mt-5 bg-white focus:ring-violet-500"
              type="text"
              onChange={onSinonimInputChange}
              value={sinonim}
              maxLength={32}
            ></input>
            <div className="flashcard_word_input_list w-full mt-8">
              <form className="w-full">
                {rows.map((row, index) => {
                  return (
                    <RowComponent
                      key={row.id}
                      data={row}
                      onChange={handleInputChange}
                      index={index}
                      handleRemove={() => handleRemoveFields(row.id)}
                      isDisabled={isDisabled}
                      handleAddFieldsBetween={handleAddFieldsBetween}
                      rowLength={rows.length}
                    />
                  );
                })}
              </form>
              <div
                className="add_button_container w-full h-[100px] flex flex-col items-center justify-center rounded-[12px] p-4 bg-white mb-5 text-[#2E3856] cursor-pointer"
                onClick={handleAddFields}
              >
                <div className="add_flashcard_button h-[30px] pb-5 flex flex-row justify-center items-center mt-5">
                  <FontAwesomeIcon
                    icon={faPlus}
                    size="xs"
                    className="add_flashcard_icon"
                  />
                  &nbsp;{" "}
                  <p className="font-bold text-[15px] tracking-widest">
                    ADD MEANING
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && <LoadingShiba />}
    </div>
  );
}

export default EditDictionaryPage;
