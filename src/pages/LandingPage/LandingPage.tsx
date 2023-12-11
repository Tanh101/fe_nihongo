import { useNavigate } from "react-router-dom";
import "./Landingpage.scss";
import LoginNavbar from "../../components/LoginNavbar/LoginNavbar";
function LandingPage() {
  const navigate = useNavigate(); // Initialize the history object
  const handleClick = () => {
    navigate("/login");
  };

  return (
    <div className="page_container">
      <LoginNavbar landingPage={true}></LoginNavbar>
      <div className="landing_page_background"></div>
      <div className="black_rectangle"></div>
      <div className="landing_page_content">
        <div className="landing_page_content_title">
          <span>Shiba Sensei</span>
        </div>
        <div className="landing_page_content_description">
          <span className="tracking-wider">
            At Shiba Sensei, we understand that embarking on the journey to
            learn Japanese can be both exciting and challenging. That's why
            we're here to guide you step by step, from your very first{" "}
            <strong>"こんにちは"</strong> to confidently navigating
            conversations with native speakers.
          </span>
        </div>
        <div className="landing_page_buttons_container">
          <button
            className="landing_page_login_button bg-gradient-to-r from-blue-500 to-purple-500 hover:brightness-[1.2]"
            onClick={handleClick}
          >
            Let's Start
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
