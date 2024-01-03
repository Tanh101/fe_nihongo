import { useState, ChangeEvent, useEffect } from "react";
import "./EditFlashCardPage.scss";
import Navbar from "../../components/Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FlashCardInstance } from "../../components/Definition";
import { useNavigate, useParams } from "react-router-dom";
import { Toastify } from "../../toastify/Toastify";
import { v4 as uuidv4 } from "uuid";
import customAxios from "../../api/AxiosInstance";
import LoadingShiba from "../../components/Loading/LoadingShiba";

interface RowComponentProps {
  data: FlashCardInstance;
  onChange: (field: keyof FlashCardInstance, value: string, id: string) => void;
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
      className="flashcard_input w-full h-[200px] flex flex-col items-center justify-start rounded-[12px] p-4 bg-white mb-5"
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
      <div className="w-full h-100px flex flex-row items-center justify-between mt-[40px]">
        <div className="w-[48%] h-[80px] flex flex-col items-center justify-center mt-[-16px]">
          <p className="text-[16px] text-[#929BB4] mb-2 font-semibold">Word</p>
          <input
            name="word"
            placeholder='Example: "好影響"'
            value={data.word}
            className=" underlined_border w-full h-[50px] p-4 focus:ring-0"
            type="text"
            onChange={(e) => onChange("word", e.target.value, data.id)}
          />
        </div>
        <div className="w-[48%] h-[80px] flex flex-col items-center justify-center mt-[-16px]">
          <p className="text-[16px] text-[#929BB4] mb-2 font-semibold">
            Definition
          </p>
          <input
            name="definition"
            placeholder='Example: "good influence"'
            value={data.definition}
            className="underlined_border w-full h-[50px]  p-4 focus:ring-0"
            type="text"
            onChange={(e) => onChange("definition", e.target.value, data.id)}
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

function EditFlashcardPage() {
  const navigate = useNavigate();
  const { flashCardDeckId } = useParams();
  const [rows, setRows] = useState<FlashCardInstance[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  async function getFlashCardDeck() {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    if (!access_token && !refresh_token) {
      navigate("/login");
    }
    await customAxios.get(`/flashcard/${flashCardDeckId}`).then((res) => {
      const { flashcard } = res.data;
      setRows(flashcard.cards);
      setTitle(flashcard.name);
      setDescription(flashcard.description);
      if (flashcard.cards.length > 1) {
        setIsDisabled(false);
      }
      setLoading(false);
    });
  }
  useEffect(() => {
    getFlashCardDeck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (
    field: keyof FlashCardInstance,
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
    console.log(rows);
  };

  const handleAddFields = () => {
    const newRow: FlashCardInstance = {
      id: uuidv4(),
      word: "",
      definition: "",
    };
    setRows([...rows, newRow]);
    setIsDisabled(false);
  };

  const handleAddFieldsBetween = (index: number) => {
    const newRow: FlashCardInstance = {
      id: uuidv4(),
      word: "",
      definition: "",
    };
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows.splice(index + 1, 0, newRow);
      return updatedRows;
    });
  };

  const handleRemoveFields = async (rowId: string) => {
    const indexToRemove = rows.findIndex((row) => row.id === rowId);
    if (indexToRemove !== -1) {
      await customAxios.delete(`/card/${rowId}`).then((res) => {
        if (res.status === 200) {
          const updatedRows = [...rows];
          updatedRows.splice(indexToRemove, 1);
          setRows(updatedRows);
          if (updatedRows.length === 1) {
            setIsDisabled(true);
          }
        } else {
          Toastify.error("Error updating flashcard");
        }
      });
    }
  };

  const handleSaveClick = async (e: React.FormEvent) => {
    if (title === "") {
      Toastify.error("Please enter a title!");
      return;
    }

    for (let i = 0; i < rows.length; i++) {
      if (rows[i].word === "" || rows[i].definition === "") {
        Toastify.error("Some fields are missing!");
        return;
      }
    }
    e.preventDefault();

    await customAxios
      .put(`/flashcard/${flashCardDeckId}`, {
        name: title,
        description: description,
        cards: rows,
      })
      .then((res) => {
        if (res.status === 200) {
          resetFields();
          Toastify.success("Flashcard updated successfully");
          navigate("/flashcard");
        } else {
          Toastify.error("Error updating flashcard");
        }
      });
  };

  const onTitleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onDescriptionInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const resetFields = () => {
    setRows([{ id: Date.now().toString(), word: "", definition: "" }]);
    setTitle("");
    setDescription("");
  };

  const handleBack = () => {
    navigate(`/flashcard/${flashCardDeckId}`);
  };

  return (
    <div className="create_flashcardpage_container overflow-y-scroll bg-[#F6F7FB]">
      <Navbar active_category="flashcard"></Navbar>
      {loading === false ? (
        <div>
          <div className="create_flashcard_page_content w-full h-screen pt-24 flex flex-col items-center justify-start ">
            <button
              className="w-[100px] h-[50px] absolute left-[15px] top-[100px] text-[14px] text-[#2E3856] bg-white border-2 border-solid border-violet-500 rounded-[10px] font-semibold hover:bg-violet-100"
              onClick={handleBack}
            >
              <FontAwesomeIcon icon={faArrowLeftLong} /> Back
            </button>
            <div className="create_flashcard_page_title_container w-[70%] h-[100px] flex flex-row items-center justify-between min-w-max">
              <p className="create_flashcard_page_title text-2xl font-semibold text-black h-[40px] mt-2">
                Edit flashcard
              </p>
              <button
                className="create_flashcard_button w-[90px] h-[40px] rounded-xl bg-violet-500 text-white bottom-24 hover:bg-violet-400"
                onClick={handleSaveClick}
              >
                Save
              </button>
            </div>
            <div className="create_flashcards_list w-[70%] h-auto min-w-max mt-10">
              <div className="flashcard_description_input_container">
                <input
                  placeholder='Enter title, example "N1 Kanji"'
                  className="title_input w-full h-[50px] rounded-[12px] p-4 bg-white focus:ring-violet-500"
                  type="text"
                  onChange={onTitleInputChange}
                  value={title}
                  maxLength={32}
                ></input>
                <textarea
                  placeholder="Enter description..."
                  className="w-full h-[120px] rounded-[12px] p-4 mt-5 bg-white focus:ring-violet-500"
                  rows={4}
                  typeof="text"
                  onChange={onDescriptionInputChange}
                  value={description}
                  maxLength={600}
                ></textarea>
                <div className="flashcard_word_input_list w-full mt-8">
                  <form className="w-full">
                    {rows?.map((row, index) => {
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
                        ADD CARD
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {loading && <LoadingShiba />}
    </div>
  );
}

export default EditFlashcardPage;
