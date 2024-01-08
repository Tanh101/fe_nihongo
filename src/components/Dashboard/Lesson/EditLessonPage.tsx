import { useState, ChangeEvent, useEffect } from "react";
import "./EditLessonPage.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faCheck,
  faMinus,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
// import { Toastify } from "../../../toastify/Toastify";
import { v4 as uuidv4 } from "uuid";
import { CreateQuestionType, JapaneseLesson } from "../../Definition";
import customAxios from "../../../api/AxiosInstance";
import { Toastify } from "../../../toastify/Toastify";
import { Select } from "antd";
import { Word } from "../../Definition";

interface CustomSelectProps {
  handleOptionSelect: (sectionIndex: number, value: string) => void;
  sectionIndex: number;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  handleOptionSelect,
  sectionIndex,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<Word[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const fetchOptionsFromDatabase = async () => {
    await customAxios.get("/dictionaries?word=" + inputValue).then((res) => {
      if (res.status === 200) {
        const updatedOptions = res.data.words.map((word: Word) => ({
          ...word,
        }));
        setOptions(updatedOptions);
      } else {
        Toastify.error("Unexpected error");
      }
    });
  };

  useEffect(() => {
    if (inputValue.length > 0) {
      if (timer) {
        clearTimeout(timer);
      }

      const newTimer = setTimeout(() => {
        fetchOptionsFromDatabase();
      }, 500);

      setTimer(newTimer);
    } else {
      setOptions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  const handleSelect = (selectedOptionId: string, selectedOption: string) => {
    setInputValue(selectedOption);
    setIsOpen(false);
    handleOptionSelect(sectionIndex, selectedOptionId);
  };

  return (
    <div className="w-full h-[80px] relative">
      <input
        type="text"
        placeholder="Search and then select keyword..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="word_id w-full h-[50px] rounded-[10px] p-4 bg-white border-none focus:ring-violet-500 focus:border-2 focus:border-solid focus:border-violet-500 text-[14px] tracking-wide"
      />

      {isOpen && (
        <div className="absolute z-10 bg-white border border-gray-300 mt-1 w-full rounded-md shadow-lg">
          {options.map((option) => (
            <div
              key={option.word}
              className="cursor-pointer p-2 hover:bg-gray-100"
              onClick={() => handleSelect(option.id, option.word)}
            >
              {option.word}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface SectionInterface {
  word_id: string;
  questions: CreateQuestionType[];
}

function EditLessonPage() {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState<JapaneseLesson>({
    lessonId: "",
    lessonTitle: "",
    lessonDescription: "",
    lessonImage: "",
    status: "",
  });
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean[]>([true]);
  const [isVocabularyDisabled, setIsVocabularyDisabled] =
    useState<boolean>(true);
  const [selectedRadios, setSelectedRadios] = useState<Record<string, number>>(
    {}
  );
  const [isVisibleList, setisVisibleList] = useState<Record<string, boolean>>(
    {}
  );
  const [isVisibleVocabularyButton, setisVisibleVocabularyButton] = useState<
    Record<string, boolean>
  >({});

  const [sectionList, setSectionList] = useState<SectionInterface[]>([
    {
      word_id: "",
      questions: [
        {
          id: uuidv4(),
          vocabulary_id: "",
          content: "",
          meaning: "",
          status: "",
          deleted_at: null,
          created_at: new Date(),
          updated_at: new Date(),
          type: "",
          answers: [
            {
              id: "",
              question_id: "",
              content: "",
              is_correct: 0,
            },
            {
              id: "",
              question_id: "",
              content: "",
              is_correct: 0,
            },
            {
              id: "",
              question_id: "",
              content: "",
              is_correct: 0,
            },
            {
              id: "",
              question_id: "",
              content: "",
              is_correct: 0,
            },
          ],
        },
      ],
    },
  ]);

  const handleQuestionInput = (
    sectionIndex: number,
    questionIndex: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const newSectionList = [...sectionList];
    newSectionList[sectionIndex].questions[questionIndex].content =
      e.target.value;
    setSectionList(newSectionList);
  };

  const handleQuestionMeaningInput = (
    sectionIndex: number,
    questionIndex: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const newSectionList = [...sectionList];
    newSectionList[sectionIndex].questions[questionIndex].meaning =
      e.target.value;
    setSectionList(newSectionList);
  };

  const handleAnswerInput = (
    sectionIndex: number,
    questionIndex: number,
    answerIndex: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const newSectionList = [...sectionList];
    newSectionList[sectionIndex].questions[questionIndex].answers[
      answerIndex
    ].content = e.target.value;
    setSectionList(newSectionList);
  };

  const addSection = (index: number) => {
    const newSectionList = [...sectionList];
    newSectionList.splice(index + 1, 0, {
      word_id: "",
      questions: [
        {
          id: uuidv4(),
          vocabulary_id: "",
          content: "",
          meaning: "",
          status: "",
          deleted_at: null,
          created_at: new Date(),
          updated_at: new Date(),
          type: "",
          answers: [
            {
              id: "",
              question_id: "",
              content: "",
              is_correct: 0,
            },
            {
              id: "",
              question_id: "",
              content: "",
              is_correct: 0,
            },
            {
              id: "",
              question_id: "",
              content: "",
              is_correct: 0,
            },
            {
              id: "",
              question_id: "",
              content: "",
              is_correct: 0,
            },
          ],
        },
      ],
    });
    setSectionList(newSectionList);
    setIsVocabularyDisabled(false);
    setIsDisabled((prevIsDisabled) => {
      const newIsDisabled = [...prevIsDisabled];
      newIsDisabled[index + 1] = true;
      return newIsDisabled;
    });
  };

  const removeSection = (index: number) => {
    const newSectionList = [...sectionList];
    newSectionList.splice(index, 1);
    setSectionList(newSectionList);
    if (newSectionList.length === 1) {
      setIsVocabularyDisabled(true);
    }
  };

  const addQuestion = (sectionIndex: number, questionIndex: number) => {
    const newSectionList = [...sectionList];
    newSectionList[sectionIndex].questions.splice(questionIndex + 1, 0, {
      id: uuidv4(),
      vocabulary_id: "",
      content: "",
      meaning: "",
      status: "",
      deleted_at: null,
      created_at: new Date(),
      updated_at: new Date(),
      type: "",
      answers: [
        {
          id: "",
          question_id: "",
          content: "",
          is_correct: 0,
        },
        {
          id: "",
          question_id: "",
          content: "",
          is_correct: 0,
        },
        {
          id: "",
          question_id: "",
          content: "",
          is_correct: 0,
        },
        {
          id: "",
          question_id: "",
          content: "",
          is_correct: 0,
        },
      ],
    });
    setSectionList(newSectionList);
    setIsDisabled((prevIsDisabled) => {
      const newIsDisabled = [...prevIsDisabled];
      newIsDisabled[sectionIndex] = false;
      return newIsDisabled;
    });
  };

  const removeQuestion = (sectionIndex: number, questionIndex: number) => {
    const newSectionList = [...sectionList];
    newSectionList[sectionIndex].questions.splice(questionIndex, 1);
    setSectionList(newSectionList);
    if (newSectionList[sectionIndex].questions.length === 1) {
      setIsDisabled((prevIsDisabled) => {
        const newIsDisabled = [...prevIsDisabled];
        newIsDisabled[sectionIndex] = true;
        return newIsDisabled;
      });
    }
  };

  const getLesson = async () => {
    await customAxios.get("/lessons/" + lessonId).then((res) => {
      if (res.status === 200) {
        setLesson(res.data.lesson);
        setTitle(res.data.lesson.title);
        setDescription(res.data.lesson.description);
        setIsVocabularyDisabled(false);
        setIsDisabled((prevIsDisabled) => {
          const newIsDisabled = [...prevIsDisabled];
          newIsDisabled[0] = false;
          return newIsDisabled;
        });
      } else {
        Toastify.error("Unexpected error");
      }
    });
  };

  useEffect(() => {
    getLesson();
    console.log(lesson);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = () => {
    navigate("/dashboard/lesson");
  };

  const onTitleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onDescriptionInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleCreateLesson = async () => {
    if (title === "") {
      Toastify.error("Title is required");
      return;
    }
    if (description === "") {
      Toastify.error("Description is required");
      return;
    }
    sectionList.forEach((section) => {
      if (section.word_id === "") {
        Toastify.error("Keyword is required");
        return;
      }
      const allQuestionsAnswered = section.questions.every((question) =>
        Object.prototype.hasOwnProperty.call(selectedRadios, question.id)
      );
      if (!allQuestionsAnswered) {
        Toastify.error("Please select correct answer for all questions");
        return;
      }
      section.questions.forEach((question) => {
        if (question.type === "") {
          Toastify.error("Question type is required");
          return;
        }
        if (question.content === "") {
          Toastify.error("Question is required");
          return;
        }
        if (question.meaning === "") {
          Toastify.error("Meaning of the question is required");
          return;
        }
        if (question.type === "choice") {
          question.answers.forEach((answer) => {
            if (answer.content === "") {
              Toastify.error("Answer is required");
              return;
            }
          });
        } else if (question.type === "write") {
          if (question.answers[0].content === "") {
            Toastify.error("Answer is required");
            return;
          }
        }

        question.answers[selectedRadios[question.id]].is_correct = 1;
      });
    });
    await customAxios
      .post("/dashboard/lessons", {
        topic_id: lessonId?.toString(),
        title: title,
        description: description,
        vocabularies: sectionList,
      })
      .then((res) => {
        if (res.status === 200) {
          Toastify.success("Lesson added successfully");
          navigate("/dashboard/topic");
        } else {
          Toastify.error("Unexpected error");
          return;
        }
      });
  };

  const handleChange = (
    sectionIndex: number,
    questionIndex: number,
    value: string
  ) => {
    const newSectionList = [...sectionList];
    newSectionList[sectionIndex].questions[questionIndex].type = value;
    setSectionList(newSectionList);
  };

  const onChangeVocabulary = (sectionIndex: number, value: string) => {
    const newSectionList = [...sectionList];
    newSectionList[sectionIndex].word_id = value;
    setSectionList(newSectionList);
  };

  return (
    <div className="add_topic_lesson_page_container w-full h-[100%] overflow-auto bg-gray-100 flex flex-row items-start justify-center">
      <div className="w-[60%] min-h-min mt-6">
        <button
          className="w-[100px] h-[50px] absolute left-[20px] top-[10px] text-[14px] text-[#2E3856] bg-white border-2 border-solid border-violet-500 rounded-[10px] font-semibold hover:bg-violet-100"
          onClick={handleBack}
        >
          <FontAwesomeIcon icon={faArrowLeftLong} /> Back
        </button>
        <div className="create_flashcard_page_title_container w-[100%] h-[100px] flex flex-row items-center justify-between min-w-max">
          <p className="create_flashcard_page_title text-2xl font-semibold text-black h-[40px] mt-2">
            Edit lesson
          </p>
          <button
            className="create_flashcard_button w-[90px] h-[40px] rounded-xl bg-violet-500 text-white bottom-24 hover:bg-violet-400"
            onClick={handleCreateLesson}
          >
            Create
          </button>
        </div>
        <div className="w-full mb-5 min-h-min">
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
        </div>
        {sectionList.map((section, sectionIndex) => {
          return (
            <div
              key={sectionIndex}
              className="flex flex-col items-center justify-center border border-gray-300 rounded-lg p-4 mb-4"
            >
              <div className="w-full flex flex-row items center justify-between mb-4">
                <p className="text-[16px] w-[98%] text-black ml-1 font-semibold">
                  Vocabulary {sectionIndex + 1}
                </p>
                <button
                  className={`${
                    isVocabularyDisabled
                      ? " bg-gray-300"
                      : " bg-red-500 hover:bg-red-400"
                  } remove_row_button w-[30px] h-[30px] rounded-lg mt-[-10px] text-white`}
                  onClick={() => removeSection(sectionIndex)}
                  disabled={isVocabularyDisabled}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </div>
              <CustomSelect
                sectionIndex={sectionIndex}
                handleOptionSelect={onChangeVocabulary}
              />
              {section.questions.map((question, questionIndex) => {
                return (
                  <div
                    key={questionIndex}
                    className="w-full flex flex-col items-center mb-4 bg-violet-100 rounded-[10px] p-4"
                  >
                    <div className="w-full flex flex-row items center justify-between mb-2">
                      <p className="text-[16px] text-black mb-2 ml-3 font-semibold">
                        Question {questionIndex + 1}
                      </p>
                      <button
                        className={`${
                          isDisabled[sectionIndex]
                            ? " bg-gray-300"
                            : " bg-red-500 hover:bg-red-400"
                        } remove_row_button w-[30px] h-[30px] rounded-lg mt-[-10px] text-white`}
                        onClick={() =>
                          removeQuestion(sectionIndex, questionIndex)
                        }
                        disabled={isDisabled[sectionIndex]}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                    </div>
                    <div className="w-full h-[60px] flex items-center justify-start p-2">
                      <Select
                        placeholder="Select question type"
                        onChange={(value) =>
                          handleChange(sectionIndex, questionIndex, value)
                        }
                        options={[
                          { value: "choice", label: "Multiple choice" },
                          { value: "writing", label: "Writing" },
                        ]}
                        value={question.type ? question.type : null}
                        className="w-[200px] h-[40px] rounded-[10px] bg-white focus:ring-violet-500 text-semibold"
                      />
                    </div>

                    <div className="w-[99%] h-[210px] flex flex-col items-center justify-center bg-[#075985] rounded-[10px] mb-4 mt-4">
                      <input
                        type="text"
                        name="question"
                        placeholder="Enter question here"
                        value={question.content}
                        onChange={(e) =>
                          handleQuestionInput(sectionIndex, questionIndex, e)
                        }
                        className="answer_input underlined_border w-[98%] h-[90px] p-4 focus:ring-0 bg-[#075985] tracking-wide text-[15px]"
                      />
                      <input
                        type="text"
                        name="meaning"
                        placeholder="Enter meaning of the question here"
                        value={question.meaning}
                        onChange={(e) =>
                          handleQuestionMeaningInput(
                            sectionIndex,
                            questionIndex,
                            e
                          )
                        }
                        className="answer_input underlined_border w-[98%] h-[90px] p-4 focus:ring-0 bg-[#075985] tracking-wide text-[15px]"
                      />
                    </div>
                    {question.type === "choice" ? (
                      <div className="w-full flex flex-row items-center justify-around">
                        {question.answers.map((answer, answerIndex) => {
                          return (
                            <div
                              key={answerIndex}
                              className={`flex flex-col items-center w-[24%] h-[120px] rounded-[10px] mb-8 ${
                                answerIndex === 0
                                  ? "bg-[#2C70AE]"
                                  : answerIndex === 1
                                  ? "bg-[#2D9DA6]"
                                  : answerIndex === 2
                                  ? "bg-[#EFA928]"
                                  : "bg-[#D5536C]"
                              }`}
                            >
                              <div
                                className={`h-[25px] w-[25px] rounded-full border-white border-2 border-solid flex flex-col items-center justify-center cursor-pointer mt-2 ${
                                  selectedRadios[question.id] === answerIndex
                                    ? "bg-emerald-500"
                                    : "bg-black opacity-[0.4]"
                                }`}
                                onClick={() =>
                                  setSelectedRadios((prevSelectedRadios) => ({
                                    ...prevSelectedRadios,
                                    [question.id]: answerIndex,
                                  }))
                                }
                              >
                                <FontAwesomeIcon
                                  icon={faCheck}
                                  className="text-white text-[10px]"
                                />
                              </div>
                              <input
                                type="text"
                                name={"answer"}
                                placeholder="Enter answer here"
                                value={answer.content}
                                onChange={(e) =>
                                  handleAnswerInput(
                                    sectionIndex,
                                    questionIndex,
                                    answerIndex,
                                    e
                                  )
                                }
                                className={`answer_input underlined_border w-[95%] h-[80px] p-4 focus:ring-0 tracking-wide text-[15px] + ${
                                  answerIndex === 0
                                    ? "bg-[#2C70AE]"
                                    : answerIndex === 1
                                    ? "bg-[#2D9DA6]"
                                    : answerIndex === 2
                                    ? "bg-[#EFA928]"
                                    : "bg-[#D5536C]"
                                }`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    ) : question.type === "writing" ? (
                      <div className="w-[45%] h-[120px] flex flex-col items-center justify-center bg-[#65a30d] rounded-[10px] mb-8">
                        <input
                          type="text"
                          name="answer"
                          placeholder="Enter answer here"
                          value={question.answers[0].content}
                          onChange={(e) =>
                            handleAnswerInput(sectionIndex, questionIndex, 0, e)
                          }
                          className="answer_input underlined_border w-[98%] h-[80px] p-4 focus:ring-0 bg-[#65a30d] tracking-wide text-[15px]"
                        />
                      </div>
                    ) : null}

                    {questionIndex === section.questions.length - 1 ? (
                      <div
                        className="add_button_container w-full h-[60px] flex flex-col items-center justify-center rounded-[12px] p-4 bg-violet-100 text-[#2E3856] cursor-pointer mt-5"
                        onClick={() => addQuestion(sectionIndex, questionIndex)}
                      >
                        <div className="add_flashcard_button h-[30px] flex flex-row justify-center items-center">
                          <FontAwesomeIcon
                            icon={faPlus}
                            size="xs"
                            className="add_flashcard_icon"
                          />
                          &nbsp;{" "}
                          <p className="font-bold text-[15px] tracking-widest">
                            ADD QUESTION
                          </p>
                        </div>
                      </div>
                    ) : null}
                    <div
                      className={`hidden_add_button_container flex flex-row items-center justify-center`}
                      onMouseEnter={() => {
                        if (questionIndex < section.questions.length - 1)
                          setisVisibleList((prevIsVisibleList) => ({
                            ...prevIsVisibleList,
                            [question.id]: true,
                          }));
                      }}
                      onMouseLeave={() => {
                        setisVisibleList((prevIsVisibleList) => ({
                          ...prevIsVisibleList,
                          [question.id]: false,
                        }));
                      }}
                    >
                      <button
                        className={`${
                          isVisibleList[question.id]
                            ? "visible_button"
                            : "hidden_button"
                        } hidden_add_button w-[35px] h-[35px] rounded-full mt-[-10px] bg-violet-500 hover:bg-violet-400`}
                        onClick={() => addQuestion(sectionIndex, questionIndex)}
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
              })}
              {sectionIndex === sectionList.length - 1 ? (
                <div
                  className="add_button_container w-full h-[100px] flex flex-col items-center justify-center rounded-[12px] p-4 bg-white mb-5 text-[#2E3856] cursor-pointer"
                  onClick={() => addSection(sectionIndex)}
                >
                  <div className="add_flashcard_button h-[30px] pb-5 flex flex-row justify-center items-center mt-5">
                    <FontAwesomeIcon
                      icon={faPlus}
                      size="xs"
                      className="add_flashcard_icon"
                    />
                    &nbsp;{" "}
                    <p className="font-bold text-[15px] tracking-widest">
                      ADD VOCABULARY
                    </p>
                  </div>
                </div>
              ) : null}
              <div
                className={`hidden_add_button_container flex flex-row items-center justify-center`}
                onMouseEnter={() => {
                  if (sectionIndex < sectionList.length - 1)
                    setisVisibleVocabularyButton(
                      (prevIsVisibleVocabularyButton) => ({
                        ...prevIsVisibleVocabularyButton,
                        [sectionIndex]: true,
                      })
                    );
                }}
                onMouseLeave={() => {
                  setisVisibleVocabularyButton(
                    (prevIsVisibleVocabularyButton) => ({
                      ...prevIsVisibleVocabularyButton,
                      [sectionIndex]: false,
                    })
                  );
                }}
              >
                <button
                  className={`${
                    isVisibleVocabularyButton[sectionIndex]
                      ? "visible_button"
                      : "hidden_button"
                  } hidden_add_button w-[35px] h-[35px] rounded-full mt-[-10px] bg-emerald-500 hover:bg-emerald-400`}
                  onClick={() => addSection(sectionIndex)}
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
        })}
      </div>
    </div>
  );
}

export default EditLessonPage;
