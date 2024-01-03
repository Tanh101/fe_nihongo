import { useState, useEffect } from "react";
import "./FlashcardPage.scss";
import { Tooltip } from "antd";
import Navbar from "../../components/Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { FlashCardDeck } from "../../components/Definition";
import FlashCardShowCase from "../../components/FlashCardShowCase/FlashCardShowCase";
import customAxios from "../../api/AxiosInstance";
import LoadingShiba from "../../components/Loading/LoadingShiba";

function FlashcardPage() {
  const [flashcardDecks, setFlashcardDecks] = useState<FlashCardDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleCreate = () => {
    navigate("/create_flashcard");
  };
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    if (!access_token && !refresh_token) {
      navigate("/login");
    }
    customAxios.get("/flashcard").then((res) => {
      setFlashcardDecks(res.data.flashcards);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page_container bg-[#F6F7FB]">
      <Navbar active_category="flashcard"></Navbar>
      {loading === false ? (
        <div>
          <div className="flashcard_page_content overflow-y-scroll">
            <div className="flashcard_page_title_container">
              <p className="flashcard_page_title text-3xl font-semibold text-black text-center">
                Your Flashcards
              </p>
              <Tooltip placement="left" title="Create new" arrow={true}>
                <button
                  className="create_new_flashcard_button w-[60px] h-[60px] rounded-full bg-violet-500 text-white fixed right-24 bottom-24 hover:bg-violet-400"
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
            <div className="flashcards_list flex flex-col justify-center items-center mt-4">
              {flashcardDecks &&
                flashcardDecks?.length > 0 &&
                flashcardDecks?.map((deck) => (
                  <FlashCardShowCase key={deck?.id} flashCardDeck={deck} />
                ))}
            </div>
          </div>
        </div>
      ) : null}
      {loading && <LoadingShiba />}
    </div>
  );
}

export default FlashcardPage;
