import { useEffect, useState } from "react";
import customAxios from "../../../api/AxiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faComments,
  faLanguage,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Spin } from "antd";

interface ResponseNewUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
  dob: string;
  phone_number: null;
  role: string;
  gender: null;
  avatar: null;
  deleted_at: null;
  status: string;
}

interface ResponseNewWord {
  id: number;
  word: string;
  pronunciation: string;
  sino_vietnamese: string;
  image: null;
  deleted_at: null;
  created_at: string;
  updated_at: string;
}

interface ResponseNewLesson {
  id: number;
  topic_id: number;
  title: string;
  description: string;
  image: null;
  status: string;
  deleted_at: null;
  created_at: string;
  updated_at: string;
}

function Home() {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalTopics, setTotalTopics] = useState<number>(0);
  const [totalLessons, setTotalLessons] = useState<number>(0);
  const [totalWords, setTotalWords] = useState<number>(0);
  const [newUsers, setNewUsers] = useState<ResponseNewUser[]>([]);
  const [newWords, setNewWords] = useState<ResponseNewWord[]>([]);
  const [newLessons, setNewLessons] = useState<ResponseNewLesson[]>([]);
  const [loading, setLoading] = useState(false);

  async function getStatistics() {
    setLoading(true);
    await customAxios.get("/dashboard/analytics?limit=5").then((res) => {
      if (res.status === 200) {
        setTotalUsers(res.data.results.total.total_users);
        setTotalTopics(res.data.results.total.total_topics);
        setTotalLessons(res.data.results.total.total_lessons);
        setTotalWords(res.data.results.total.total_words);
        setNewUsers(res.data.results.newlyRegisterUser);
        setNewWords(res.data.results.newlyWords);
        setNewLessons(res.data.results.newlyLessons);
      }
    });
    setLoading(false);
  }

  useEffect(() => {
    getStatistics();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start bg-gray-100 h-screen w-full min-w-min">
      <div className="flex justify-evenly w-full mb-10 mt-10">
        <div className=" bg-white border-b-4 border-blue-500 w-[22%]  h-[100px] flex flex-row items-center justify-around rounded drop-shadow-md">
          <div className=" flex flex-col items-center justify-center">
            <p className="text-[16px] font-medium text-[#9FA7BE] mb-2">
              TOTAL USERS
            </p>
            <p className="text-[20px] font-semibold text-black flex items-center justify-end">
              {loading ? <Spin /> : totalUsers}
            </p>
          </div>
          <div className="mr-2">
            <FontAwesomeIcon
              icon={faUser}
              className="text-[32px] text-blue-500"
            />
          </div>
        </div>
        <div className=" bg-white border-b-4 border-amber-500 w-[22%]  h-[100px] flex flex-row items-center justify-around rounded drop-shadow-md">
          <div className=" flex flex-col items-center justify-center">
            <p className="text-[16px] font-medium text-[#9FA7BE] mb-2">
              TOTAL TOPICS
            </p>
            <p className="text-[20px] font-semibold text-black flex items-center justify-end">
              {loading ? <Spin /> : totalTopics}
            </p>
          </div>
          <div className="mr-2">
            <FontAwesomeIcon
              icon={faComments}
              className="text-[33px] text-amber-500"
            />
          </div>
        </div>
        <div className=" bg-white border-b-4 border-red-500 w-[22%]  h-[100px] flex flex-row items-center justify-around rounded drop-shadow-md">
          <div className=" flex flex-col items-center justify-center">
            <p className="text-[16px] font-medium text-[#9FA7BE] mb-2">
              TOTAL LESSONS
            </p>
            <p className="text-[20px] font-semibold text-black flex items-center justify-end">
              {loading ? <Spin /> : totalLessons}
            </p>
          </div>
          <div className="mr-2">
            <FontAwesomeIcon
              icon={faClipboardList}
              className="text-[33px] text-red-500"
            />
          </div>
        </div>
        <div className=" bg-white border-b-4 border-emerald-500 w-[22%]  h-[100px] flex flex-row items-center justify-around rounded drop-shadow-md">
          <div className=" flex flex-col items-center justify-center">
            <p className="text-[16px] font-medium text-[#9FA7BE] mb-2">
              TOTAL WORDS
            </p>
            <p className="text-[20px] font-semibold text-black flex items-center justify-end">
              {loading ? <Spin /> : totalWords}
            </p>
          </div>
          <div className="mr-2">
            <FontAwesomeIcon
              icon={faLanguage}
              className="text-[33px] text-emerald-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-around w-full mb-10 mt-8">
        <div className="w-[30%] bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-start min-w-min">
          <h2 className="text-[17px] font-semibold mb-4">New users</h2>
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-violet-100">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider"
                >
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center">
                    <Spin />
                  </td>
                </tr>
              ) : (
                newUsers?.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2E3856]">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2E3856]">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2E3856]">
                      {user.email}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="w-[30%] bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-start min-w-min">
          <h2 className="text-[17px] font-semibold mb-4">New words</h2>
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-violet-100">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider"
                >
                  Word
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider"
                >
                  Meaning
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center">
                    <Spin />
                  </td>
                </tr>
              ) : (
                newWords?.map((word) => (
                  <tr key={word.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2E3856]">
                      {word.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2E3856]">
                      {word.word}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2E3856]">
                      {word.sino_vietnamese}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="w-[30%] bg-white rounded-lg shadow-md p-6 flex flex-col items-center jusify-start min-w-min">
          <h2 className="text-[17px] font-semibold mb-4">New lessons</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-violet-100">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider"
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center">
                    <Spin />
                  </td>
                </tr>
              ) : (
                newLessons?.map((lesson) => (
                  <tr key={lesson.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2E3856]">
                      {lesson.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2E3856]">
                      {lesson.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2E3856]">
                      {new Date(lesson.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home;
