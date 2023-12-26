import React from "react";
import UserAvatar from "../../../assets/default_user.png";
import { useAppSelector } from "../../../redux/store";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPeopleArrows,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const Navbar: React.FC = () => {
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
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
    <div className="flex flex-row justify-end w-full h-[87px] items-center border-y text-3xl font-bold">
      <div className="h-[70px] w-[40%] flex flex-row items-center justify-end">
        <FontAwesomeIcon
          icon={faPeopleArrows}
          className="cursor-pointer hover:bg-gray-200 rounded-full text-[#2E3856] p-2 text-[20px]"
          onClick={() => navigate("/learn")}
        />
        <Dropdown
          trigger={["click"]}
          menu={{ items: itemsMore }}
          placement="top"
        >
          <div className="flex flex-row profile px-[18px] text-sm items-center justify-around mr-6 w-[200px] h-[70px]  cursor-pointer">
            <div className="notify"></div>
            <img
              className="h-[40px] w-[40px] rounded-full"
              src={UserAvatar}
              alt=""
            />
            <p className="w-[120px] font-semibold text-[16px] text-[#2E3856] ml-5">
              {user.user?.name}
            </p>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default Navbar;
