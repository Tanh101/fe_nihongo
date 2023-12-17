import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/shibalogo.jpg";
import UserAvatar from "../../assets/default_user.png";
import "./Navbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faGraduationCap,
  faPen,
  faBoltLightning,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
interface Props {
  active_category: string;
}
import TextLogo from "../../assets/shiba_sensei_logo.png";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";

const Navbar: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const handleLearnClick = () => {
    navigate("/learn");
  };
  const handleFlashcardClick = () => {
    navigate("/flashcard");
  };
  const handlePracticeClick = () => {
    navigate("/practice");
  };
  const handleDictionaryClick = () => {
    navigate("/dictionary");
  };
  let learnActive: boolean = false;
  let flashcardActive: boolean = false;
  let practiceActive: boolean = false;
  let DictionaryActive: boolean = false;

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
      DictionaryActive = true;
      break;
  }

  const handleLogoClick = () => {
    navigate("/learn");
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const itemsMore: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <button
          className=" w-full h-[30px] text-[16px] font-semibold text-[#2E3856] flex flex-row items-center justify-center"
          onClick={handleLogout}
        >
          Logout &nbsp;
          <FontAwesomeIcon icon={faRightFromBracket} className="text-red-500" />
        </button>
      ),
    },
  ];
  return (
    <div className="navbar min-w-min z-30">
      <div
        className="navbar_logo_container cursor-pointer"
        onClick={handleLogoClick}
      >
        <img src={Logo} alt="" className="logo_img" />
        <img
          src={TextLogo}
          alt=""
          className="text_logo_img object-fit w-[130px] h-[35px]"
        />
      </div>
      <div className="navbar_buttons_container">
        <button
          className={
            learnActive ? "learn_button active_category" : "learn_button"
          }
          onClick={handleLearnClick}
        >
          <FontAwesomeIcon icon={faGraduationCap} />
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
          <FontAwesomeIcon icon={faPen} />
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
            DictionaryActive
              ? "search_word_button active_category"
              : "search_word_button"
          }
          onClick={handleDictionaryClick}
        >
          <FontAwesomeIcon icon={faBook} />
          &ensp;Dictionary
        </button>
      </div>
      <Dropdown trigger={["click"]} menu={{ items: itemsMore }} placement="top">
        <div className="user_account cursor-pointer">
          <img src={UserAvatar} alt="" className="user_avatar" />
          <span className="user_name text-[#2E3856]">Username</span>
        </div>
      </Dropdown>
    </div>
  );
};

export default Navbar;
