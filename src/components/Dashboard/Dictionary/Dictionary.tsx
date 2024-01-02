/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Toastify } from "../../../toastify/Toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import customAxios from "../../../api/AxiosInstance";
import { Table, Modal, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faPen,
  faPlus,
  faSearch,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import ShibaGangster from "../../../assets/shiba_gangster.png";

interface ResponseMeans {
  id: string;
  word_id: string;
  meaning: string;
  example: string;
  example_meaning: string;
  image: null;
  created_at: Date;
  updated_at: Date;
}

interface ResponseWord {
  id: string;
  word: string;
  pronunciation: string;
  sino_vietnamese: string;
  means: ResponseMeans[];
  key: React.Key;
}

function Dictionary() {
  const [words, setWords] = useState<ResponseWord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteButtonClicked, setDeleteButtonClicked] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");

  async function getWords() {
    await customAxios
      .get(
        `/dashboard/dictionaries?word=${searchTerm}&cur_page=${currentPage}&per_page=10`
      )
      .then((res) => {
        if (res.status === 200) {
          const updatedWords = res.data.dictionaries.map(
            (word: ResponseWord) => {
              return {
                ...word,
                key: word.id,
              };
            }
          );
          setTotal(res.data.total_result);
          setWords(updatedWords);
        } else {
          Toastify.error("Unexpected error");
        }
      });
    setLoading(false);
  }

  useEffect(() => {
    getWords();
  }, []);

  useEffect(() => {
    setLoading(true);
    getWords();
  }, [currentPage, searchTerm]);

  const handleSearch = () => {
    setSearchTerm(inputValue);
    setCurrentPage(1);
  };

  const handleEditWord = (word: string) => {
    navigate(`/dashboard/edit_dictionary/${word}`);
  };

  const handleModalCancel = () => {
    setDeleteButtonClicked(false);
  };
  const handleDeleteButtonClicked = (topicId: string) => {
    setDeleteId(topicId);
    setDeleteButtonClicked(true);
  };

  const handleDeleteTopic = async (wordId: string) => {
    await customAxios
      .delete("/dashboard/dictionaries/" + wordId)
      .then((response) => {
        if (response.status === 200) {
          Toastify.success(response.data.message);
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          if (error.response.data.errors.name) {
            toast.error(error.response.data.errors.name[0]);
          }
          if (error.response.data.errors.description) {
            toast.error(error.response.data.errors.description[0]);
          }
        } else {
          console.error("Unexpected error:", error.response.data);
        }
      });
    setDeleteButtonClicked(false);
    getWords();
  };

  const handleCreate = () => {
    navigate("/dashboard/create_dictionary");
  };

  const columns: ColumnsType<ResponseWord> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "5%",
      align: "center",
    },
    {
      title: () => <div style={{ textAlign: "center" }}>Word</div>,
      dataIndex: "word",
      key: "word",
      width: "20%",
      align: "center",
    },
    {
      title: "Pronunciation",
      dataIndex: "pronunciation",
      key: "numOfLessons",
      width: "20%",
      align: "center",
    },
    {
      title: () => <div style={{ textAlign: "center" }}>Sinonim</div>,
      dataIndex: "sino_vietnamese",
      key: "sino_vietnamese",
      width: "20%",
      align: "center",
    },
    {
      title: () => <div style={{ textAlign: "center" }}>Meaning</div>,
      dataIndex: "means",
      key: "means",
      width: "20%",
      align: "center",
      render: (_text, record) =>
        record.means.length > 0 ? record.means[0].meaning : "",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      align: "center",
      width: "15%",
      render: (_text, record) => (
        <div className="w-full flex flex-row items-center justify-center">
          <Tooltip
            title="Edit"
            trigger={"hover"}
            placement="top"
            arrow={{ pointAtCenter: true }}
          >
            <div
              className="update_button w-[33px] h-[33px] bg-violet-500 rounded-[5px] cursor-pointer hover:bg-violet-400 flex flex-row items-center justify-center mr-4"
              onClick={() => handleEditWord(record.word)}
            >
              <FontAwesomeIcon
                icon={faPen}
                className="text-[16px] text-white"
              />
            </div>
          </Tooltip>
          <Tooltip
            title="Delete"
            trigger={"hover"}
            placement="top"
            arrow={{ pointAtCenter: true }}
          >
            <div
              className="delete_button w-[33px] h-[33px] bg-red-500 rounded-[5px] cursor-pointer hover:bg-red-400 flex flex-row items-center justify-center"
              onClick={() => handleDeleteButtonClicked(record.id)}
            >
              <FontAwesomeIcon
                icon={faTrashCan}
                className="text-[16px] text-white"
              />
            </div>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="dictionary_container flex flex-col justify-start items-center w-full h-screen text-lg bg-slate-300 overflow-auto">
      <div className="w-full h-[100px] flex flex-row items-center justify-center mt-2">
        <div className="w-[40%] relative ">
          <div className="font-roboto text-sm fa-xl fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 transform text-blue-400">
            <FontAwesomeIcon icon={faSearch} size="xl"></FontAwesomeIcon>
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search words"
            className="rounded-3xl border py-2 pl-10 pr-10 w-full focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-400 transition-all duration-100 ease-in-out"
            style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
          />
          <button
            onClick={() => handleSearch()}
            className="absolute right-2 top-1/2 h-[35px] w-[80px] transform -translate-y-1/2 bg-violet-500 text-white rounded-[30px] text-[16px] hover:bg-violet-400"
          >
            Search
          </button>
        </div>
        <button
          className=" w-[100px] h-[40px] bg-violet-500 rounded-[10px] ml-[20%] text-white text-[15px] font-semibold hover:bg-violet-400"
          onClick={handleCreate}
        >
          Create <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div className="table_conatiner w-full h-[500px] max-h-[70%] flex flex-row items-center justify-center">
        {words && (
          <Table
            columns={columns}
            expandable={{
              expandedRowRender: (record) => (
                <div className="flex flex-col items-center justify-center">
                  <p className=" w-full px-12 title_text text-[#2E3856] text-[15px] font-semibold mb-2">
                    Example
                  </p>
                  <ol
                    style={{
                      padding: "0 1em",
                      color: "#333",
                      fontFamily: "Arial, sans-serif",
                    }}
                    className="w-full h-full"
                  >
                    {record &&
                      record.means.length > 0 &&
                      record.means?.map((meaning) => (
                        <li
                          key={meaning.id}
                          style={{ marginBottom: "0.5em", lineHeight: "1.6" }}
                          className="px-9"
                        >
                          ID&nbsp;{meaning.id}:&emsp;{meaning.example}&emsp;
                          <FontAwesomeIcon icon={faArrowRightLong} />
                          &emsp; {meaning.example_meaning}
                        </li>
                      ))}
                  </ol>
                </div>
              ),
              rowExpandable: (record) => record.means.length > 0,
            }}
            dataSource={words}
            pagination={{
              current: currentPage,
              pageSize: 10,
              total: total,
              onChange: (page) => setCurrentPage(page),
              showQuickJumper: true,
              showSizeChanger: false,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
            loading={loading}
            className="w-[80%] h-full"
          />
        )}
      </div>
      <Modal
        okButtonProps={{
          style: {
            background: "linear-gradient(to right, #cb356b,#bd3f32)",
            width: "120px",
            height: "40px",
            fontSize: "16px",
            borderRadius: "10px",
          },
          onMouseOver: (event) => {
            event.currentTarget.style.opacity = "0.8";
            event.currentTarget.style.borderColor = "#60A5FA";
          },
          onMouseLeave: (event) => {
            event.currentTarget.style.opacity = "1";
            event.currentTarget.style.borderColor = "#ffffff";
          },
        }}
        title={
          <div className="w-full h-[50px] flex flex-row items-center justify-center text-[22px] font-semibold mt-[20px]">
            Do you want to delete this word ?
          </div>
        }
        open={deleteButtonClicked}
        onOk={() => handleDeleteTopic(deleteId)}
        onCancel={handleModalCancel}
        closable={false}
        cancelButtonProps={{
          style: {
            width: "120px",
            height: "40px",
            fontSize: "16px",
            borderRadius: "10px",
          },
        }}
        okText="Delete"
      >
        <div className="w-full h-[300px] flex flex-col items-center justify-center mt-[80px]">
          <img
            src={ShibaGangster}
            alt="shiba cry"
            className="w-[60%] h-[300px] object-cover"
          />
          <p className="text-xl font-semibold w-full h-[20px]  text-[14px] flex flex-row items-center justify-center mb-[120px] px-5 mt-4">
            This word will be deleted permanently
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default Dictionary;
