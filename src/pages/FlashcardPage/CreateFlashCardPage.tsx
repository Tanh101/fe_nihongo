import { useState, ChangeEvent } from "react";
import "./CreateFlashCardPage.scss";
import Navbar from "../../components/Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExcel,
  faMinus,
  faPlus,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FlashCardInstance } from "../../components/Definition";
import { useNavigate } from "react-router-dom";
import { Toastify } from "../../toastify/Toastify";
import { v4 as uuidv4 } from "uuid";
import * as ExcelJS from "exceljs";
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

function CreateFlashcardPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<FlashCardInstance[]>([
    { id: uuidv4(), word: "", definition: "" },
  ]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isFileUploaded, setIsFileUploaded] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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

  const handleCreate = async (e: React.FormEvent) => {
    if (title === "") {
      Toastify.error("Please enter a title !");
      return;
    }
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].word === "" || rows[i].definition === "") {
        Toastify.error("Some fields are missing !");
        return;
      }
    }
    e.preventDefault();
    await customAxios
      .post("/flashcard", {
        name: title,
        description: description,
        cards: rows,
      })
      .then((res) => {
        if (res.status === 200) {
          Toastify.success("Create flashcard successfully");
          resetFields();
          navigate("/flashcard");
        } else {
          Toastify.error("Create flashcard failed");
          return;
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
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoading(true);
    const file = event.target.files![0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const buffer = e.target!.result as ArrayBuffer;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);
      const worksheet = workbook.worksheets[0];
      const data: FlashCardInstance[] = [];
      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (
          rowNumber === 1 &&
          ((row.getCell(1).value as string).toLowerCase() === "word" ||
            (row.getCell(2).value as string).toLowerCase() === "definition")
        )
          return; // Skip header row
        const word = row.getCell(1).value as string;
        const definition = row.getCell(2).value as string;
        data.push({
          id: uuidv4(),
          word,
          definition,
        });
      });
      setTitle(file.name.split(".").slice(0, -1).join(".")); // Set the title to the file name without the extension
      setRows(data); // Set the rows to the data from the file
      setIsFileUploaded(true); // Set the flag to true
      setFileName(file.name); // Set the file name
      if (data.length > 1) {
        setIsDisabled(false);
      }
    };
    reader.readAsArrayBuffer(file);
    setTimeout(() => {
      setLoading(false);
    }, 200);
  };
  return (
    <div className="create_flashcardpage_container overflow-y-scroll bg-[#F6F7FB]">
      <Navbar active_category="flashcard"></Navbar>
      <div className="create_flashcard_page_content w-full h-screen pt-24 flex flex-col items-center justify-start ">
        <div className="create_flashcard_page_title_container w-[70%] h-[100px] flex flex-row items-center justify-between min-w-max">
          <p className="create_flashcard_page_title text-2xl font-semibold text-black h-[40px] mt-2">
            Create new flashcard
          </p>
          <button
            className="create_flashcard_button w-[90px] h-[40px] rounded-xl bg-violet-500 text-white bottom-24 hover:bg-violet-400"
            onClick={handleCreate}
          >
            Create
          </button>
        </div>
        <div className="create_flashcards_list w-[70%] h-auto min-w-max mt-10">
          <div className="create_flashcard_from_excel_container w-full h-[50px] flex flex-row items-center justify-start mb-4">
            <input
              id="fileInput"
              type="file"
              accept=".xlsx"
              onChange={handleFileUpload}
              className="hidden" // Hide the default file input
            />
            <label
              htmlFor="fileInput"
              className="create_flashcard_from_excel_button w-[150px] h-[40px] hover:bg-violet-100 border-2 border-solid border-violet-200 rounded-full text-[#2E3856] cursor-pointer flex flex-row items-center justify-center font-semibold"
            >
              Import{" "}
              <FontAwesomeIcon
                icon={faUpload}
                size="xs"
                className="ml-2 text-violet-500"
              />
            </label>
            <p
              className="text-[#2E3856] font-normal tracking-wide text-[14px] ml-6"
              hidden={isFileUploaded ? false : true}
            >
              {fileName}&nbsp;
              <FontAwesomeIcon
                icon={faFileExcel}
                className="ml-1 text-emerald-500 text-[16px]"
              />
            </p>
          </div>
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
                    ADD CARD
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

export default CreateFlashcardPage;
