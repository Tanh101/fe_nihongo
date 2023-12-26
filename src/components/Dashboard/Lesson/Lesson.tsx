/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Toastify } from "../../../toastify/Toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import customAxios from "../../../api/AxiosInstance";
import { Table, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSearch, faTrashCan } from "@fortawesome/free-solid-svg-icons";

interface ResponseLesson {
  id: number;
  topic_id: number;
  title: string;
  description: string;
  image: string | null;
  status: string;
  deleted_at: null;
  created_at: Date;
  updated_at: Date;
}

function Lesson() {
  const [lessons, setLessons] = useState<ResponseLesson[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editId, setEditId] = useState<number>(0);
  const [editNameInput, setEditNameInput] = useState<string>("");
  const [editDescriptionInput, setEditDescriptionInput] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const handleEditNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditNameInput(e.target.value);
  };

  const handleEditDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditDescriptionInput(e.target.value);
  };

  const handleCancelEdit = () => {
    setEditModalOpen(false);
  };

  async function getLessons() {
    await customAxios
      .get(`/dashboard/lessons?cur_page=${currentPage}&per_page=10`)
      .then((res) => {
        if (res.status === 200) {
          setLessons(res.data.lessons);
          setTotal(res.data.total_result);
        } else {
          Toastify.error("Unexpected error");
        }
      });
    setLoading(false);
  }

  useEffect(() => {
    getLessons();
  }, []);

  useEffect(() => {
    setLoading(true);
    getLessons();
  }, [currentPage]);

  const handleEditLesson = (
    lessonId: number,
    topicName: string,
    topicDescription: string
  ) => {
    setEditId(lessonId);
    setEditNameInput(topicName);
    setEditDescriptionInput(topicDescription);
    setEditModalOpen(true);
  };

  const handleUpdateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editNameInput === "") {
      Toastify.error("Lesson name is required");
      return;
    }

    await customAxios
      .put("/dashboard/lessons/" + editId, {
        title: editNameInput,
        description: editDescriptionInput,
        image: "N/A",
      })
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
    getLessons();
    setEditNameInput("");
    setEditModalOpen(false);
  };

  const handleDeleteLesson = async (lessonId: number) => {
    await customAxios
      .delete("/dashboard/lessons/" + lessonId)
      .then((response) => {
        if (response.status === 200) {
          Toastify.success("Deleted lesson successfully");
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
    getLessons();
  };

  const columns: ColumnsType<ResponseLesson> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
      align: "center",
    },
    {
      title: () => <div style={{ textAlign: "center" }}>Title</div>,
      dataIndex: "title",
      key: "title",
      width: "30%",
      align: "left",
    },
    {
      title: () => <div style={{ textAlign: "center" }}>Description</div>,
      dataIndex: "description",
      key: "description",
      width: "45%",
      align: "left",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      align: "center",
      render: (_text, record) => (
        <div className="flex flex-row items-center justify-center">
          <div
            className="update_button w-[33px] h-[33px] bg-violet-500 rounded-[5px] cursor-pointer hover:bg-violet-400 flex flex-row items-center justify-center mr-4"
            onClick={() =>
              handleEditLesson(record.id, record.title, record.description)
            }
          >
            <FontAwesomeIcon icon={faPen} className="text-[16px] text-white" />
          </div>
          <div
            className="delete_button w-[33px] h-[33px] bg-red-500 rounded-[5px] cursor-pointer hover:bg-red-400 flex flex-row items-center justify-center"
            onClick={() => handleDeleteLesson(record.id)}
          >
            <FontAwesomeIcon
              icon={faTrashCan}
              className="text-[16px] text-white"
            />
          </div>
        </div>
      ),
      width: "15%",
    },
  ];

  return (
    <div className="flex flex-col justify-start items-center w-full h-screen text-lg bg-slate-300 overflow-auto">
      <div className="w-full h-[100px] flex flex-row items-center justify-center mt-2">
        <div className="w-[40%] relative ">
          <div className="font-roboto text-sm fa-xl fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 transform text-blue-400">
            <FontAwesomeIcon icon={faSearch} size="xl"></FontAwesomeIcon>
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search lessons"
            className="rounded-3xl border py-2 pl-10 pr-10 w-full focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-400 transition-all duration-100 ease-in-out"
            style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
          />
          <button
            onClick={() => setSearchTerm(inputValue)}
            className="absolute right-2 top-1/2 h-[35px] w-[80px] transform -translate-y-1/2 bg-violet-500 text-white rounded-[30px] text-[16px] hover:bg-violet-400"
          >
            Search
          </button>
        </div>
      </div>
      <div className="table_conatiner w-full h-[500px] max-h-[70%] flex flex-row items-center justify-center">
        {lessons && (
          <Table
            columns={columns}
            dataSource={lessons
              .filter((lesson) =>
                lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((lesson) => ({ ...lesson, key: lesson.id.toString() }))}
            pagination={{
              current: currentPage,
              pageSize: 10,
              total: total,
              onChange: (page) => setCurrentPage(page),
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
            loading={loading}
            className="w-[80%] h-full"
          />
        )}
      </div>
      <Modal
        title="Edit Topic"
        open={editModalOpen}
        onOk={handleUpdateLesson}
        onCancel={handleCancelEdit}
        okButtonProps={{
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
            width: "120px",
            height: "35px",
            fontSize: "15px",
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
        okText="Edit"
      >
        <div className="flex flex-col mt-8 mb-12">
          <label
            htmlFor="lessonName"
            className="mb-2 font-bold text-[14px] text-[#2E3856]"
          >
            Lesson Name
          </label>
          <input
            type="text"
            id="lessonName"
            name="lessonName"
            value={editNameInput}
            onChange={handleEditNameChange}
            className="border-2 rounded-lg p-2 text-lg"
          />
          <label
            htmlFor="lessonDescription"
            className="mb-2 font-bold text-[14px] text-[#2E3856] mt-4"
          >
            Lesson Description
          </label>
          <input
            type="text"
            id="lessonDescription"
            name="lessonDescription"
            value={editDescriptionInput}
            onChange={handleEditDescriptionChange}
            className="border-2 rounded-lg p-2 text-lg"
          />
        </div>
      </Modal>
    </div>
  );
}

export default Lesson;
