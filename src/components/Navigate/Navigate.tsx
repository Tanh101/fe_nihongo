import { Route, Routes } from "react-router-dom";
import Navbar from "../Dashboard/Navbar/Navbar";
import SideBar from "../SideBar/SideBar";
import AdminTopic from "../Dashboard/Topic/AdminTopic";
import Lesson from "../Dashboard/Lesson/Lesson";
import Dictionary from "../Dashboard/Dictionary/Dictionary";
import User from "../Dashboard/User/User";
import { useEffect } from "react";
import Home from "../Dashboard/Home/Home";
import { useAppSelector } from "../../redux/store";

function Navigate() {
  const user = useAppSelector((state) => state.user);
  useEffect(() => {
    if (user.user) {
      if (user.user?.role !== "admin") window.location.href = "/learn";
    } else window.location.href = "login";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex w-full h-screen">
      <SideBar></SideBar>
      <div className="flex flex-col w-full">
        <Navbar></Navbar>
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="topic" element={<AdminTopic />} />
          <Route path="lesson" element={<Lesson />} />
          <Route path="dictionary" element={<Dictionary />} />
          <Route path="user" element={<User />} />
        </Routes>
      </div>
    </div>
  );
}

export default Navigate;
