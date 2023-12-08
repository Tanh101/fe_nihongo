import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import LandingPage from "./pages/LandingPage/LandingPage";
import Learn from "./pages/Learn/Learn";
import PracticePage from "./pages/Practice/PracticePage";
import FlashcardPage from "./pages/FlashcardPage/FlashcardPage";
import DictionaryPage from "./pages/DictionaryPage/DictionaryPage";
import "font-awesome/css/font-awesome.min.css";
import LessonPage from "./pages/LessonPage/LessonPage";
import { ToastContainer } from 'react-toastify';
import Lesson from "./components/Dashboard/Lesson/Lesson";
import WordDetailPage from "./pages/WordDetailPage/WordDetailPage";
import Navigate from "./components/Navigate/Navigate";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Router>
    <Routes>
      <Route path="" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/learn" element={<Learn />} />
      <Route path="/practice" element={<PracticePage />} />
      <Route path="/flashcard" element={<FlashcardPage />} />
      <Route path="/dictionary" element={<DictionaryPage />} />
      <Route path="/lessons/:lessonId" element={<LessonPage />} />
      <Route path="/dictionary/:word" element={<WordDetailPage />} />
      <Route path="/dashboard/*" element={<Navigate />} />
    </Routes>
    <ToastContainer />
  </Router>
);
