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
  faCalendarPlus,
  faPen,
  faPlus,
  faSearch,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import ShibaGangster from "../../../assets/shiba_gangster.png";

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

interface Topic {
  name: string;
  id: number;
  image: string;
  description: string;
  lessons: ResponseLesson[];
  deleted_at: null;
  created_at: Date;
  updated_at: Date;
  numOfLessons: number;
  key: React.Key;
}

function AdminTopic() {
  const [topics, setTopics] = useState<Topic[]>([]); // Initialize the topics state variable
  const [topicNameInput, setTopicNameInput] = useState<string>("");
  const [topicDescriptionInput, setTopicDescriptionInput] =
    useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editId, setEditId] = useState<number>(0);
  const [editNameInput, setEditNameInput] = useState<string>("");
  const [editDescriptionInput, setEditDescriptionInput] = useState<string>("");
  const navigate = useNavigate();
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteButtonClicked, setDeleteButtonClicked] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  const [deleteLessonButtonClicked, setDeleteLessonButtonClicked] =
    useState(false);
  const [deleteLessonId, setDeleteLessonId] = useState<number>(0);
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopicNameInput(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopicDescriptionInput(e.target.value);
  };

  const handleEditNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditNameInput(e.target.value);
  };

  const handleEditDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditDescriptionInput(e.target.value);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setTopicNameInput("");
  };

  const handleCancelEdit = () => {
    setEditModalOpen(false);
    setTopicNameInput("");
  };

  async function getTopics() {
    await customAxios
      .get(
        `/dashboard/topics?name=${searchTerm}&cur_page=${currentPage}&per_page=10`
      )
      .then((res) => {
        if (res.status === 200) {
          const updatedTopics = res.data.topics.map((topic: Topic) => ({
            ...topic,
            numOfLessons:
              topic.lessons.length >= 1 && topic.lessons[0] !== null
                ? topic.lessons.length
                : 0,
            key: topic.id,
          }));
          setTotal(res.data.total_result);
          setTopics(updatedTopics);
        } else {
          Toastify.error("Unexpected error");
        }
      })
      .catch((error) => {
        if (
          error.response.status === 401 &&
          error.response.data.message === "Unauthorized"
        ) {
          navigate("/login");
        } else {
          Toastify.error("Unexpected error: " + error.response.data.message);
        }
      });
    setLoading(false);
  }

  useEffect(() => {
    getTopics();
  }, []);

  useEffect(() => {
    setLoading(true);
    getTopics();
  }, [searchTerm, currentPage]);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (topicNameInput === "") {
      Toastify.error("Topic name is required");
      return;
    }

    await customAxios
      .post("/dashboard/topics/", {
        name: topicNameInput,
        description: topicDescriptionInput,
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
    getTopics();
    setTopicNameInput("");
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleAddLesson = (topicId: number) => {
    navigate(`/dashboard/topic/${topicId}/add_lesson`);
  };

  const handleEditTopic = (
    topicId: number,
    topicName: string,
    topicDescription: string
  ) => {
    setEditId(topicId);
    setEditNameInput(topicName);
    setEditDescriptionInput(topicDescription);
    setEditModalOpen(true);
  };

  const handleUpdateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editNameInput === "") {
      Toastify.error("Topic name is required");
      return;
    }

    await customAxios
      .put("/dashboard/topics/" + editId, {
        name: editNameInput,
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
    getTopics();
    setEditNameInput("");
    setEditModalOpen(false);
  };

  const handleModalCancel = () => {
    setDeleteButtonClicked(false);
  };
  const handleDeleteButtonClicked = (topicId: number) => {
    setDeleteId(topicId);
    setDeleteButtonClicked(true);
  };

  const handleEditLesson = (lessonId: number) => {
    localStorage.setItem("sender", "topic");
    navigate(`/dashboard/lessons/edit_lesson/${lessonId}`);
  };

  const handleLessonDeleteButtonClicked = (lessonId: number) => {
    setDeleteLessonId(lessonId);
    setDeleteLessonButtonClicked(true);
  };

  const handleDeleteLesson = async () => {
    setLoading(true);
    await customAxios
      .delete("/dashboard/lessons/" + deleteLessonId)
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
    getTopics();
    setLoading(false);
    setDeleteLessonButtonClicked(false);
  };

  const handleDeleteTopic = async (topicId: number) => {
    await customAxios
      .delete("/dashboard/topics/" + topicId)
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
    getTopics();
  };

  const handleLessonModalCancel = () => {
    setDeleteLessonButtonClicked(false);
  };
  const handleSearch = () => {
    setSearchTerm(inputValue);
    setCurrentPage(1);
  };

  const columns: ColumnsType<Topic> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "2%",
      align: "center",
    },
    {
      title: () => <div style={{ textAlign: "center" }}>Name</div>,
      dataIndex: "name",
      key: "name",
      width: "28%",
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
      title: "Lessons",
      dataIndex: "numOfLessons",
      key: "numOfLessons",
      width: "8%",
      align: "center",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      align: "center",
      render: (_text, record) => (
        <div className="flex flex-row items-center justify-center">
          <Tooltip
            title="Add lesson"
            trigger={"hover"}
            placement="top"
            arrow={{ pointAtCenter: true }}
          >
            <div
              className="add_button w-[33px] h-[33px] bg-emerald-500 rounded-[5px] cursor-pointer hover:bg-emerald-400 flex flex-row items-center justify-center mr-4"
              onClick={() => handleAddLesson(record.id)}
            >
              <FontAwesomeIcon
                icon={faCalendarPlus}
                className="text-[16px] text-white"
              />
            </div>
          </Tooltip>
          <Tooltip
            title="Edit"
            trigger={"hover"}
            placement="top"
            arrow={{ pointAtCenter: true }}
          >
            <div
              className="update_button w-[33px] h-[33px] bg-violet-500 rounded-[5px] cursor-pointer hover:bg-violet-400 flex flex-row items-center justify-center mr-4"
              onClick={() =>
                handleEditTopic(record.id, record.name, record.description)
              }
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
            placeholder="Search topics"
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
          onClick={handleOpenModal}
        >
          Create <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div className="table_conatiner w-full h-[500px] max-h-[70%] flex flex-row items-center justify-center">
        {topics && (
          <Table
            columns={columns}
            expandable={{
              expandedRowRender: (record) => (
                <div
                  className="flex flex-col items-center justify-center"
                  key={record.id}
                >
                  <p className=" w-full px-12 title_text text-[#2E3856] text-[15px] font-semibold mb-2">
                    Lessons
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
                      record.numOfLessons > 0 &&
                      record.lessons?.map((lesson) => (
                        <li
                          key={lesson.id}
                          style={{ marginBottom: "0.5em", lineHeight: "1.6" }}
                          className="px-9 flex flex-row items-center"
                        >
                          <p className="w-[25%] truncate" key={lesson.id}>
                            ID&nbsp;{lesson.id}:&emsp;{lesson.title}
                          </p>
                          <p
                            className="ml-8 text-blue-500 cursor-pointer hover:underline hover:text-blue-400"
                            onClick={() => handleEditLesson(lesson.id)}
                            key={lesson.id}
                          >
                            Edit
                          </p>
                          <p
                            className="ml-4 text-red-500 cursor-pointer hover:underline hover:text-red-400"
                            onClick={() =>
                              handleLessonDeleteButtonClicked(lesson.id)
                            }
                            key={lesson.id}
                          >
                            Delete
                          </p>
                        </li>
                      ))}
                  </ol>
                </div>
              ),
              rowExpandable: (record) => record.numOfLessons > 0,
            }}
            dataSource={topics}
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
        title="Create Topic"
        open={isModalOpen}
        onOk={handleCreateTopic}
        onCancel={handleCancel}
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
        okText="Create"
      >
        <div className="flex flex-col mt-8 mb-12">
          <label
            htmlFor="topicName"
            className="mb-2 font-bold text-[14px] text-[#2E3856]"
          >
            Topic Name
          </label>
          <input
            type="text"
            id="topicName"
            name="topicName"
            value={topicNameInput}
            onChange={handleNameChange}
            className="border-2 rounded-lg p-2 text-lg"
          />
          <label
            htmlFor="topicDescription"
            className="mb-2 font-bold text-[14px] text-[#2E3856] mt-4"
          >
            Topic Description
          </label>
          <input
            type="text"
            id="topicDescription"
            name="topicDescription"
            value={topicDescriptionInput}
            onChange={handleDescriptionChange}
            className="border-2 rounded-lg p-2 text-lg"
          />
        </div>
      </Modal>
      <Modal
        title="Edit Topic"
        open={editModalOpen}
        onOk={handleUpdateTopic}
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
            htmlFor="topicName"
            className="mb-2 font-bold text-[14px] text-[#2E3856]"
          >
            Topic Name
          </label>
          <input
            type="text"
            id="topicName"
            name="topicName"
            value={editNameInput}
            onChange={handleEditNameChange}
            className="border-2 rounded-lg p-2 text-lg"
          />
          <label
            htmlFor="topicDescription"
            className="mb-2 font-bold text-[14px] text-[#2E3856] mt-4"
          >
            Topic Description
          </label>
          <input
            type="text"
            id="topicDescription"
            name="topicDescription"
            value={editDescriptionInput}
            onChange={handleEditDescriptionChange}
            className="border-2 rounded-lg p-2 text-lg"
          />
        </div>
      </Modal>
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
            Do you want to delete this topic ?
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
            This topic will be deleted permanently
          </p>
        </div>
      </Modal>
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
            Do you want to delete this lesson ?
          </div>
        }
        open={deleteLessonButtonClicked}
        onOk={() => handleDeleteLesson()}
        onCancel={handleLessonModalCancel}
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
            This lesson will be deleted permanently
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default AdminTopic;
