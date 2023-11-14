import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import LandingPage from "./pages/LandingPage/LandingPage";
import Learn from "./pages/Learn/Learn";
import PracticePage from "./pages/Practice/PracticePage";
import FlashcardPage from "./pages/FlashcardPage/FlashcardPage";
import SearchWordPage from "./pages/SearchWordPage/SearchWordPage";
import "font-awesome/css/font-awesome.min.css";
import LessonPage from "./pages/LessonPage/LessonPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Router>
    <Routes>
      <Route path="" element={<LandingPage />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Learn" element={<Learn />} />
      <Route path="/Practice" element={<PracticePage />} />
      <Route path="/Flashcard" element={<FlashcardPage />} />
      <Route path="/SearchWord" element={<SearchWordPage />} />
      <Route path="/Lessons/:lessonId" element={<LessonPage />} />
    </Routes>
  </Router>
);
