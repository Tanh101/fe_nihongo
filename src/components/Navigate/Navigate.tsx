import { Route, Routes } from "react-router-dom"
import Navbar from "../Dashboard/Navbar/Navbar"
import SideBar from "../SideBar/SideBar"
import Topic from "../Dashboard/Topic/Topic"
import Lesson from "../Dashboard/Lesson/Lesson"
import Dictionary from "../Dashboard/Dictionary/Dictionary"
import User from "../Dashboard/User/User"
import { useEffect } from "react"
import Home from "../Dashboard/Home/Home"

function Navigate() {
    useEffect(() => {
    }, []);
    return (
        <div className="flex w-full h-screen">
            <SideBar></SideBar>
            <div className="flex flex-col w-full">
                <Navbar></Navbar>
                <Routes>
                    <Route path="home" element={<Home />} />
                    <Route path="topic" element={<Topic />} />
                    <Route path="lesson" element={<Lesson />} />
                    <Route path="dicitonary" element={<Dictionary />} />
                    <Route path="user" element={<User />} />
                </Routes>
            </div>
        </div>
    )
}

export default Navigate