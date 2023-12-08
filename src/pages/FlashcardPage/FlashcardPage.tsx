import "./FlashcardPage.scss";
import { Tooltip } from "antd";
import Navbar from "../../components/Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function FlashcardPage() {
  const navigate = useNavigate();
  const handleCreate = () => {
    navigate("/create_flashcard");
  };
  return (
    <div className="page_container">
      <Navbar active_category="flashcard"></Navbar>
      <div className="flashcard_page_content overflow-y-scroll">
        <div className="flashcard_page_title_container">
          <p className="flashcard_page_title text-3xl font-semibold text-black text-center">
            Your Flashcards
          </p>
          <Tooltip placement="left" title="Create new" arrow={true}>
            <button
              className="add_flashcard_button w-[60px] h-[60px] rounded-full bg-blue-500 text-white fixed right-24 bottom-24 hover:bg-blue-400"
              onClick={handleCreate}
            >
              <FontAwesomeIcon
                icon={faPlus}
                style={{ color: "#ffffff" }}
                size="lg"
              />
            </button>
          </Tooltip>
        </div>
        <div className="flashcards_list"></div>
      </div>
    </div>
  );
}

export default FlashcardPage;
