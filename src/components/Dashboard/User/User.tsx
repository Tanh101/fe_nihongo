import Search from "./Search";
import { userModel } from "../../../Models/Users";
import React, { useEffect, useState } from "react";
import customAxios from "../../../api/AxiosInstance";
import BasicTable from "./BasicTable";

const User: React.FC<{ userdata: userModel[] }> = () => {
  const [users, setUsers] = useState<userModel[]>([]);

  const formatDate = (date: string) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await customAxios.get("/dashboard/users");
      if (res.status === 200) {
        const userMaping = res.data.users.map((user: userModel) => {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            dob: user.dob ?? "N/A",
            phone_number: user.phone_number ?? "N/A",
            gender: user.gender ?? "N/A",
            status: user.status,
            created_at: formatDate(user.created_at),
          };
        });
        setUsers(userMaping);
      }
    };

    fetchData();
  }, []);

  const handleSeachChange = (newSearchData: userModel[]) => {
    setUsers(newSearchData);
  };

  return (
    <div className="flex flex-1 h-screen text-lg bg-[#e8eff9] w-full">
      <div className="flex-row flex-1">
        <div className="search h-[100px]">
          <Search onSearchChange={handleSeachChange}></Search>
        </div>
        <div className="flex justify-center text-end items-center ">
          <div className="flex flex-1 justify-center items-center w-full mx-10 rounded-xl bg-white">
            <BasicTable userdata={users}></BasicTable>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
