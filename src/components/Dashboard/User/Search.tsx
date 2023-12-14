import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react";
import customAxios from "../../../api/AxiosInstance";
import { userModel } from "../../../Models/Users";

const Search = ({ onSearchChange }: { onSearchChange: (users: userModel[]) => void }) => {
    const [search, setSearch] = useState<string>("");

    const handleSearch = async () => {
        const res = await customAxios.get(`/dashboard/users?name=${search}`);
        if (res.status === 200) {
            onSearchChange(res.data.users);
        }
    }

    return (
        <div className="search-input flex items-center justify-center mt-10">
            <div className="relative">
                <div
                    className="font-roboto text-sm fa-xl fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 transform text-blue-400">
                    <FontAwesomeIcon icon={faSearch} size="xl"></FontAwesomeIcon>
                </div>
                <input type="text" id="name"
                    className="w-96 rounded-3xl border py-2 pl-10 focus:border-red-500 focus:outline-none"
                    placeholder="Enter user name"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-3xl bg-[#f50753] px-5 py-1 text-center text-white"
                    onClick={handleSearch}>
                    Find

                </button>
            </div>
        </div>
    )
}

export default Search
