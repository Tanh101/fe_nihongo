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
import { ToastContainer } from "react-toastify";
import WordDetailPage from "./pages/WordDetailPage/WordDetailPage";
import Navigate from "./components/Navigate/Navigate";
import CreateFlashcardPage from "./pages/FlashcardPage/CreateFlashCardPage";
import LearnFlashCardPage from "./pages/FlashcardPage/LearnFlashCardPage";
import EditFlashcardPage from "./pages/FlashcardPage/EditFlashCardPage";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../src/redux/store";
import AddTopicLessonPage from "./components/Dashboard/Topic/AddTopicLessonPage";
import EditLessonPage from "./components/Dashboard/Lesson/EditLessonPage";
import CreateDictionaryPage from "./components/Dashboard/Dictionary/CreateDictionaryPage";
import EditDictionaryPage from "./components/Dashboard/Dictionary/EditDictionaryPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
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
          <Route path="/create_flashcard" element={<CreateFlashcardPage />} />
          <Route
            path="/flashcard/:flashCardDeckId"
            element={<LearnFlashCardPage />}
          />
          <Route
            path="edit_flashcard/:flashCardDeckId"
            element={<EditFlashcardPage />}
          />
          <Route
            path="/dashboard/topic/:topicId/add_lesson"
            element={<AddTopicLessonPage />}
          />
          <Route
            path="/dashboard/lessons/edit_lesson/:lessonId"
            element={<EditLessonPage />}
          />
          <Route
            path="/dashboard/create_dictionary"
            element={<CreateDictionaryPage />}
          />
          <Route
            path="/dashboard/edit_dictionary/:wordContent"
            element={<EditDictionaryPage />}
          />
        </Routes>

        <ToastContainer />
      </Router>
    </PersistGate>
  </Provider>
);
