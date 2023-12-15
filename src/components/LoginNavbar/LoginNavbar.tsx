import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/shibalogo.jpg";
import "./LoginNavbar.scss";
import TextLogo from "../../assets/shiba_sensei_logo.png";

interface Props {
  landingPage: boolean;
}

const LoginNavbar: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/login");
  };
  const handleRegisterClick = () => {
    navigate("/register");
  };
  return (
    <div className="login_navbar">
      <div className="login_navbar_logo_container">
        <img src={Logo} alt="" className="logo_img" />
        <img
          src={TextLogo}
          alt=""
          className="text_logo_img object-fit w-[130px] h-[35px]"
        />
      </div>
      {props.landingPage ? (
        <div></div>
      ) : (
        <div className="login_navbar_buttons_container">
          <button
            className="login_button button2 bg-gradient-to-r from-blue-500 to-purple-500 hover:brightness-[1.2] text-white"
            onClick={handleLoginClick}
          >
            Log In
          </button>
          <button
            className="register_button button1 bg-gradient-to-r from-blue-500 to-purple-500 inline-block bg-clip-text text-transparent font-bold hover:brightness-[1.2]"
            onClick={handleRegisterClick}
          >
            <span className="button-content">Register</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginNavbar;
