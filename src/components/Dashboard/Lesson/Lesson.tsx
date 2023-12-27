/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Toastify } from "../../../toastify/Toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import customAxios from "../../../api/AxiosInstance";
import { Table, Tooltip, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSearch, faTrashCan } from "@fortawesome/free-solid-svg-icons";
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

function Lesson() {
  const [lessons, setLessons] = useState<ResponseLesson[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [deleteButtonClicked, setDeleteButtonClicked] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);

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

  const handleModalCancel = () => {
    setDeleteButtonClicked(false);
  };
  const handleDeleteButtonClicked = (lessonId: number) => {
    setDeleteId(lessonId);
    setDeleteButtonClicked(true);
  };

  const handleEditLesson = (lessonId: number) => {
    navigate(`/dashboard/lessons/edit_lesson/${lessonId}`);
  };

  const handleDeleteLesson = async (lessonId: number) => {
    setLoading(true);
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
    setLoading(false);
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
          <Tooltip
            title="Edit"
            trigger={"hover"}
            placement="top"
            arrow={{ pointAtCenter: true }}
          >
            <div
              className="update_button w-[33px] h-[33px] bg-violet-500 rounded-[5px] cursor-pointer hover:bg-violet-400 flex flex-row items-center justify-center mr-4"
              onClick={() => handleEditLesson(record.id)}
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
        open={deleteButtonClicked}
        onOk={() => handleDeleteLesson(deleteId)}
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
            This lesson will be deleted permanently
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default Lesson;
