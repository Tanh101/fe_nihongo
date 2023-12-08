import DataTable from "./BasicTable"
import Search from "./Search"

function User() {
    return (
        <div className="flex h-screen text-lg bg-[#e8eff9]">
            <div className="flex-row flex-1">
                <div className="search h-1/5">
                    <Search></Search>
                </div>
                <div className="flex justify-center text-end items-center ">
                    <div className="w-full mx-10 rounded-xl bg-white">
                        <DataTable></DataTable>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default User
