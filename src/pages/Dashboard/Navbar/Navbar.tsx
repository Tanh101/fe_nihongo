import logo from '../../../assets/shibalogo.jpg';
import user from '../../../assets/default_user.png';

function Navbar() {
    return (
        <div className="nav flex justify-between px-10 items-center h-20 border text-3xl font-bold">
            <div className="logo h-16 w-50 flex text-lg justify-center items-center">
                <img className="w-16 h-16" src={logo} alt="" />
                Shiba
            </div>
            <h1>Create new topic</h1>
            <div className="profile h-10 w-10">
                <img src={user} alt="" />
            </div>
        </div>
    )
}

export default Navbar