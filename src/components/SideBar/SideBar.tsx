import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/shibalogo.jpg";
import textlogo from "../../assets/shiba_sensei_logo.png";
import { useState } from "react";
import { MenuItems } from "../../Models/MenuItems"; // Correct the import statement
import { faBars, faChevronRight } from "@fortawesome/free-solid-svg-icons";

function SideBar() {
  const navigate = useNavigate();
  const [isShow, setIsShow] = useState<boolean>(true);
  const [active, setActive] = useState<string>("");

  const handleShowSidebar = () => {
    setIsShow(!isShow);
  };

  const handleLogoClick = () => {
    navigate("/learn");
  };

  return (
    <div
      className={`flex h-screen bg-[#fff] transition-all duration-500 text-white font-roboto border-white ${
        isShow ? "w-72" : "w-20"
      }`}
    >
      <div className="items flex flex-col w-full">
        <div className="flex justify-center h-20 px-2 py-2 border-b items-center cursor-pointer bg-[#fff]">
          {isShow && (
            <div
              className="logo h-[70px] mr-2 ml-2 flex font-bold w-[200px] items-center justify-around text-[#8b5cf6] text-xl font-roboto"
              onClick={handleLogoClick}
            >
              <img className="h-[60px] w-[60px]" src={logo} alt="" />
              <img
                className="h-[35px] w-[130px] object-fit"
                src={textlogo}
                alt=""
              />
            </div>
          )}
          <FontAwesomeIcon
            icon={faBars}
            style={{ color: "#000" }}
            size="xl"
            onClick={handleShowSidebar}
          />
        </div>
        <div
          className={`text-lg w-full text-slate-400 ${isShow ? "px-2" : ""}`}
        >
          <div className="flex px-6 font-sans items-center w-full justify-starrt text-center py-10">
            {isShow && <span className="text-slate-800">Dash menu</span>}
          </div>
          {MenuItems.map((item, index) => {
            return (
              <div className="my-1" key={index}>
                <Link to={item.url}>
                  <div
                    className={`flex items-center font-extrabold text-[16px] w-full justify-between px-6 py-2 cursor-pointer 
                                        text-black transition duration-200 ease-in-out rounded-xl hover:bg-violet-100 hover:text-violet-500
                                         hover:transition hover:delay-50 hover:duration-75 hover:ease-in-out ${
                                           item.title === active
                                             ? "bg-violet-100 rounded-xl text-violet-500"
                                             : "bg-white"
                                         }`}
                    onClick={() => setActive(item.title)}
                  >
                    <div className="menu">
                      <FontAwesomeIcon
                        icon={item.icon}
                        style={
                          item.title == "Home"
                            ? { color: "#8b5cf6" }
                            : { color: "#8b5cf6" }
                        }
                        size={`${isShow ? "sm" : "xl"}`}
                      />
                      {isShow && (
                        <span
                          className={`pl-4 ${
                            item.title === "Home" ? "text-[#8b5cf6]" : ""
                          }`}
                        >
                          {item.title}
                        </span>
                      )}
                    </div>
                    {isShow && (
                      <div className="">
                        <FontAwesomeIcon
                          icon={faChevronRight}
                          style={
                            item.title === "Home"
                              ? { color: "#8b5cf6" }
                              : { color: "#8b5cf6" }
                          }
                          size="xs"
                        />
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SideBar;
