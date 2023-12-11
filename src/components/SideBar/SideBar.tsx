import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import logo from '../../assets/shibalogo.jpg';
import { useState } from "react";
import { MenuItems } from "../../Models/MenuItems"; // Correct the import statement
import { faBars, faChevronRight } from "@fortawesome/free-solid-svg-icons";

function SideBar() {
    const [isShow, setIsShow] = useState<boolean>(true);
    const [active, setActive] = useState<string>("Home");

    const handleShowSidebar = () => {
        setIsShow(!isShow);
    }

    return (
        <div className={`flex h-screen bg-[#fff] transition-all duration-500 text-white font-roboto border-white ${isShow ? 'w-72' : 'w-20'}`}>
            <div className="items flex flex-col w-full">
                <div className="flex justify-center h-20 px-2 py-2 border-b items-center cursor-pointer bg-[#fff]">
                    {isShow && (
                        <div className="logo h-10 mr-2 flex font-bold w-full items-center text-[#f50753] text-xl font-roboto">
                            <img className="h-10 w-10" src={logo} alt="" />
                            <h1 className="transition duration-700 ease-in-out ml-2">Shiba</h1>
                        </div>
                    )}
                    <FontAwesomeIcon icon={faBars} style={{ color: "#000" }} size="xl"
                        onClick={handleShowSidebar} />
                </div>
                <div className={`text-lg w-full text-slate-400 ${isShow ? "px-2" : ""}`}>

                    <div className="flex px-6 font-sans items-center w-full justify-starrt text-center py-10">
                        {isShow && (<span className="text-slate-800">Dash menu</span>
                        )}
                    </div>
                    {
                        MenuItems.map((item, index) => {
                            return (
                                <div className="my-1" key={index}>
                                    <Link to={item.url}>
                                        <div className={`flex items-center font-extrabold text-[16px] w-full justify-between px-6 py-2 cursor-pointer 
                                        text-black transition duration-200 ease-in-out rounded-xl hover:bg-slate-300 hover:text-white
                                         hover:transition hover:delay-150 hover:duration-75 hover:ease-in-out ${item.title===active ? "bg-slate-300 rounded-xl" : "bg-white"}` }
                                         onClick={() => setActive(item.title)}>
                                            <div className="menu">
                                                <FontAwesomeIcon icon={item.icon} style={item.title == "Home" ? { color: "#f50753" } : { color: "#f50753" }}
                                                    size={`${isShow ? "sm" : "xl"}`} />
                                                {isShow && (
                                                    <span className={`pl-4 ${item.title === 'Home' ? "text-[#f50753]" : ""}`}>{item.title}</span>
                                                )}
                                            </div>
                                            {isShow && (
                                                <div className="">
                                                    <FontAwesomeIcon icon={faChevronRight} style={item.title === "Home" ? { color: "#f50753" } : { color: "#f50753" }}
                                                        size="xs" />
                                                </div>
                                            )}
                                        </div>
                                        
                                    </Link>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default SideBar;
