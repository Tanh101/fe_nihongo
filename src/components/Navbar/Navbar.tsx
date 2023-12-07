import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/shibalogo.jpg";
import UserAvatar from "../../assets/default_user.png";
import "./Navbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faStairs,
  faBoltLightning,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
interface Props {
  active_category: string;
}

const Navbar: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const handleLearnClick = () => {
    navigate("/Learn");
  };
  const handleFlashcardClick = () => {
    navigate("/Flashcard");
  };
  const handlePracticeClick = () => {
    navigate("/Practice");
  };
  const handleSearchWordClick = () => {
    navigate("/SearchWord");
  };
  let learnActive: boolean = false;
  let flashcardActive: boolean = false;
  let practiceActive: boolean = false;
  let searchWordActive: boolean = false;

  switch (props.active_category) {
    case "learn":
      learnActive = true;
      break;
    case "flashcard":
      flashcardActive = true;
      break;
    case "practice":
      practiceActive = true;
      break;
    case "search_word":
      searchWordActive = true;
      break;
  }
  return (
    <div className="navbar min-w-min z-30">
      <div className="navbar_logo_container">
        <img src={Logo} alt="" className="logo_img" />
        <div className="navbar_title">
          <span>Shiba Sensei</span>
        </div>
      </div>
      <div className="navbar_buttons_container">
        <button
          className={
            learnActive ? "learn_button active_category" : "learn_button"
          }
          onClick={handleLearnClick}
        >
          <FontAwesomeIcon icon={faBook} />
          &ensp;Learn
        </button>
        <button
          className={
            practiceActive
              ? "practice_button active_category"
              : "practice_button"
          }
          onClick={handlePracticeClick}
        >
          <FontAwesomeIcon icon={faStairs} />
          &ensp;Practice
        </button>
        <button
          className={
            flashcardActive
              ? "flashcard_button active_category"
              : "flashcard_button"
          }
          onClick={handleFlashcardClick}
        >
          <FontAwesomeIcon icon={faBoltLightning} />
          &ensp;Flash Card
        </button>
        <button
          className={
            searchWordActive
              ? "search_word_button active_category"
              : "search_word_button"
          }
          onClick={handleSearchWordClick}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          &ensp;Search Word
        </button>
      </div>
      <div className="user_account">
        <img src={UserAvatar} alt="" className="user_avatar" />
        <span className="user_name">Username</span>
      </div>
    </div>
  );
};

export default Navbar;
