import React from "react";
import user from "../../../assets/default_user.png";

const Navbar: React.FC = () => {
  return (
    <div className="flex justify-end w-full h-20 items-center border-y text-3xl font-bold">
      <div className="flex profile px-5 text-sm items-center mr-6 w-[200px] h-[70px] justify-around">
        <div className="notify"></div>
        <img className="h-[40px] w-[40px] rounded-full" src={user} alt="" />
        <p className="w-[120px] font-semibold text-[16px] ml-5">VanTanhLy</p>
      </div>
    </div>
  );
};

export default Navbar;
