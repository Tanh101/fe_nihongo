import SideBar from '../../components/SideBar/SideBar'

function Dashboard() {
    return (
        <div className='flex'>
            <SideBar></SideBar>
            <div className="dashboard">
                <h1>Dashboard</h1>
            </div>
        </div>
    )
}

export default Dashboard